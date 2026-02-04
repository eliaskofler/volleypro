import { useRef, useEffect, useState } from "react";
import {
    View,
    Text,
    Pressable,
    ScrollView,
    Modal,
    Animated,
    Easing,
    Platform,    
    PanResponder,
    PanResponderInstance,
} from "react-native";
import type { StyleProp, ViewStyle } from "react-native";

type FilterBottomSheetProps = {
    visible: boolean;
    gender: string;
    onGenderChange: (g: string) => void;
    organizerType: string;
    onOrganizerTypeChange: (o: string) => void;
    availableGenders: string[];
    availableOrganizerTypes: string[];
    styles: any;
    onReset: () => void;
    Chip: React.ComponentType<any>;
    setShowFilters: React.Dispatch<React.SetStateAction<boolean>>;
    showFilters: boolean;
};

export function FilterBottomSheet({
    visible,
    gender,
    onGenderChange,
    organizerType,
    onOrganizerTypeChange,
    availableGenders,
    availableOrganizerTypes,
    styles,
    onReset,
    Chip,
    setShowFilters,
    showFilters,
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
                        onPress={onReset}
                        style={styles.sheetResetBtn}
                    >
                        <Text style={styles.sheetResetText}>Reset</Text>
                    </Pressable>
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