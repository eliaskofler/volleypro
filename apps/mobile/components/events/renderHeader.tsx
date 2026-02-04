import {View, Text, ScrollView, Pressable, StyleSheet} from "react-native";
import { Chip } from "@/components/ui/Chip";
import { Pill } from "@/components/ui/Pill";
import { hero } from "@/constants/icons";

import { YearFilter } from "@/types/filters";

interface EventListHeaderProps {
    category: "beach" | "volleyball";
    setCategory: (value: "beach" | "volleyball") => void;

    year: YearFilter;
    setYear: React.Dispatch<React.SetStateAction<YearFilter>>;
    yearOptions: readonly YearFilter[];

    loading: boolean;
    filteredCount: number;

    onOpenFilters: () => void;
}

export function EventListHeader({
    category,
    setCategory,
    year,
    setYear,
    yearOptions,
    loading,
    filteredCount,
    onOpenFilters,
}: EventListHeaderProps) {
    const isBeach = category === "beach";

    return (
        <View>
            <View style={styles.controlsCard}>
                <View style={styles.section}>
                    <View style={styles.rowWrap}>
                        <Pill
                            label={isBeach ? "Beach volleyball" : "Volleyball"}
                            selected
                            iconLeft={<hero.switchIcon size={24} color="#000" />}
                            onPress={() =>
                                setCategory(isBeach ? "volleyball" : "beach")
                            }
                        />
                    </View>
                </View>

                <View style={styles.section}>
                    <ScrollView
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        contentContainerStyle={styles.row}
                    >
                        {yearOptions.map((y) => (
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
                    <Pressable
                        onPress={onOpenFilters}
                        accessibilityRole="button"
                        accessibilityLabel="Open filters"
                        style={{ paddingRight: 4 }}
                    >
                        <hero.filter color="#314057" size={24} />
                    </Pressable>
                </View>
            </View>

            <View style={styles.resultsRow}>
                <Text style={styles.resultsText}>
                    {loading
                        ? "Gathering events..."
                        : `Showing ${filteredCount} ${
                            filteredCount === 1 ? "event" : "events"
                        }`}
                </Text>

                <Pressable
                    onPress={onOpenFilters}
                    accessibilityRole="button"
                    accessibilityLabel="Reset filters"
                    style={{ paddingRight: 4 }}
                >
                    <Text style={styles.resultsText}>RESET</Text>
                </Pressable>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    controlsCard: {
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
    row: {
        gap: 10,
        paddingRight: 8,
    },
    rowWrap: {
        flexDirection: "row",
        flexWrap: "wrap",
        gap: 10,
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
})