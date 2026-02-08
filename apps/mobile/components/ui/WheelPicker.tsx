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
    Platform
} from "react-native";
import { useThemePalette } from "@/hooks/use-theme-palette";

const ITEM_WIDTH = 110;
const ITEM_HEIGHT = 44;
const VISIBLE_ITEMS = 3;
const REPEAT_COUNT = 3;

type WheelPickerProps = {
    data: readonly (number | string)[];
    value: number | string;
    onChange: (value: number | string) => void;
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
   width = ITEM_WIDTH,
   itemHeight = ITEM_HEIGHT,
   containerStyle,
   textStyle,
   selectedTextStyle,
}: WheelPickerProps) {
    const theme = useThemePalette();
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

        const offset = (middleIndex + baseIndex) * itemHeight;

        requestAnimationFrame(() => {
            listRef.current?.scrollToOffset({
                offset,
                animated: false,
            });
        });

        setSelectedValue(value);
    }, [value, data, itemHeight, middleIndex]);

    const handleScrollEnd = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
        const offsetY = e.nativeEvent.contentOffset.y;
        const rawIndex = Math.round(offsetY / itemHeight);

        const normalizedIndex =
            ((rawIndex % dataLength) + dataLength) % dataLength;

        const newValue = data[normalizedIndex];

        if (newValue !== selectedValue) {
            setSelectedValue(newValue);
            onChange(newValue);
        }

        // Always re-center
        const recenteredIndex = middleIndex + normalizedIndex;

        requestAnimationFrame(() => {
            listRef.current?.scrollToOffset({
                offset: recenteredIndex * itemHeight,
                animated: false,
            });
        });
    };


    const styles = StyleSheet.create({
        item: {
            justifyContent: "center",
            alignItems: "center",
        },
        text: {
            lineHeight: ITEM_HEIGHT,
        },
        selectedText: {},
        selectionOverlay: {
            position: "absolute",
            left: 0,
            right: 0,
            paddingHorizontal: 12,
            borderRadius: 999,
            borderTopWidth: 1,
            borderWidth: 1,
            borderColor: theme.borderStrong,
            zIndex: 10,
        },
    });


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
                    onMomentumScrollEnd={
                        Platform.OS === "ios" ? handleScrollEnd : handleScrollEnd
                    }
                    scrollEventThrottle={16}
                    removeClippedSubviews={false}
                    onScroll={Animated.event(
                        [{ nativeEvent: { contentOffset: { y: scrollY } } }],
                        { useNativeDriver: false }
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
                            outputRange: [0.4, 0.6, 1, 0.6, 0.4],
                            extrapolate: "clamp",
                        });

                        return (
                            <Animated.View
                                style={[styles.item, { height: itemHeight, transform: [{ scale }], opacity }]}
                            >
                                <Text
                                    style={[
                                        styles.text,
                                        { fontSize: 14, color: theme.textDisabled },
                                        textStyle,
                                        item === selectedValue && [
                                            styles.selectedText,
                                            { fontSize: 18, fontWeight: "600", color: theme.textPrimary },
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