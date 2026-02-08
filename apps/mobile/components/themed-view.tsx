import { View, ViewProps } from 'react-native';
import { useColorScheme } from 'react-native';
import { useThemePalette } from '@/hooks/use-theme-palette';

export type ThemedViewProps = ViewProps & {
  lightColor?: string;
  darkColor?: string;
};

export function ThemedView({ style, lightColor, darkColor, ...otherProps }: ThemedViewProps) {
  const theme = useThemePalette();
  const colorScheme = useColorScheme(); // 'light' | 'dark'

  const backgroundColor =
      lightColor && darkColor ? (colorScheme === 'dark' ? darkColor : lightColor) : theme.background;

  return <View style={[{ backgroundColor }, style]} {...otherProps} />;
}
