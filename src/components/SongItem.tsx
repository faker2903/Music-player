import React, { useState } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { Song } from '../types';
import { COLORS, SPACING, FONT_SIZE } from '../constants/theme';
import { Ionicons } from '@expo/vector-icons';
import { usePlayerStore } from '../store/usePlayerStore';
import { SongOptionsModal } from './SongOptionsModal';

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
                <Text style={styles.title} numberOfLines={1}>
                    {song.name}
                </Text>
                <Text style={styles.artist} numberOfLines={1}>
                    {song.primaryArtists}
                </Text>
            </View>
            <TouchableOpacity style={styles.playButton} onPress={handlePlayPress}>
                <Ionicons
                    name={isCurrentSong && isPlaying ? "pause-circle" : "play-circle"}
                    size={24}
                    color={COLORS.primary}
                />
            </TouchableOpacity>
            <TouchableOpacity style={styles.moreButton} onPress={() => setModalVisible(true)}>
                <Ionicons name="ellipsis-vertical" size={20} color={COLORS.textSecondary} />
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
        backgroundColor: COLORS.surface,
    },
    infoContainer: {
        flex: 1,
        marginLeft: SPACING.m,
        justifyContent: 'center',
    },
    title: {
        fontSize: FONT_SIZE.m,
        fontWeight: '600',
        color: COLORS.text,
        marginBottom: 4,
    },
    artist: {
        fontSize: FONT_SIZE.s,
        color: COLORS.textSecondary,
    },
    playButton: {
        padding: SPACING.s,
    },
    moreButton: {
        padding: SPACING.s,
    },
});
