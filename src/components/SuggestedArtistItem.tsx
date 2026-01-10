import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { Artist } from '../types';
import { COLORS, SPACING, FONT_SIZE } from '../constants/theme';

interface SuggestedArtistItemProps {
    artist: Artist;
    onPress: (artist: Artist) => void;
}

export const SuggestedArtistItem: React.FC<SuggestedArtistItemProps> = ({ artist, onPress }) => {
    const imageUrl = artist.image?.find((img) => img.quality === '150x150')?.link || artist.image?.[0]?.link || 'https://www.jiosaavn.com/img/c_icon.png';

    return (
        <TouchableOpacity style={styles.container} onPress={() => onPress(artist)}>
            <Image source={{ uri: imageUrl }} style={styles.image} />
            <Text style={styles.name} numberOfLines={2}>
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
        backgroundColor: COLORS.surface,
        marginBottom: SPACING.s,
    },
    name: {
        fontSize: FONT_SIZE.s,
        fontWeight: '600',
        color: COLORS.text,
        textAlign: 'center',
    },
});
