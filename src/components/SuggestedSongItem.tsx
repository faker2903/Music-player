import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { Song } from '../types';
import { COLORS, SPACING, FONT_SIZE } from '../constants/theme';

interface SuggestedSongItemProps {
    song: Song;
    onPress: (song: Song) => void;
}

export const SuggestedSongItem: React.FC<SuggestedSongItemProps> = ({ song, onPress }) => {
    const imageUrl = song.image?.find((img) => img.quality === '150x150')?.link ||
        song.image?.find((img) => img.quality === '150x150')?.url ||
        song.image?.[0]?.link ||
        song.image?.[0]?.url ||
        'https://www.jiosaavn.com/img/c_icon.png';

    return (
        <TouchableOpacity style={styles.container} onPress={() => onPress(song)}>
            <Image source={{ uri: imageUrl }} style={styles.image} />
            <Text style={styles.title} numberOfLines={1}>
                {song.name}
            </Text>
            <Text style={styles.artist} numberOfLines={1}>
                {song.primaryArtists}
            </Text>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    container: {
        width: 120,
        marginRight: SPACING.m,
    },
    image: {
        width: 120,
        height: 120,
        borderRadius: 12,
        backgroundColor: COLORS.surface,
        marginBottom: SPACING.s,
    },
    title: {
        fontSize: FONT_SIZE.s,
        fontWeight: '600',
        color: COLORS.text,
        marginBottom: 2,
    },
    artist: {
        fontSize: 10,
        color: COLORS.textSecondary,
    },
});
