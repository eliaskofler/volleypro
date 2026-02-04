import { useMemo, useState, useEffect, useRef } from "react";
import {
    StyleSheet,
    Text,
    View,
    Linking,
    Alert,
    ActivityIndicator,
    FlatList,
    Platform,
} from "react-native";
import * as WebBrowser from "expo-web-browser";
import { SafeAreaView } from "react-native-safe-area-context";

import { TabSwipeView } from "@/components/tab-swipe-view";
import { TAB_ROUTES } from "@/constants/tab-routes";

import { Chip } from "@/components/ui/Chip";
import { FilterBottomSheet } from "@/components/events/filterBottomSheet";
import { EventListHeader } from "@/components/events/renderHeader";
import { EventRenderer } from "@/components/events/renderEvent";

import {
    YearFilter,
    EventCategory,
    GenderFilter,
    OrganizerTypeFilter,
    ApiEvent
} from "@/types/filters";

const API_BASE_URL = "http://45.131.109.42:3000";

const YEAR_OPTIONS: YearFilter[] = (() => {
    const currentYear = new Date().getFullYear();
    const years: YearFilter[] = ["upcoming"];
    for (let y = currentYear; y >= 2000; y -= 1) years.push(y);
    return years;
})();

export default function EventsScreen() {
    const [category, setCategory] = useState<EventCategory>("beach");
    const [year, setYear] = useState<YearFilter>("upcoming");
    const [gender, setGender] = useState<GenderFilter>("all");
    const [organizerType, setOrganizerType] = useState<OrganizerTypeFilter>("all");

    const [loading, setLoading] = useState(false);
    const [events, setEvents] = useState<ApiEvent[]>([]);
    const [loadError, setLoadError] = useState<string | null>(null);

    const [showFilters, setShowFilters] = useState(false);

    const filterAbortControllerRef = useRef<AbortController | null>(null);

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

        load().then();
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
        if (filterAbortControllerRef.current) {
            filterAbortControllerRef.current.abort(); // Abort previous filtering
        }
        const controller = new AbortController();
        filterAbortControllerRef.current = controller;

        const signal = controller.signal;

        const performFiltering = () => {
            const list = events.filter((e) => {
                if (signal.aborted) return false; // Stop filtering if aborted

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

            if (signal.aborted) return [];

            // IMPORTANT: copy before sorting + sort by real dates
            return [...list].sort((a, b) => {
                if (signal.aborted) return 0;

                if (!a.startdate && !b.startdate) return 0;
                if (!a.startdate) return 1;
                if (!b.startdate) return -1;

                return (
                    new Date(a.startdate).getTime() -
                    new Date(b.startdate).getTime()
                );
            });
        };

        return performFiltering();
    }, [events, gender, organizerType]);



    return (
        <TabSwipeView routes={TAB_ROUTES}>
            <SafeAreaView style={styles.safeArea} edges={["top"]}>
                <View style={styles.screen}>
                    <View style={styles.header}>
                        <Text style={styles.title}>Events</Text>
                        <Text style={styles.subtitle}>Filter by sport, year, gender, and organizer</Text>
                    </View>
                    <FlatList
                        data={loading ? [] : filteredEvents} // Show no data while loading
                        keyExtractor={(item, index) => `${item.name}-${index}`}
                        renderItem={({ item }) => (
                            <EventRenderer event={item} openWebsite={openWebsite} />
                        )}
                        contentContainerStyle={styles.listContainer}
                        ListHeaderComponent={
                            <EventListHeader
                                category={category}
                                setCategory={setCategory}
                                year={year}
                                setYear={setYear}
                                yearOptions={YEAR_OPTIONS}
                                loading={loading}
                                filteredCount={filteredEvents.length}
                                onOpenFilters={() => setShowFilters(true)}
                            />
                        }
                        decelerationRate="normal"
                        ListEmptyComponent={() => (
                            loading ? (
                                <View>
                                    <ActivityIndicator size="large" color="#0F2A5F" />
                                </View>
                            ) : (
                                !loadError && (
                                    <View style={styles.stateBox}>
                                        <Text style={styles.stateTitle}>No matches</Text>
                                        <Text style={styles.stateText}>Try changing year or gender.</Text>
                                    </View>
                                )
                            )
                        )}
                    />

                    {/* Bottom sheet modal for Gender and Organizer Type */}
                    <FilterBottomSheet
                        visible={showFilters}
                        gender={gender}
                        onGenderChange={setGender}
                        organizerType={organizerType}
                        onOrganizerTypeChange={setOrganizerType}
                        availableGenders={availableGenders}
                        availableOrganizerTypes={availableOrganizerTypes}
                        setShowFilters={setShowFilters}
                        showFilters={showFilters}
                        onReset={() => {
                            setGender("all");
                            setOrganizerType("all");
                        }}
                        styles={styles}
                        Chip={Chip}
                    />
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

    listContainer: {
        paddingHorizontal: 16,
        paddingTop: 12,
        paddingBottom: 160,
        gap: 12,
    },

    filterBtn: {
        paddingHorizontal: 10,
        paddingVertical: 8,
        borderRadius: 12,
        backgroundColor: "#FFFFFF",
        borderWidth: 1,
        borderColor: "#E5EAF4",
        alignItems: "center",
        justifyContent: "center",
    },
    filterIcon: {
        fontSize: 18,
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

    /* Bottom sheet styles */
    sheetOverlay: {
        flex: 1,
        backgroundColor: "rgba(0,0,0,0.35)",
    },
    bottomSheet: {
        position: "absolute",
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: "#FFFFFF",
        borderTopLeftRadius: 16,
        borderTopRightRadius: 16,
        paddingTop: 12,
        paddingHorizontal: 16,
        paddingBottom: Platform.OS === "ios" ? 34 : 20,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: -6 },
        shadowOpacity: 0.12,
        shadowRadius: 12,
        elevation: 20,
    },
    sheetHeader: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        marginBottom: 8,
    },
    sheetTitle: {
        fontSize: 16,
        fontWeight: "900",
        color: "#0B1324",
    },
    sheetResetBtn: {
        paddingHorizontal: 10,
        paddingVertical: 6,
    },
    sheetResetText: {
        color: "#66758C",
        fontSize: 13,
        fontWeight: "800",
    },
    sheetSection: {
        marginTop: 8,
        gap: 8,
    },
    sheetFooter: {
        marginTop: 12,
        alignItems: "flex-end",
    },
    sheetBtn: {
        paddingHorizontal: 16,
        paddingVertical: 10,
        borderRadius: 10,
        backgroundColor: "#0F2A5F",
    },
    sheetBtnText: {
        color: "#FFFFFF",
        fontWeight: "900",
    },
    dragHandle: {
        width: 40,
        height: 5,
        borderRadius: 2.5,
        backgroundColor: "#D1D5E0",
        alignSelf: "center",
        marginTop: 8,
        marginBottom: 12,
    },
});