import {ReactNode, useRef} from "react";
import {Pressable, StyleSheet, Text, View} from "react-native";

type ChipProps = {
    label: string;
    selected?: boolean;
    onPress: (signal: AbortSignal) => void;
    iconLeft?: ReactNode;
    iconRight?: ReactNode;
};

export function Chip({
                  label,
                  selected,
                  onPress,
                  iconLeft,
                  iconRight,
              }: ChipProps) {
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
        backgroundColor: "#F2F5FB",
        borderWidth: 1,
        borderColor: "#E5EAF4",
    },
    chipSelected: {
        backgroundColor: "#0F2A5F",
        borderColor: "#0F2A5F",
    },
    chipPressed: {
        opacity: 0.85,
    },
    chipText: {
        fontSize: 13,
        fontWeight: "800",
        color: "#314057",
    },
    chipTextSelected: {
        color: "#FFFFFF",
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