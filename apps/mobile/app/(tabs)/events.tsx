import { ScrollView, StyleSheet, Text, View } from "react-native";

import { TabSwipeView } from "@/components/tab-swipe-view";
import { TAB_ROUTES } from "@/constants/tab-routes";

const TOURNAMENTS = [
    {
        name: "Coastal Smash Open",
        dates: "May 17-18, 2026",
        location: "Santa Cruz, CA",
        level: "Open",
        surface: "Beach",
        teams: 64,
        prize: "$12,000",
        highlight: "Sunset finals + live DJ",
    },
    {
        name: "Metro Spike Classic",
        dates: "Jun 7, 2026",
        location: "Chicago, IL",
        level: "AA",
        surface: "Indoor",
        teams: 48,
        prize: "$5,000",
        highlight: "College showcase court",
    },
    {
        name: "Alpine Volley Weekend",
        dates: "Jul 12-13, 2026",
        location: "Aspen, CO",
        level: "A",
        surface: "Grass",
        teams: 32,
        prize: "Gear packs",
        highlight: "Mountain sunrise warmups",
    },
    {
        name: "Night Lights League Finals",
        dates: "Aug 2, 2026",
        location: "Austin, TX",
        level: "BB",
        surface: "Sand",
        teams: 40,
        prize: "$2,500",
        highlight: "Late-night matches under lights",
    },
];

export default function EventsScreen() {
    return (
        <TabSwipeView routes={TAB_ROUTES}>
            <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
                <View style={styles.header}>
                    <Text style={styles.title}>Upcoming Tournaments</Text>
                    <Text style={styles.subtitle}>Find a court and lock in your team.</Text>
                </View>

                {TOURNAMENTS.map((tournament) => (
                    <View key={tournament.name} style={styles.card}>
                        <View style={styles.cardHeader}>
                            <Text style={styles.cardTitle}>{tournament.name}</Text>
                            <View style={styles.badge}>
                                <Text style={styles.badgeText}>{tournament.level}</Text>
                            </View>
                        </View>
                        <Text style={styles.cardMeta}>{tournament.dates}</Text>
                        <Text style={styles.cardMeta}>{tournament.location}</Text>

                        <View style={styles.detailsRow}>
                            <View style={styles.detail}>
                                <Text style={styles.detailLabel}>Surface</Text>
                                <Text style={styles.detailValue}>{tournament.surface}</Text>
                            </View>
                            <View style={styles.detail}>
                                <Text style={styles.detailLabel}>Teams</Text>
                                <Text style={styles.detailValue}>{tournament.teams}</Text>
                            </View>
                            <View style={styles.detail}>
                                <Text style={styles.detailLabel}>Prize</Text>
                                <Text style={styles.detailValue}>{tournament.prize}</Text>
                            </View>
                        </View>

                        <View style={styles.highlight}>
                            <Text style={styles.highlightText}>{tournament.highlight}</Text>
                        </View>
                    </View>
                ))}
            </ScrollView>
        </TabSwipeView>
    );
}

const styles = StyleSheet.create({
    container: {
        padding: 20,
        paddingBottom: 120,
    },
    header: {
        marginBottom: 20,
    },
    title: {
        fontSize: 28,
        fontWeight: "700",
        color: "#0E1A2B",
    },
    subtitle: {
        marginTop: 6,
        fontSize: 15,
        color: "#5C6B80",
    },
    card: {
        backgroundColor: "#FFFFFF",
        borderRadius: 20,
        padding: 16,
        marginBottom: 16,
        shadowColor: "#1A1A1A",
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.08,
        shadowRadius: 12,
        elevation: 2,
    },
    cardHeader: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        gap: 12,
    },
    cardTitle: {
        fontSize: 18,
        fontWeight: "700",
        color: "#0E1A2B",
        flex: 1,
    },
    badge: {
        paddingHorizontal: 10,
        paddingVertical: 4,
        backgroundColor: "#E9F1FF",
        borderRadius: 12,
    },
    badgeText: {
        fontSize: 12,
        fontWeight: "700",
        color: "#2B5CCB",
    },
    cardMeta: {
        marginTop: 6,
        color: "#4B5B73",
        fontSize: 14,
    },
    detailsRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginTop: 14,
        gap: 12,
    },
    detail: {
        flex: 1,
        backgroundColor: "#F6F7FB",
        borderRadius: 12,
        paddingVertical: 10,
        paddingHorizontal: 12,
    },
    detailLabel: {
        fontSize: 11,
        color: "#6B7C93",
        textTransform: "uppercase",
        letterSpacing: 0.6,
        fontWeight: "600",
    },
    detailValue: {
        marginTop: 4,
        fontSize: 14,
        fontWeight: "700",
        color: "#1A2A3A",
    },
    highlight: {
        marginTop: 12,
        backgroundColor: "#FFF4E5",
        borderRadius: 12,
        padding: 10,
    },
    highlightText: {
        color: "#9A5B00",
        fontSize: 13,
        fontWeight: "600",
    },
});
