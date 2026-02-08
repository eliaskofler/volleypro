import {View, Text, ScrollView, Pressable, StyleSheet} from "react-native";
import { Chip } from "@/components/ui/Chip";
import { Pill } from "@/components/ui/Pill";
import { hero } from "@/constants/icons";
import { WheelPicker } from "@/components/ui/WheelPicker";
import { useThemePalette } from "@/hooks/use-theme-palette";

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
    onResetFilters: () => void;
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
    onResetFilters,
}: EventListHeaderProps) {
    const theme = useThemePalette();
    const isBeach = category === "beach";

    const styles = StyleSheet.create({
        resetBtn: {
            paddingHorizontal: 12,
            paddingVertical: 6,
            borderRadius: 12,
            backgroundColor: theme.inputBackground,
            borderWidth: 1,
            borderColor: theme.border,
        },
        resetBtnPressed: { opacity: 0.85 },
        resetBtnText: {
            fontSize: 12,
            fontWeight: "900",
            color: "#0F2A5F",
            letterSpacing: 0.3,
            textTransform: "uppercase",
        },

        filter: {
            marginHorizontal: 16,
        },
        controlsCard: {
            paddingVertical: 24,
            display: "flex",
            flexDirection: "row",      // 👈 put children in one line
            alignItems: "center",      // 👈 vertical alignment
            justifyContent: "space-between",
            gap: 12,
        },
        controlsLook: {
            display: "flex",
            flexDirection: "row",
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
            color: theme.textSecondary,
            fontSize: 13,
            fontWeight: "800",
        },
    })

    return (
        <View style={styles.filter}>
            <View style={styles.controlsCard}>
                <View style={styles.controlsLook}>
                    <View style={styles.section}>
                        <View style={styles.rowWrap}>
                            <Pill
                                label={isBeach ? "Beach 🏐" : "Volleyball"}
                                selected
                                iconLeft={<hero.switchIcon size={24} color={theme.textPrimary} />}
                                onPress={() =>
                                    setCategory(isBeach ? "volleyball" : "beach")
                                }
                            />
                        </View>
                    </View>

                    <WheelPicker
                        data={yearOptions}
                        value={year}
                        onChange={(v) => setYear(v as YearFilter)}
                    />
                </View>

                {/*
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
                */}

                <View style={styles.section}>
                    <Pressable
                        onPress={onOpenFilters}
                        accessibilityRole="button"
                        accessibilityLabel="Open filters"
                        style={{ paddingRight: 4 }}
                    >
                        <hero.filter color={theme.textPrimary} size={24} />
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
                    onPress={onResetFilters}
                    accessibilityRole="button"
                    accessibilityLabel="Reset filters"
                    style={styles.resetBtn}
                >
                    <Text style={styles.resultsText}>RESET</Text>
                </Pressable>
            </View>
        </View>
    );
}