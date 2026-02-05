import { useRef, useEffect } from "react";
import {
    View,
    Text,
    Pressable,
    ScrollView,
    Modal,
    Animated,
    Easing,
    PanResponder,
    PanResponderInstance, StyleSheet,
    Platform,
} from "react-native";
import {YearFilter} from "@/types/filters";

type FilterBottomSheetProps = {
    visible: boolean;
    gender: string;
    organizerType: string;
    countryType: string;
    onGenderChange: (g: string) => void;
    onOrganizerTypeChange: (o: string) => void;
    onCountryTypeChange: (c: string) => void;
    availableGenders: string[];
    availableOrganizerTypes: string[];
    availableCountryTypes: string[];
    onResetFilters: () => void;
    Chip: React.ComponentType<any>;
    setShowFilters: React.Dispatch<React.SetStateAction<boolean>>;
    showFilters: boolean;
    year: YearFilter;
    setYear: React.Dispatch<React.SetStateAction<YearFilter>>;
    yearOptions: readonly YearFilter[];
};

export function FilterBottomSheet({
    visible,
    gender,
    organizerType,
    countryType,
    onGenderChange,
    onOrganizerTypeChange,
    onCountryTypeChange,
    availableGenders,
    availableOrganizerTypes,
    availableCountryTypes,
    onResetFilters,
    Chip,
    setShowFilters,
    showFilters,
    year,
    setYear,
    yearOptions,
}: FilterBottomSheetProps) {
    // Bottom sheet state
    const slideAnim = useRef(new Animated.Value(0)).current;
    const panY = useRef(new Animated.Value(0)).current;
    const panResponderRef = useRef<PanResponderInstance | null>(null);

    // Initialize PanResponder for drag-to-close
    useEffect(() => {
        panResponderRef.current = PanResponder.create({
            onStartShouldSetPanResponder: () => true,
            onMoveShouldSetPanResponder: (_, gestureState) => Math.abs(gestureState.dy) > 10,
            onPanResponderMove: (_, gestureState) => {
                if (gestureState.dy > 0) {
                    panY.setValue(gestureState.dy);
                }
            },
            onPanResponderRelease: (_, gestureState) => {
                const DRAG_THRESHOLD = 10;
                if (gestureState.dy > DRAG_THRESHOLD) {
                    closeSheetInstant();
                } else {
                    Animated.spring(panY, {
                        toValue: 0,
                        useNativeDriver: true,
                    }).start();
                }
            },
        });
    }, []);

    const closeSheetInstant = () => {
        setShowFilters(false);
        Animated.parallel([
            Animated.timing(slideAnim, {
                toValue: 0,
                duration: 10,
                easing: Easing.in(Easing.cubic),
                useNativeDriver: true,
            }),
            Animated.timing(panY, {
                toValue: 0,
                duration: 10,
                useNativeDriver: true,
            }),
        ]).start(() => {
            setShowFilters(false);
        });
    };

    const closeSheet = () => {
        Animated.parallel([
            Animated.timing(slideAnim, {
                toValue: 0,
                duration: 250,
                easing: Easing.in(Easing.cubic),
                useNativeDriver: true,
            }),
            Animated.timing(panY, {
                toValue: 0,
                duration: 250,
                useNativeDriver: true,
            }),
        ]).start(() => {
            setShowFilters(false);
        });
    };

    const openSheet = () => {
        Animated.timing(slideAnim, {
            toValue: 1,
            duration: 300,
            easing: Easing.out(Easing.cubic),
            useNativeDriver: true,
        }).start();
    };
    
    useEffect(() => {
        if (showFilters) {
            openSheet();
        }
    }, [showFilters, slideAnim]);

    return (
        <Modal
            visible={visible}
            animationType="none"
            transparent
            onRequestClose={() => {closeSheet()}}
        >
            <Pressable
                style={styles.sheetOverlay}
                onPress={() => {closeSheet()}}
                accessible={false}
            >
                {/* capture background taps */}
            </Pressable>

            <Animated.View
                {...panResponderRef.current?.panHandlers}
                style={[
                    styles.bottomSheet,
                    {
                        transform: [
                            {
                                translateY: Animated.add(
                                    slideAnim.interpolate({
                                        inputRange: [0, 1],
                                        outputRange: [400, 0],
                                    }),
                                    panY,
                                ),
                            },
                        ],
                    },
                ]}
            >
                <View style={styles.dragHandle} />

                <View style={styles.sheetHeader}>
                    <Text style={styles.sheetTitle}>Filters</Text>
                    <Pressable
                        onPress={onResetFilters}
                        style={styles.sheetResetBtn}
                    >
                        <Text style={styles.sheetResetText}>Reset</Text>
                    </Pressable>
                </View>

                <View style={styles.sheetSection}>
                    <Text style={styles.sectionLabel}>Date</Text>
                    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.row}>
                        {yearOptions.map((y) => (
                            <Chip key={String(y)} label={y === "Upcoming" ? "Upcoming" : String(y)} selected={year === y} onPress={() => setYear(y)} />
                        ))}
                    </ScrollView>
                </View>

                <View style={styles.sheetSection}>
                    <Text style={styles.sectionLabel}>Gender</Text>
                    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.row}>
                        <Chip label="All" selected={gender === "all"} onPress={() => onGenderChange("all")} />
                        {availableGenders.map((g) => (
                            <Chip key={g} label={g} selected={gender === g} onPress={() => onGenderChange(g)} />
                        ))}
                    </ScrollView>
                </View>

                <View style={styles.sheetSection}>
                    <Text style={styles.sectionLabel}>Organizer type</Text>
                    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.row}>
                        <Chip label="All" selected={organizerType === "all"} onPress={() => onOrganizerTypeChange("all")} />
                        {availableOrganizerTypes.map((o) => (
                            <Chip key={o} label={o} selected={organizerType === o} onPress={() => onOrganizerTypeChange(o)} />
                        ))}
                    </ScrollView>
                </View>

                <View style={styles.sheetSection}>
                    <Text style={styles.sectionLabel}>Country type</Text>
                    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.row}>
                        <Chip label="All" selected={countryType === "all"} onPress={() => onCountryTypeChange("all")} />
                        {availableCountryTypes.map((c) => (
                            <Chip key={c} label={c} selected={countryType === c} onPress={() => onCountryTypeChange(c)} />
                        ))}
                    </ScrollView>
                </View>

                <View style={styles.sheetFooter}>
                    <Pressable
                        style={({ pressed }) => [styles.sheetBtn, pressed && styles.resetBtnPressed]}
                        onPress={() => {closeSheet()}}
                    >
                        <Text style={styles.sheetBtnText}>Done</Text>
                    </Pressable>
                </View>
            </Animated.View>
        </Modal>
    );
}

const styles = StyleSheet.create({
    sectionLabel: {
        fontSize: 14,
        fontWeight: "bold",
    },
    row: {
        gap: 10,
        paddingRight: 8,
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
})