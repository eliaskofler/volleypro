import { BottomTabBarButtonProps } from '@react-navigation/bottom-tabs';
import { PlatformPressable } from '@react-navigation/elements';
import * as Haptics from 'expo-haptics';
import { StyleSheet } from 'react-native';

export function HapticTab(props: BottomTabBarButtonProps) {
    const hitSlop = props.hitSlop ?? { top: 12, bottom: 12, left: 12, right: 12 };

    return (
        <PlatformPressable
            {...props}
            hitSlop={hitSlop}
            style={[styles.button, props.style]}   // 👈 CRITICAL
            onPressIn={(ev) => {
                if (process.env.EXPO_OS === 'ios') {
                    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                }
                props.onPressIn?.(ev);
            }}
        />
    );
}

const styles = StyleSheet.create({
    button: {
        flex: 1,               // fill tab item
        height: '100%',        // fill tab bar height
        justifyContent: 'center',
        alignItems: 'center',
    },
});
