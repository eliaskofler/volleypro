import {ReactNode, useRef} from "react";
import {Pressable, StyleSheet, Text, View} from "react-native";

type PillProps = {
    label: string;
    selected?: boolean;
    onPress: (signal: AbortSignal) => void;
    iconLeft?: ReactNode;
    iconRight?: ReactNode;
};

export function Pill({
                         label,
                         selected,
                         onPress,
                         iconLeft,
                         iconRight,
                     }: PillProps) {
    const abortControllerRef = useRef<AbortController | null>(null);

    return (
        <Pressable
            onPress={() => {
                if (abortControllerRef.current) {
                    abortControllerRef.current.abort();
                }

                const controller = new AbortController();
                abortControllerRef.current = controller;

                requestAnimationFrame(() => {
                    onPress(controller.signal);
                });
            }}
            style={({ pressed }) => [
                styles.chip,
                selected && styles.chipSelected,
                pressed && styles.chipPressed,
            ]}
        >
            <View style={styles.content}>
                {iconLeft && <View style={styles.icon}>{iconLeft}</View>}

                <Text
                    style={[
                        styles.chipText,
                        selected && styles.chipTextSelected,
                    ]}
                >
                    {label}
                </Text>

                {iconRight && <View style={styles.icon}>{iconRight}</View>}
            </View>
        </Pressable>
    );
}

const styles = StyleSheet.create({
    chip: {
        borderRadius: 999,
        paddingHorizontal: 12,
        paddingVertical: 8,
        borderWidth: 1,
        borderColor: "#E5EAF4",
    },
    chipSelected: {
        backgroundColor: "none",
    },
    chipPressed: {
        opacity: 0.85,
    },
    chipText: {
        fontSize: 13,
        fontWeight: "800",
        color: "#000",
    },
    chipTextSelected: {
        color: "#000",
    },
    content: {
        flexDirection: "row",
        alignItems: "center",
        gap: 6,
    },

    icon: {
        justifyContent: "center",
        alignItems: "center",
    },
})