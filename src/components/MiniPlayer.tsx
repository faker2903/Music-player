import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { usePlayerStore } from '../store/usePlayerStore';
import { COLORS, SPACING, FONT_SIZE } from '../constants/theme';
import { useNavigation } from '@react-navigation/native';

const { width } = Dimensions.get('window');

export const MiniPlayer = () => {
    const { currentSong, isPlaying, pauseSong, resumeSong } = usePlayerStore();
    const navigation = useNavigation();

    if (!currentSong) return null;

    const imageUrl = currentSong.image?.find((img) => img.quality === '150x150')?.link || currentSong.image?.[0]?.link || 'https://www.jiosaavn.com/img/c_icon.png';

    const handlePress = () => {
        navigation.navigate('Player' as never);
    };

    return (
        <TouchableOpacity style={styles.container} onPress={handlePress} activeOpacity={0.9}>
            <View style={styles.content}>
                <Image source={{ uri: imageUrl }} style={styles.image} />
                <View style={styles.infoContainer}>
                    <Text style={styles.title} numberOfLines={1}>
                        {currentSong.name}
                    </Text>
                    <Text style={styles.artist} numberOfLines={1}>
                        {currentSong.primaryArtists}
                    </Text>
                </View>
                <TouchableOpacity
                    style={styles.playButton}
                    onPress={isPlaying ? pauseSong : resumeSong}
                >
                    <Ionicons
                        name={isPlaying ? "pause" : "play"}
                        size={24}
                        color={COLORS.text}
                    />
                </TouchableOpacity>
            </View>
            {/* Progress Bar (Optional, simple line for now) */}
            <View style={styles.progressBar}>
                <View style={[styles.progress, { width: '0%' }]} />
            </View>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        bottom: 60, // Above tab bar
        left: 0,
        right: 0,
        backgroundColor: COLORS.surface, // Or a distinct color
        borderTopWidth: 1,
        borderTopColor: COLORS.border,
        elevation: 5,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: -2,
        },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    content: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: SPACING.s,
        height: 60,
    },
    image: {
        width: 40,
        height: 40,
        borderRadius: 4,
        backgroundColor: '#ccc',
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
    },
    artist: {
        fontSize: FONT_SIZE.s,
        color: COLORS.textSecondary,
    },
    playButton: {
        padding: SPACING.s,
    },
    progressBar: {
        height: 2,
        backgroundColor: COLORS.border,
        width: '100%',
    },
    progress: {
        height: '100%',
        backgroundColor: COLORS.primary,
    },
});
