import { useMemo, useState, useEffect } from "react";
import {
    ScrollView,
    StyleSheet,
    Text,
    View,
    Pressable,
    Linking,
    Alert,
    ActivityIndicator,
} from "react-native";
import * as WebBrowser from "expo-web-browser";
import { SafeAreaView } from "react-native-safe-area-context";

import { TabSwipeView } from "@/components/tab-swipe-view";
import { TAB_ROUTES } from "@/constants/tab-routes";

type EventCategory = "beach" | "volleyball";
type YearFilter = "upcoming" | number;

type GenderFilter = "all" | string;
type OrganizerTypeFilter = "all" | string;

type ApiEvent = {
    season?: number;
    countrycode?: string;
    name: string;
    gender?: string;
    startdate?: string;
    enddate?: string;
    orangizertype?: string;
    type?: string;
    website?: string;
};

const API_BASE_URL = "http://45.131.109.42:3000";

const YEAR_OPTIONS: YearFilter[] = (() => {
    const currentYear = new Date().getFullYear();
    const years: YearFilter[] = ["upcoming"];
    for (let y = currentYear; y >= 2000; y -= 1) years.push(y);
    return years;
})();

function formatShortDateRange(startISO?: string, endISO?: string) {
    const normalize = (v?: string) => {
        const s = String(v ?? "").trim();
        if (!s) return "";
        if (s.toLowerCase() === "null" || s.toLowerCase() === "none") return "";
        if (s === "0000-00-00") return "";
        return s;
    };

    const startStr = normalize(startISO);
    const endStr = normalize(endISO);

    if (!startStr) return "TBA";

    const parseISODate = (s: string) => {
        // Expecting YYYY-MM-DD (your API now returns this)
        if (!/^\d{4}-\d{2}-\d{2}$/.test(s)) return null;
        const d = new Date(`${s}T00:00:00`);
        return Number.isNaN(d.getTime()) ? null : d;
    };

    const start = parseISODate(startStr);
    if (!start) return "TBA";

    const end = endStr ? parseISODate(endStr) : null;

    const monthDay = new Intl.DateTimeFormat(undefined, { month: "short", day: "numeric" });

    if (!end) return monthDay.format(start);

    const sameYear = start.getFullYear() === end.getFullYear();
    const sameMonth = sameYear && start.getMonth() === end.getMonth();

    if (sameMonth) return `${monthDay.format(start)}–${end.getDate()}`;
    return `${monthDay.format(start)}–${monthDay.format(end)}`;
}

function domainFromUrl(url: string) {
    try {
        const u = new URL(/^https?:\/\//i.test(url) ? url : `https://${url}`);
        return u.hostname.replace(/^www\./i, "");
    } catch {
        return url;
    }
}

type ChipProps = {
    label: string;
    selected?: boolean;
    onPress: () => void;
};

function Chip({ label, selected, onPress }: ChipProps) {
    return (
        <Pressable
            onPress={onPress}
            accessibilityRole="button"
            accessibilityState={{ selected: !!selected }}
            style={({ pressed }) => [styles.chip, selected && styles.chipSelected, pressed && styles.chipPressed]}
        >
            <Text style={[styles.chipText, selected && styles.chipTextSelected]}>{label}</Text>
        </Pressable>
    );
}

export default function EventsScreen() {
    const [category, setCategory] = useState<EventCategory>("beach");
    const [year, setYear] = useState<YearFilter>("upcoming");
    const [gender, setGender] = useState<GenderFilter>("all");
    const [organizerType, setOrganizerType] = useState<OrganizerTypeFilter>("all");

    const [events, setEvents] = useState<ApiEvent[]>([]);
    const [loading, setLoading] = useState(false);
    const [loadError, setLoadError] = useState<string | null>(null);

    const openWebsite = async (rawUrl: string) => {
        const url = rawUrl.trim();
        const normalizedUrl = /^https?:\/\//i.test(url) ? url : `https://${url}`;

        try {
            await WebBrowser.openBrowserAsync(normalizedUrl);
        } catch {
            try {
                const can = await Linking.canOpenURL(normalizedUrl);
                if (can) {
                    await Linking.openURL(normalizedUrl);
                    return;
                }
            } catch {
                // ignore
            }
            Alert.alert("Couldn't open website", "Please try again later.");
        }
    };

    useEffect(() => {
        const controller = new AbortController();

        const load = async () => {
            setLoading(true);
            setLoadError(null);

            try {
                const params = new URLSearchParams();
                params.set("sport", category);
                params.set("year", year === "upcoming" ? "upcoming" : String(year));

                const url = `${API_BASE_URL}/events?${params.toString()}`;

                const res = await fetch(url, {
                    method: "GET",
                    headers: { Accept: "application/json" },
                    signal: controller.signal,
                });

                if (!res.ok) {
                    throw new Error(`Request failed: ${res.status}`);
                }

                const json = (await res.json()) as unknown;

                if (!Array.isArray(json)) {
                    throw new Error("Unexpected API response");
                }

                setEvents(json as ApiEvent[]);
            } catch (e: unknown) {
                if ((e as { name?: string }).name === "AbortError") return;
                setEvents([]);
                setLoadError(e instanceof Error ? e.message : "Failed to load events");
            } finally {
                setLoading(false);
            }
        };

        load();
        return () => controller.abort();
    }, [category, year]);

    const availableGenders = useMemo(() => {
        const values = Array.from(
            new Set(
                events
                    .map((e) => (e.gender ?? "").trim())
                    .filter((g) => g.length > 0),
            ),
        );
        return values.sort((a, b) => a.localeCompare(b));
    }, [events]);

    const availableOrganizerTypes = useMemo(() => {
        const values = Array.from(
            new Set(
                events
                    .map((e) => (e.orangizertype ?? "").trim())
                    .filter((v) => v.length > 0),
            ),
        );
        return values.sort((a, b) => a.localeCompare(b));
    }, [events]);

    const filteredEvents = useMemo(() => {
        const list = events.filter((e) => {
            if (gender !== "all") {
                const g = (e.gender ?? "").trim();
                if (g !== gender) return false;
            }

            if (organizerType !== "all") {
                const o = (e.orangizertype ?? "").trim();
                if (o !== organizerType) return false;
            }

            return true;
        });

        // IMPORTANT: copy before sorting + sort by real dates
        return [...list].sort((a, b) => {
            if (!a.startdate && !b.startdate) return 0;
            if (!a.startdate) return 1;
            if (!b.startdate) return -1;

            return (
                new Date(a.startdate).getTime() -
                new Date(b.startdate).getTime()
            );
        });
    }, [events, gender, organizerType]);

    return (
        <TabSwipeView routes={TAB_ROUTES}>
            <SafeAreaView style={styles.safeArea} edges={["top"]}>
                <View style={styles.screen}>
                    <View style={styles.header}>
                        <Text style={styles.title}>Events</Text>
                        <Text style={styles.subtitle}>Filter by sport, year, gender, and organizer</Text>
                    </View>

                    <View style={styles.controlsCard}>
                        <View style={styles.section}>
                            <Text style={styles.sectionLabel}>Sport</Text>
                            <View style={styles.rowWrap}>
                                <Chip
                                    label="Beach volleyball"
                                    selected={category === "beach"}
                                    onPress={() => setCategory("beach")}
                                />
                                <Chip
                                    label="Volleyball"
                                    selected={category === "volleyball"}
                                    onPress={() => setCategory("volleyball")}
                                />
                            </View>
                        </View>

                        <View style={styles.section}>
                            <Text style={styles.sectionLabel}>Year</Text>
                            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.row}>
                                {YEAR_OPTIONS.map((y) => (
                                    <Chip
                                        key={String(y)}
                                        label={y === "upcoming" ? "Upcoming" : String(y)}
                                        selected={year === y}
                                        onPress={() => setYear(y)}
                                    />
                                ))}
                            </ScrollView>
                        </View>

                        <View style={styles.section}>
                            <Text style={styles.sectionLabel}>Gender</Text>
                            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.row}>
                                <Chip label="All" selected={gender === "all"} onPress={() => setGender("all")} />
                                {availableGenders.map((g) => (
                                    <Chip key={g} label={g} selected={gender === g} onPress={() => setGender(g)} />
                                ))}
                            </ScrollView>
                        </View>

                        <View style={styles.section}>
                            <Text style={styles.sectionLabel}>Organizer type</Text>
                            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.row}>
                                <Chip
                                    label="All"
                                    selected={organizerType === "all"}
                                    onPress={() => setOrganizerType("all")}
                                />
                                {availableOrganizerTypes.map((o) => (
                                    <Chip
                                        key={o}
                                        label={o}
                                        selected={organizerType === o}
                                        onPress={() => setOrganizerType(o)}
                                    />
                                ))}
                            </ScrollView>
                        </View>
                    </View>

                    <ScrollView contentContainerStyle={styles.listContainer} showsVerticalScrollIndicator={false}>
                        <View style={styles.resultsRow}>
                            <Text style={styles.resultsText}>
                                {loading
                                    ? "Loading…"
                                    : `Showing ${filteredEvents.length} ${
                                          filteredEvents.length === 1 ? "event" : "events"
                                      }`}
                            </Text>

                            <Pressable
                                onPress={() => {
                                    setYear("upcoming");
                                    setGender("all");
                                    setOrganizerType("all");
                                }}
                                accessibilityRole="button"
                                style={({ pressed }) => [styles.resetBtn, pressed && styles.resetBtnPressed]}
                            >
                                <Text style={styles.resetBtnText}>Reset</Text>
                            </Pressable>
                        </View>

                        {loading && (
                            <View style={styles.stateBox}>
                                <ActivityIndicator />
                                <Text style={styles.stateText}>Fetching events…</Text>
                            </View>
                        )}

                        {!loading && !!loadError && (
                            <View style={styles.stateBox}>
                                <Text style={styles.stateTitle}>Couldn’t load events</Text>
                                <Text style={styles.stateText}>{loadError}</Text>
                            </View>
                        )}

                        {!loading && !loadError && filteredEvents.length === 0 && (
                            <View style={styles.stateBox}>
                                <Text style={styles.stateTitle}>No matches</Text>
                                <Text style={styles.stateText}>Try changing year or gender.</Text>
                            </View>
                        )}

                        {!loading &&
                            !loadError &&
                            filteredEvents.map((event, idx) => {
                                const countryCode = (event.countrycode ?? "").trim();
                                const season = event.season;
                                const genderLabel = (event.gender ?? "").trim();
                                const organizerType = (event.orangizertype ?? "").trim();
                                const type = (event.type ?? "").trim();

                                const datePill = formatShortDateRange(event.startdate, event.enddate);

                                return (
                                    <View key={`${event.name}-${idx}`} style={styles.card}>
                                        <View style={styles.cardTopRow}>
                                            <Text style={styles.cardTitle} numberOfLines={2}>
                                                {event.name}
                                            </Text>

                                            {!!countryCode && (
                                                <View style={styles.countryPill}>
                                                    <Text style={styles.countryPillText}>{countryCode}</Text>
                                                </View>
                                            )}
                                        </View>

                                        <View style={styles.pillsRow}>
                                            <View style={styles.pill}>
                                                <Text style={styles.pillText}>{datePill}</Text>
                                            </View>

                                            {typeof season === "number" && (
                                                <View style={styles.pillMuted}>
                                                    <Text style={styles.pillMutedText}>{season}</Text>
                                                </View>
                                            )}

                                            {!!genderLabel && (
                                                <View style={styles.pillMuted}>
                                                    <Text style={styles.pillMutedText}>{genderLabel}</Text>
                                                </View>
                                            )}
                                        </View>

                                        {(!!type || !!organizerType) && (
                                            <View style={styles.infoBlock}>
                                                {!!type && (
                                                    <View style={styles.infoRow}>
                                                        <Text style={styles.infoLabel}>Type</Text>
                                                        <Text style={styles.infoValue} numberOfLines={1}>
                                                            {type}
                                                        </Text>
                                                    </View>
                                                )}

                                                {!!organizerType && (
                                                    <View style={styles.infoRow}>
                                                        <Text style={styles.infoLabel}>Organizer</Text>
                                                        <Text style={styles.infoValue} numberOfLines={1}>
                                                            {organizerType}
                                                        </Text>
                                                    </View>
                                                )}
                                            </View>
                                        )}

                                        {!!event.website && (
                                            <Pressable
                                                accessibilityRole="link"
                                                onPress={() => openWebsite(event.website!)}
                                                style={({ pressed }) => [styles.websiteRow, pressed && styles.websiteRowPressed]}
                                                hitSlop={8}
                                            >
                                                <Text style={styles.websiteLabel}>Website</Text>
                                                <Text style={styles.websiteValue} numberOfLines={1}>
                                                    {domainFromUrl(event.website)}
                                                </Text>
                                            </Pressable>
                                        )}
                                    </View>
                                );
                            })}
                    </ScrollView>
                </View>
            </SafeAreaView>
        </TabSwipeView>
    );
}

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: "#F6F8FC",
    },
    screen: {
        flex: 1,
        backgroundColor: "#F6F8FC",
    },
    header: {
        paddingHorizontal: 20,
        paddingTop: 18, // extra breathing room below the status bar
        paddingBottom: 14,
    },
    title: {
        fontSize: 30,
        fontWeight: "900",
        color: "#0B1324",
        letterSpacing: 0.2,
    },
    subtitle: {
        marginTop: 8,
        fontSize: 14,
        color: "#66758C",
        fontWeight: "600",
        lineHeight: 20,
    },

    controlsCard: {
        marginHorizontal: 16,
        marginBottom: 10,
        padding: 14,
        backgroundColor: "#FFFFFF",
        borderRadius: 18,
        borderWidth: 1,
        borderColor: "#E7ECF5",
        shadowColor: "#0B1324",
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.06,
        shadowRadius: 18,
        elevation: 2,
        gap: 12,
    },
    section: {
        gap: 8,
    },
    sectionLabel: {
        fontSize: 12,
        fontWeight: "900",
        color: "#0B1324",
        letterSpacing: 0.6,
        textTransform: "uppercase",
    },
    row: {
        gap: 10,
        paddingRight: 8,
    },
    rowWrap: {
        flexDirection: "row",
        flexWrap: "wrap",
        gap: 10,
    },

    chip: {
        borderRadius: 999,
        paddingHorizontal: 12,
        paddingVertical: 8,
        backgroundColor: "#F2F5FB",
        borderWidth: 1,
        borderColor: "#E5EAF4",
    },
    chipSelected: {
        backgroundColor: "#0F2A5F",
        borderColor: "#0F2A5F",
    },
    chipPressed: {
        opacity: 0.85,
    },
    chipText: {
        fontSize: 13,
        fontWeight: "800",
        color: "#314057",
    },
    chipTextSelected: {
        color: "#FFFFFF",
    },

    listContainer: {
        paddingHorizontal: 16,
        paddingTop: 12,
        paddingBottom: 160,
        gap: 12,
    },

    resultsRow: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        gap: 12,
        marginBottom: 10,
        paddingHorizontal: 4,
    },
    resultsText: {
        color: "#55657E",
        fontSize: 13,
        fontWeight: "800",
    },
    resultsStrong: {
        color: "#0B1324",
        fontWeight: "900",
    },

    emptyBox: {
        backgroundColor: "#FFFFFF",
        borderRadius: 16,
        padding: 14,
        marginBottom: 16,
        borderWidth: 1,
        borderColor: "#E7ECF5",
    },
    emptyTitle: {
        color: "#0B1324",
        fontSize: 14,
        fontWeight: "900",
    },
    emptyText: {
        marginTop: 6,
        color: "#55657E",
        fontSize: 13,
        fontWeight: "600",
    },

    card: {
        backgroundColor: "#FFFFFF",
        borderRadius: 20,
        padding: 16,
        borderWidth: 1,
        borderColor: "#E7ECF5",
        shadowColor: "#0B1324",
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.06,
        shadowRadius: 18,
        elevation: 2,
    },

    cardTopRow: {
        flexDirection: "row",
        alignItems: "flex-start",
        justifyContent: "space-between",
        gap: 12,
    },
    cardTitle: {
        flex: 1,
        fontSize: 18,
        fontWeight: "900",
        color: "#0B1324",
        letterSpacing: 0.2,
        lineHeight: 23,
    },

    countryPill: {
        paddingHorizontal: 10,
        paddingVertical: 5,
        borderRadius: 999,
        backgroundColor: "#E9F1FF",
        borderWidth: 1,
        borderColor: "#D7E6FF",
    },
    countryPillText: {
        fontSize: 12,
        fontWeight: "900",
        color: "#1C4ED8",
        letterSpacing: 0.4,
    },

    pillsRow: {
        marginTop: 10,
        flexDirection: "row",
        flexWrap: "wrap",
        gap: 8,
    },
    pill: {
        paddingHorizontal: 10,
        paddingVertical: 6,
        borderRadius: 999,
        backgroundColor: "#0F2A5F",
    },
    pillText: {
        fontSize: 12,
        fontWeight: "900",
        color: "#FFFFFF",
        letterSpacing: 0.2,
    },
    pillMuted: {
        paddingHorizontal: 10,
        paddingVertical: 6,
        borderRadius: 999,
        backgroundColor: "#F2F5FB",
        borderWidth: 1,
        borderColor: "#E5EAF4",
    },
    pillMutedText: {
        fontSize: 12,
        fontWeight: "900",
        color: "#314057",
        letterSpacing: 0.2,
    },

    infoBlock: {
        marginTop: 12,
        gap: 8,
        paddingTop: 10,
        borderTopWidth: 1,
        borderTopColor: "#EEF2FA",
    },
    infoRow: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        gap: 12,
    },
    infoLabel: {
        fontSize: 12,
        fontWeight: "900",
        color: "#66758C",
        textTransform: "uppercase",
        letterSpacing: 0.6,
    },
    infoValue: {
        flex: 1,
        textAlign: "right",
        fontSize: 13,
        fontWeight: "800",
        color: "#0B1324",
    },

    websiteRow: {
        marginTop: 12,
        paddingTop: 10,
        borderTopWidth: 1,
        borderTopColor: "#EEF2FA",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        gap: 12,
    },
    websiteRowPressed: {
        opacity: 0.75,
    },
    websiteLabel: {
        fontSize: 12,
        fontWeight: "900",
        color: "#66758C",
        textTransform: "uppercase",
        letterSpacing: 0.6,
    },
    websiteValue: {
        flex: 1,
        textAlign: "right",
        fontSize: 13,
        fontWeight: "900",
        color: "#1C4ED8",
        textDecorationLine: "underline",
    },

    // Add these (they are referenced by the loading/error/empty states)
    stateBox: {
        backgroundColor: "#FFFFFF",
        borderRadius: 16,
        padding: 14,
        borderWidth: 1,
        borderColor: "#E7ECF5",
        gap: 8,
    },
    stateTitle: {
        color: "#0B1324",
        fontSize: 14,
        fontWeight: "900",
    },
    stateText: {
        color: "#55657E",
        fontSize: 13,
        fontWeight: "600",
        lineHeight: 18,
    },

    resetBtn: {
        paddingHorizontal: 12,
        paddingVertical: 8,
        borderRadius: 12,
        backgroundColor: "#FFFFFF",
        borderWidth: 1,
        borderColor: "#E5EAF4",
    },
    resetBtnPressed: { opacity: 0.85 },
    resetBtnText: {
        fontSize: 12,
        fontWeight: "900",
        color: "#0F2A5F",
        letterSpacing: 0.3,
        textTransform: "uppercase",
    },
});