// hooks/use-theme-palette.ts
import { useColorScheme } from 'react-native';
import { Colors } from '@/constants/theme-palette';

export function useThemePalette() {
    const scheme = useColorScheme() ?? 'light'; // fallback to light
    return Colors[scheme];
}
