import React, { useEffect, useState } from "react"
import {
    View,
    Text,
    Image,
    Pressable,
    ActivityIndicator, StyleSheet,
} from "react-native"
import { metaDataFromUrl, domainFromUrl } from "@/utils/url";

type LinkMeta = {
    title?: string
    description?: string
    image?: string
}

type Props = {
    url: string
    onPress: () => void
}

export function LinkPreviewCard({ url, onPress }: Props) {
    const [meta, setMeta] = useState<LinkMeta | null>(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        let mounted = true

        metaDataFromUrl(url).then((data) => {
            if (mounted) {
                setMeta(data)
                setLoading(false)
            }
        })

        return () => {
            mounted = false
        }
    }, [url])

    return (
        <Pressable
            accessibilityRole="link"
            onPress={onPress}
            style={({ pressed }) => [
                styles.previewCard,
                pressed && styles.previewCardPressed,
            ]}
        >
            {loading ? (
                <ActivityIndicator />
            ) : (
                <>
                    {!!meta?.image && (
                        <Image
                            source={{ uri: meta.image }}
                            style={styles.previewImage}
                        />
                    )}

                    <View style={styles.previewContent}>
                        <Text style={styles.previewDomain}>
                            {domainFromUrl(url)}
                        </Text>

                        {!!meta?.title && (
                            <Text style={styles.previewTitle} numberOfLines={2}>
                                {meta.title}
                            </Text>
                        )}

                        {!!meta?.description && (
                            <Text
                                style={styles.previewDescription}
                                numberOfLines={2}
                            >
                                {meta.description}
                            </Text>
                        )}
                    </View>
                </>
            )}
        </Pressable>
    )
}

const styles = StyleSheet.create({
    previewCard: {
        flexDirection: "row",
        borderRadius: 12,
        borderWidth: 1,
        borderColor: "#e5e5e5",
        overflow: "hidden",
        backgroundColor: "#fff",
    },

    previewCardPressed: {
        opacity: 0.85,
    },

    previewImage: {
        width: 96,
        height: 96,
    },

    previewContent: {
        flex: 1,
        padding: 12,
        justifyContent: "center",
    },

    previewDomain: {
        fontSize: 12,
        color: "#888",
        marginBottom: 4,
    },

    previewTitle: {
        fontSize: 15,
        fontWeight: "600",
        marginBottom: 4,
    },

    previewDescription: {
        fontSize: 13,
        color: "#555",
    },
})