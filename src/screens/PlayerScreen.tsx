import React, { useEffect, useState } from 'react';
import {
    View,
    Text,
    Image,
    StyleSheet,
    TouchableOpacity,
    SafeAreaView,
    Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { usePlayerStore } from '../store/usePlayerStore';
import { SPACING, FONT_SIZE, LIGHT_COLORS, DARK_COLORS } from '../constants/theme';
import { useNavigation } from '@react-navigation/native';
import Slider from '@react-native-community/slider';
import { useThemeStore } from '../store/useThemeStore';
import { useFavoritesStore } from '../store/useFavoritesStore';
import { getArtistName } from '../utils/songUtils';

const { width } = Dimensions.get('window');

export const PlayerScreen = () => {
    const {
        currentSong,
        isPlaying,
        pauseSong,
        resumeSong,
        playNext,
        playPrevious,
        position,
        duration,
        seekTo,
        repeatMode,
        toggleRepeatMode
    } = usePlayerStore();
    const { toggleFavorite, isFavorite } = useFavoritesStore();
    const navigation = useNavigation();
    const [sliderValue, setSliderValue] = useState(0);
    const [isSeeking, setIsSeeking] = useState(false);
    const { isDarkMode } = useThemeStore();
    const colors = isDarkMode ? DARK_COLORS : LIGHT_COLORS;
    const styles = React.useMemo(() => createStyles(colors), [colors]);

    useEffect(() => {
        if (!isSeeking) {
            setSliderValue(position);
        }
    }, [position, isSeeking]);

    if (!currentSong) return null;

    const imageUrl = currentSong.image?.find((img) => img.quality === '500x500')?.link ||
        currentSong.image?.find((img) => img.quality === '500x500')?.url ||
        currentSong.image?.[0]?.link ||
        currentSong.image?.[0]?.url ||
        'https://www.jiosaavn.com/img/c_icon.png';

    const formatTime = (millis: number) => {
        const totalSeconds = Math.floor(millis / 1000);
        const minutes = Math.floor(totalSeconds / 60);
        const seconds = totalSeconds % 60;
        return `${minutes}:${seconds.toString().padStart(2, '0')}`;
    };

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                    <Ionicons name="chevron-down" size={30} color={colors.text} />
                </TouchableOpacity>
                <Text style={[styles.headerTitle, { color: colors.text }]}>Now Playing</Text>
                <TouchableOpacity style={styles.moreButton}>
                    <Ionicons name="ellipsis-horizontal" size={24} color={colors.text} />
                </TouchableOpacity>
            </View>

            <View style={styles.content}>
                <Image source={{ uri: imageUrl }} style={styles.artwork} />

                <View style={styles.infoContainer}>
                    <Text style={[styles.title, { color: colors.text }]} numberOfLines={1}>{currentSong.name}</Text>
                    <Text style={[styles.artist, { color: colors.textSecondary }]} numberOfLines={1}>
                        {getArtistName(currentSong)}
                    </Text>
                </View>

                <View style={styles.progressContainer}>
                    <Slider
                        style={styles.slider}
                        minimumValue={0}
                        maximumValue={duration}
                        value={sliderValue}
                        minimumTrackTintColor={colors.primary}
                        maximumTrackTintColor={colors.border}
                        thumbTintColor={colors.primary}
                        onSlidingStart={() => setIsSeeking(true)}
                        onSlidingComplete={async (value) => {
                            await seekTo(value);
                            setIsSeeking(false);
                        }}
                        onValueChange={setSliderValue}
                    />
                    <View style={styles.timeContainer}>
                        <Text style={[styles.timeText, { color: colors.textSecondary }]}>{formatTime(sliderValue)}</Text>
                        <Text style={[styles.timeText, { color: colors.textSecondary }]}>{formatTime(duration)}</Text>
                    </View>
                </View>

                <View style={styles.controls}>
                    <TouchableOpacity onPress={toggleRepeatMode} style={styles.secondaryControl}>
                        <Ionicons
                            name={repeatMode === 'one' ? "repeat" : "repeat"}
                            size={24}
                            color={repeatMode !== 'off' ? colors.primary : colors.textSecondary}
                        />
                        {repeatMode === 'one' && (
                            <View style={[styles.repeatOneBadge, { backgroundColor: colors.primary }]}>
                                <Text style={styles.repeatOneText}>1</Text>
                            </View>
                        )}
                    </TouchableOpacity>

                    <TouchableOpacity onPress={playPrevious}>
                        <Ionicons name="play-skip-back" size={35} color={colors.text} />
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={[styles.playPauseButton, { backgroundColor: colors.primary, shadowColor: colors.primary }]}
                        onPress={isPlaying ? pauseSong : resumeSong}
                    >
                        <Ionicons
                            name={isPlaying ? "pause" : "play"}
                            size={40}
                            color="#FFFFFF"
                        />
                    </TouchableOpacity>

                    <TouchableOpacity onPress={playNext}>
                        <Ionicons name="play-skip-forward" size={35} color={colors.text} />
                    </TouchableOpacity>

                    <TouchableOpacity onPress={() => toggleFavorite(currentSong)} style={styles.secondaryControl}>
                        <Ionicons
                            name={isFavorite(currentSong.id) ? "heart" : "heart-outline"}
                            size={28}
                            color={isFavorite(currentSong.id) ? colors.primary : colors.textSecondary}
                        />
                    </TouchableOpacity>
                </View>
            </View>
        </SafeAreaView>
    );
};

const createStyles = (colors: typeof LIGHT_COLORS) => StyleSheet.create({
    container: {
        flex: 1,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: SPACING.m,
        paddingVertical: SPACING.m,
    },
    backButton: {
        padding: SPACING.s,
    },
    headerTitle: {
        fontSize: FONT_SIZE.l,
        fontWeight: '600',
    },
    moreButton: {
        padding: SPACING.s,
    },
    content: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: SPACING.l,
    },
    artwork: {
        width: width - SPACING.xl * 2,
        height: width - SPACING.xl * 2,
        borderRadius: 20,
        marginBottom: SPACING.xl,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 10,
        },
        shadowOpacity: 0.3,
        shadowRadius: 20,
        elevation: 10,
    },
    infoContainer: {
        alignItems: 'center',
        marginBottom: SPACING.xl,
        width: '100%',
    },
    title: {
        fontSize: FONT_SIZE.xl,
        fontWeight: '700',
        marginBottom: SPACING.xs,
        textAlign: 'center',
    },
    artist: {
        fontSize: FONT_SIZE.l,
        textAlign: 'center',
    },
    progressContainer: {
        width: '100%',
        marginBottom: SPACING.xl,
    },
    slider: {
        width: '100%',
        height: 40,
    },
    timeContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: SPACING.s,
    },
    timeText: {
        fontSize: FONT_SIZE.s,
    },
    controls: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        width: '100%',
        paddingHorizontal: SPACING.m,
    },
    secondaryControl: {
        width: 40,
        height: 40,
        alignItems: 'center',
        justifyContent: 'center',
    },
    repeatOneBadge: {
        position: 'absolute',
        top: 8,
        right: 8,
        width: 12,
        height: 12,
        borderRadius: 6,
        alignItems: 'center',
        justifyContent: 'center',
    },
    repeatOneText: {
        color: '#FFFFFF',
        fontSize: 8,
        fontWeight: 'bold',
    },
    playPauseButton: {
        width: 70,
        height: 70,
        borderRadius: 35,
        alignItems: 'center',
        justifyContent: 'center',
        shadowOffset: {
            width: 0,
            height: 4,
        },
        shadowOpacity: 0.4,
        shadowRadius: 8,
        elevation: 8,
    },
});
