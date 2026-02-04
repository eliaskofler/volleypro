import {View, Text, Pressable, StyleSheet} from "react-native";
import type { ApiEvent } from "@/types/filters";

import { formatShortDateRange } from "@/utils/date";
import { domainFromUrl } from "@/utils/domain";

interface EventRendererProps {
    event: ApiEvent;
    openWebsite: (url: string) => void;
}

export function EventRenderer({ event, openWebsite }: EventRendererProps) {
    const countryCode = (event.countrycode ?? "").trim();
    const season = event.season;
    const genderLabel = (event.gender ?? "").trim();
    const organizerType = (event.orangizertype ?? "").trim();
    const type = (event.type ?? "").trim();
    const datePill = formatShortDateRange(event.startdate, event.enddate);

    return (
        <View style={styles.card}>
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
                    style={({ pressed }) => [
                        styles.websiteRow,
                        pressed && styles.websiteRowPressed,
                    ]}
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
}

const styles = StyleSheet.create({
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
})