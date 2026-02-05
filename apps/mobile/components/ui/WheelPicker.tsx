import React, { useRef, useEffect, useState } from "react";
import {
    View,
    Text,
    StyleSheet,
    NativeScrollEvent,
    NativeSyntheticEvent,
    Animated,
    ViewStyle,
    TextStyle,
} from "react-native";

const ITEM_HEIGHT = 38;
const VISIBLE_ITEMS = 3;
const REPEAT_COUNT = 3;

type WheelPickerProps<T extends string | number> = {
    data: readonly T[];
    value: T;
    onChange: (value: T) => void;
    width?: number;
    itemHeight?: number;
    containerStyle?: ViewStyle;
    textStyle?: TextStyle;
    selectedTextStyle?: TextStyle;
};

export function WheelPicker<T extends string | number>({
   data,
   value,
   onChange,
   width = 110,
   itemHeight = ITEM_HEIGHT,
   containerStyle,
   textStyle,
   selectedTextStyle,
}: WheelPickerProps<T>) {
    const listRef = useRef<Animated.FlatList<T>>(null);
    const scrollY = useRef(new Animated.Value(0)).current;

    // Loop data
    const loopedData = Array.from({ length: REPEAT_COUNT }, () => data).flat();
    const dataLength = data.length;
    const middleIndex = dataLength * Math.floor(REPEAT_COUNT / 2);

    const [selectedValue, setSelectedValue] = useState(value);

    // Center the picker initially
    useEffect(() => {
        const baseIndex = data.indexOf(value);
        if (baseIndex < 0) return;

        // Only scroll to the default value in the first copy
        const offset = baseIndex * itemHeight;
        setTimeout(() => {
            listRef.current?.scrollToOffset({ offset, animated: false });
        }, 0);
    }, [value]);

    const onMomentumScrollEnd = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
        const rawIndex = Math.round(e.nativeEvent.contentOffset.y / itemHeight);
        const normalizedIndex = ((rawIndex % dataLength) + dataLength) % dataLength;
        const newValue = data[normalizedIndex];

        setSelectedValue(newValue);
        onChange(newValue);

        // recenter to middle copy
        const min = dataLength;
        const max = dataLength * 2;
        if (rawIndex <= min || rawIndex >= max) {
            const recenteredIndex = middleIndex + normalizedIndex;
            listRef.current?.scrollToOffset({
                offset: recenteredIndex * itemHeight,
                animated: false,
            });
        }
    };

    return (
        <View
            style={[
                { height: itemHeight, width, overflow: "visible" },
                containerStyle,
            ]}
        >
            {/* Visual overflow */}
            <View
                style={{
                    position: "absolute",
                    top: -itemHeight * Math.floor(VISIBLE_ITEMS / 2),
                    height: itemHeight * VISIBLE_ITEMS,
                    left: 0,
                    right: 0,
                }}
            >
                {/* Selection overlay */}
                <View
                    style={[
                        styles.selectionOverlay,
                        { top: itemHeight * Math.floor(VISIBLE_ITEMS / 2), height: itemHeight },
                    ]}
                    pointerEvents="none"
                />

                {/* Animated FlatList */}
                <Animated.FlatList
                    ref={listRef}
                    data={loopedData as any}
                    keyExtractor={(_, i) => i.toString()}
                    showsVerticalScrollIndicator={false}
                    snapToInterval={itemHeight}
                    decelerationRate="fast"
                    onMomentumScrollEnd={onMomentumScrollEnd}
                    scrollEventThrottle={16}
                    onScroll={Animated.event(
                        [{ nativeEvent: { contentOffset: { y: scrollY } } }],
                        { useNativeDriver: true }
                    )}
                    contentContainerStyle={{
                        paddingVertical: itemHeight * Math.floor(VISIBLE_ITEMS / 2),
                    }}
                    renderItem={({ item, index }) => {
                        // Calculate the center position of this item
                        const inputRange = [
                            (index - 2) * itemHeight,
                            (index - 1) * itemHeight,
                            index * itemHeight,
                            (index + 1) * itemHeight,
                            (index + 2) * itemHeight,
                        ];

                        const scale = scrollY.interpolate({
                            inputRange,
                            outputRange: [0.8, 0.9, 1, 0.9, 0.8],
                            extrapolate: "clamp",
                        });

                        const opacity = scrollY.interpolate({
                            inputRange,
                            outputRange: [0, 0, 1, 0, 0],
                            extrapolate: "clamp",
                        });

                        return (
                            <Animated.View
                                style={[styles.item, { height: itemHeight, transform: [{ scale }], opacity }]}
                            >
                                <Text
                                    style={[
                                        styles.text,
                                        { fontSize: 14, color: "#999" },
                                        textStyle,
                                        item === selectedValue && [
                                            styles.selectedText,
                                            { fontSize: 18, fontWeight: "600", color: "#000" },
                                            selectedTextStyle,
                                        ],
                                    ]}
                                >
                                    {item}
                                </Text>
                            </Animated.View>
                        );
                    }}
                />
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    item: {
        justifyContent: "center",
        alignItems: "center",
    },
    text: {},
    selectedText: {},
    selectionOverlay: {
        position: "absolute",
        left: 0,
        right: 0,
        paddingHorizontal: 12,
        borderRadius: 999,
        borderTopWidth: 1,
        borderWidth: 1,
        borderColor: "#E5EAF4",
        zIndex: 10,
    },
});
