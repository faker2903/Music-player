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
import { COLORS, SPACING, FONT_SIZE } from '../constants/theme';
import { useNavigation } from '@react-navigation/native';
import Slider from '@react-native-community/slider';

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
        seekTo
    } = usePlayerStore();
    const navigation = useNavigation();
    const [sliderValue, setSliderValue] = useState(0);
    const [isSeeking, setIsSeeking] = useState(false);

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
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                    <Ionicons name="chevron-down" size={30} color={COLORS.text} />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Now Playing</Text>
                <TouchableOpacity style={styles.moreButton}>
                    <Ionicons name="ellipsis-horizontal" size={24} color={COLORS.text} />
                </TouchableOpacity>
            </View>

            <View style={styles.content}>
                <Image source={{ uri: imageUrl }} style={styles.artwork} />

                <View style={styles.infoContainer}>
                    <Text style={styles.title} numberOfLines={1}>{currentSong.name}</Text>
                    <Text style={styles.artist} numberOfLines={1}>{currentSong.primaryArtists}</Text>
                </View>

                <View style={styles.progressContainer}>
                    <Slider
                        style={styles.slider}
                        minimumValue={0}
                        maximumValue={duration}
                        value={sliderValue}
                        minimumTrackTintColor={COLORS.primary}
                        maximumTrackTintColor={COLORS.border}
                        thumbTintColor={COLORS.primary}
                        onSlidingStart={() => setIsSeeking(true)}
                        onSlidingComplete={async (value) => {
                            await seekTo(value);
                            setIsSeeking(false);
                        }}
                    />
                    <View style={styles.timeContainer}>
                        <Text style={styles.timeText}>{formatTime(sliderValue)}</Text>
                        <Text style={styles.timeText}>{formatTime(duration)}</Text>
                    </View>
                </View>

                <View style={styles.controls}>
                    <TouchableOpacity onPress={playPrevious}>
                        <Ionicons name="play-skip-back" size={35} color={COLORS.text} />
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={styles.playPauseButton}
                        onPress={isPlaying ? pauseSong : resumeSong}
                    >
                        <Ionicons
                            name={isPlaying ? "pause" : "play"}
                            size={40}
                            color="#FFFFFF"
                        />
                    </TouchableOpacity>

                    <TouchableOpacity onPress={playNext}>
                        <Ionicons name="play-skip-forward" size={35} color={COLORS.text} />
                    </TouchableOpacity>
                </View>
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.background,
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
        color: COLORS.text,
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
        backgroundColor: COLORS.surface,
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
        color: COLORS.text,
        marginBottom: SPACING.xs,
        textAlign: 'center',
    },
    artist: {
        fontSize: FONT_SIZE.m,
        color: COLORS.textSecondary,
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
        color: COLORS.textSecondary,
    },
    controls: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        width: '60%',
    },
    playPauseButton: {
        width: 70,
        height: 70,
        borderRadius: 35,
        backgroundColor: COLORS.primary,
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: COLORS.primary,
        shadowOffset: {
            width: 0,
            height: 4,
        },
        shadowOpacity: 0.4,
        shadowRadius: 8,
        elevation: 8,
    },
});
