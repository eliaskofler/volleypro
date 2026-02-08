import { View, StyleSheet, Image } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { TabSwipeView } from "@/components/tab-swipe-view";
import { TAB_ROUTES } from "@/constants/tab-routes";
import { useThemePalette } from "@/hooks/use-theme-palette";

export default function MapsScreen() {
    const theme = useThemePalette();

    const styles = StyleSheet.create({
        container: {
            flex: 1,
            backgroundColor: theme.background,
        },
        image: {
            ...StyleSheet.absoluteFillObject,
            width: "100%",
            height: "100%",
            resizeMode: "cover",
        },
        safeAreaOverlay: {
            flex: 1,
        },
    });

    return (
        <TabSwipeView routes={TAB_ROUTES}>
            <View style={styles.container}>
                {/* Full-screen image (ignores safe area) */}
                <Image
                    source={require("@/assets/images/placeholder-map.jpg")}
                    style={styles.image}
                />

                {/* Safe area reserved for future UI overlays */}
                <SafeAreaView style={styles.safeAreaOverlay} edges={["top", "bottom"]}>
                    {/* UI goes here later */}
                </SafeAreaView>
            </View>
        </TabSwipeView>
    );
}
