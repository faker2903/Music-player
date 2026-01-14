import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { usePlayerStore } from '../store/usePlayerStore';
import { SPACING, FONT_SIZE, LIGHT_COLORS, DARK_COLORS } from '../constants/theme';
import { useNavigation } from '@react-navigation/native';
import { useThemeStore } from '../store/useThemeStore';
import { getArtistName } from '../utils/songUtils';

const { width } = Dimensions.get('window');

export const MiniPlayer = () => {
    const { currentSong, isPlaying, pauseSong, resumeSong, position, duration } = usePlayerStore();
    const navigation = useNavigation();
    const { isDarkMode } = useThemeStore();
    const colors = isDarkMode ? DARK_COLORS : LIGHT_COLORS;

    if (!currentSong) return null;

    const imageUrl = currentSong.image?.find((img) => img.quality === '150x150')?.link ||
        currentSong.image?.find((img) => img.quality === '150x150')?.url ||
        currentSong.image?.[0]?.link ||
        currentSong.image?.[0]?.url ||
        'https://www.jiosaavn.com/img/c_icon.png';

    const handlePress = () => {
        navigation.navigate('Player' as never);
    };

    const progress = duration > 0 ? (position / duration) * 100 : 0;

    return (
        <TouchableOpacity
            style={[
                styles.container,
                {
                    backgroundColor: isDarkMode ? 'rgba(30, 30, 30, 0.95)' : 'rgba(255, 255, 255, 0.95)',
                    borderColor: colors.border
                }
            ]}
            onPress={handlePress}
            activeOpacity={0.9}
        >
            <View style={[styles.progressBar, { backgroundColor: colors.border + '40' }]}>
                <View style={[styles.progress, { backgroundColor: colors.primary, width: `${progress}%` }]} />
            </View>
            <View style={styles.content}>
                <Image source={{ uri: imageUrl }} style={styles.image} />
                <View style={styles.infoContainer}>
                    <Text style={[styles.title, { color: colors.text }]} numberOfLines={1}>
                        {currentSong.name}
                    </Text>
                    <Text style={[styles.artist, { color: colors.textSecondary }]} numberOfLines={1}>
                        {getArtistName(currentSong)}
                    </Text>
                </View>
                <TouchableOpacity
                    style={[styles.playButton, { backgroundColor: colors.primary + '20' }]}
                    onPress={isPlaying ? pauseSong : resumeSong}
                >
                    <Ionicons
                        name={isPlaying ? "pause" : "play"}
                        size={24}
                        color={colors.primary}
                    />
                </TouchableOpacity>
            </View>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        bottom: 70,
        left: SPACING.m,
        right: SPACING.m,
        borderRadius: 12,
        borderWidth: 1,
        elevation: 10,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 4,
        },
        shadowOpacity: 0.2,
        shadowRadius: 8,
        overflow: 'hidden',
    },
    content: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: SPACING.m,
        paddingVertical: SPACING.s,
        height: 64,
    },
    image: {
        width: 40,
        height: 40,
        borderRadius: 4,
    },
    infoContainer: {
        flex: 1,
        marginLeft: SPACING.m,
        justifyContent: 'center',
    },
    title: {
        fontSize: FONT_SIZE.m,
        fontWeight: '600',
    },
    artist: {
        fontSize: FONT_SIZE.s,
    },
    playButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        alignItems: 'center',
        justifyContent: 'center',
    },
    progressBar: {
        height: 3,
        width: '100%',
    },
    progress: {
        height: '100%',
    },
});
