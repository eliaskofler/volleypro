import {View, Text, StyleSheet} from "react-native";

import { TabSwipeView } from "@/components/tab-swipe-view";
import { TAB_ROUTES } from "@/constants/tab-routes";
import { useThemePalette } from "@/hooks/use-theme-palette";
import {SafeAreaView} from "react-native-safe-area-context";

export default function TheoryScreen() {
    const theme = useThemePalette();

    const styles = StyleSheet.create({
        safeArea: {
            flex: 1,
            backgroundColor: theme.background,
        },
        screen: {
            flex: 1,
            backgroundColor: theme.background,
        },

        sampleText: {
            fontSize: 70,
            textAlign: "center",
            paddingTop: 200,
            color: theme.textPrimary,
        },
    });

    return (
        <TabSwipeView routes={TAB_ROUTES}>
            <SafeAreaView style={styles.safeArea} edges={["top"]}>
                <View style={styles.screen}>
                    <Text style={styles.sampleText}>Theory</Text>
                </View>
            </SafeAreaView>
        </TabSwipeView>
    );
}
