import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { Artist } from '../types';
import { COLORS, SPACING, FONT_SIZE } from '../constants/theme';
import { Ionicons } from '@expo/vector-icons';

interface ArtistItemProps {
    artist: Artist;
    onPress: (artist: Artist) => void;
}

export const ArtistItem: React.FC<ArtistItemProps> = ({ artist, onPress }) => {
    const imageUrl = artist.image?.find((img) => img.quality === '150x150')?.url || artist.image?.find((img) => img.quality === '150x150')?.link || artist.image?.[0]?.url || artist.image?.[0]?.link || 'https://www.jiosaavn.com/img/c_icon.png';

    return (
        <TouchableOpacity style={styles.container} onPress={() => onPress(artist)}>
            <Image source={{ uri: imageUrl }} style={styles.image} />
            <View style={styles.infoContainer}>
                <Text style={styles.title} numberOfLines={1}>
                    {artist.name}
                </Text>
                <Text style={styles.subtitle} numberOfLines={1}>
                    {artist.role}
                </Text>
            </View>
            <TouchableOpacity style={styles.moreButton}>
                <Ionicons name="ellipsis-vertical" size={20} color={COLORS.textSecondary} />
            </TouchableOpacity>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: SPACING.s,
        marginBottom: SPACING.s,
    },
    image: {
        width: 60,
        height: 60,
        borderRadius: 30, // Circular
        backgroundColor: COLORS.surface,
    },
    infoContainer: {
        flex: 1,
        marginLeft: SPACING.m,
        justifyContent: 'center',
    },
    title: {
        fontSize: FONT_SIZE.m,
        fontWeight: '700',
        color: COLORS.text,
        marginBottom: 4,
    },
    subtitle: {
        fontSize: FONT_SIZE.s,
        color: COLORS.textSecondary,
    },
    moreButton: {
        padding: SPACING.s,
    },
});
