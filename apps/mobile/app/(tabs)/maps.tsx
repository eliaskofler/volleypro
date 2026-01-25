import { View, Text } from "react-native";

import { TabSwipeView } from "@/components/tab-swipe-view";
import { TAB_ROUTES } from "@/constants/tab-routes";

export default function MapsScreen() {
    return (
        <TabSwipeView routes={TAB_ROUTES}>
            <View>
                <Text style={{
                    fontSize: 70,
                    textAlign: "center",
                    paddingTop: 200,
                }}>Maps</Text>
            </View>
        </TabSwipeView>
    );
}
