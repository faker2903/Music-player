import React, { useState } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { Song } from '../types';
import { SPACING, FONT_SIZE, LIGHT_COLORS, DARK_COLORS } from '../constants/theme';
import { Ionicons } from '@expo/vector-icons';
import { usePlayerStore } from '../store/usePlayerStore';
import { SongOptionsModal } from './SongOptionsModal';
import { useThemeStore } from '../store/useThemeStore';
import { getArtistName } from '../utils/songUtils';

interface SongItemProps {
    song: Song;
    onPress: (song: Song) => void;
}

export const SongItem: React.FC<SongItemProps> = ({ song, onPress }) => {
    const imageUrl = song.image?.find((img) => img.quality === '150x150')?.link ||
        song.image?.find((img) => img.quality === '150x150')?.url ||
        song.image?.[0]?.link ||
        song.image?.[0]?.url ||
        'https://www.jiosaavn.com/img/c_icon.png';
    const { currentSong, isPlaying, pauseSong, resumeSong } = usePlayerStore();
    const [modalVisible, setModalVisible] = useState(false);
    const { isDarkMode } = useThemeStore();
    const colors = isDarkMode ? DARK_COLORS : LIGHT_COLORS;

    const isCurrentSong = currentSong?.id === song.id;

    const handlePlayPress = () => {
        if (isCurrentSong) {
            if (isPlaying) {
                pauseSong();
            } else {
                resumeSong();
            }
        } else {
            onPress(song);
        }
    };

    return (
        <TouchableOpacity style={styles.container} onPress={handlePlayPress}>
            <Image source={{ uri: imageUrl }} style={styles.image} />
            <View style={styles.infoContainer}>
                <Text style={[styles.title, { color: colors.text }]} numberOfLines={1}>
                    {song.name}
                </Text>
                <Text style={[styles.artist, { color: colors.textSecondary }]} numberOfLines={1}>
                    {getArtistName(song)}
                </Text>
            </View>
            <TouchableOpacity style={styles.playButton} onPress={handlePlayPress}>
                <Ionicons
                    name={isCurrentSong && isPlaying ? "pause-circle" : "play-circle"}
                    size={24}
                    color={colors.primary}
                />
            </TouchableOpacity>
            <TouchableOpacity style={styles.moreButton} onPress={() => setModalVisible(true)}>
                <Ionicons name="ellipsis-vertical" size={20} color={colors.textSecondary} />
            </TouchableOpacity>

            <SongOptionsModal
                visible={modalVisible}
                onClose={() => setModalVisible(false)}
                song={song}
            />
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: SPACING.s,
        paddingHorizontal: SPACING.m,
    },
    image: {
        width: 50,
        height: 50,
        borderRadius: 8,
    },
    infoContainer: {
        flex: 1,
        marginLeft: SPACING.m,
        justifyContent: 'center',
    },
    title: {
        fontSize: FONT_SIZE.m,
        fontWeight: '600',
        marginBottom: 4,
    },
    artist: {
        fontSize: FONT_SIZE.s,
    },
    playButton: {
        padding: SPACING.s,
    },
    moreButton: {
        padding: SPACING.s,
    },
});
