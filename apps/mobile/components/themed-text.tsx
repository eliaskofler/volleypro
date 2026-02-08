import { Text, TextProps, StyleSheet } from 'react-native';
import { useColorScheme } from 'react-native';
import { useThemePalette } from '@/hooks/use-theme-palette';

export type ThemedTextProps = TextProps & {
    lightColor?: string;
    darkColor?: string;
    type?: 'default' | 'title' | 'defaultSemiBold' | 'subtitle' | 'link';
};

export function ThemedText({
   style,
   lightColor,
   darkColor,
   type = 'default',
   ...rest
}: ThemedTextProps) {
    const theme = useThemePalette();
    const colorScheme = useColorScheme(); // 'light' | 'dark'

    // pick light/dark override if provided, otherwise use theme.textPrimary by default
    const color =
        lightColor && darkColor
            ? colorScheme === 'dark'
                ? darkColor
                : lightColor
            : theme.textPrimary;

    return (
        <Text
            style={[
                { color },
                type === 'default' && styles.default,
                type === 'defaultSemiBold' && styles.defaultSemiBold,
                type === 'title' && styles.title,
                type === 'subtitle' && styles.subtitle,
                type === 'link' && styles.link,
                style,
            ]}
            {...rest}
        />
    );
}

const styles = StyleSheet.create({
    default: {
        fontSize: 16,
        lineHeight: 24,
    },
    defaultSemiBold: {
        fontSize: 16,
        lineHeight: 24,
        fontWeight: '600',
    },
    title: {
        fontSize: 32,
        fontWeight: 'bold',
        lineHeight: 32,
    },
    subtitle: {
        fontSize: 20,
        fontWeight: 'bold',
    },
    link: {
        lineHeight: 30,
        fontSize: 16,
        color: '#0a7ea4', // still a hardcoded link color; you can also move this to theme
    },
});
