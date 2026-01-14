import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { Artist } from '../types';
import { SPACING, FONT_SIZE, LIGHT_COLORS, DARK_COLORS } from '../constants/theme';
import { useThemeStore } from '../store/useThemeStore';

interface SuggestedArtistItemProps {
    artist: Artist;
    onPress: (artist: Artist) => void;
}

export const SuggestedArtistItem: React.FC<SuggestedArtistItemProps> = ({ artist, onPress }) => {
    const { isDarkMode } = useThemeStore();
    const colors = isDarkMode ? DARK_COLORS : LIGHT_COLORS;
    const imageUrl = artist.image?.find((img) => img.quality === '150x150')?.link ||
        artist.image?.find((img) => img.quality === '150x150')?.url ||
        artist.image?.[0]?.link ||
        artist.image?.[0]?.url ||
        'https://www.jiosaavn.com/img/c_icon.png';

    return (
        <TouchableOpacity style={styles.container} onPress={() => onPress(artist)}>
            <Image source={{ uri: imageUrl }} style={styles.image} />
            <Text style={[styles.name, { color: colors.text }]} numberOfLines={2}>
                {artist.name}
            </Text>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    container: {
        width: 100,
        marginRight: SPACING.m,
        alignItems: 'center',
    },
    image: {
        width: 100,
        height: 100,
        borderRadius: 16,
        marginBottom: SPACING.s,
    },
    name: {
        fontSize: FONT_SIZE.s,
        fontWeight: '600',
        textAlign: 'center',
    },
});
