import React, { useEffect, useState } from 'react';
import {
    View,
    Text,
    Image,
    StyleSheet,
    TouchableOpacity,
    FlatList,
    SafeAreaView,
    StatusBar,
    ActivityIndicator,
} from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { SPACING, FONT_SIZE, LIGHT_COLORS, DARK_COLORS } from '../constants/theme';
import { Artist, Song } from '../types';
import { getArtist, getArtistSongs } from '../api/api';
import { usePlayerStore } from '../store/usePlayerStore';
import { SongItem } from '../components/SongItem';
import { useThemeStore } from '../store/useThemeStore';

export const ArtistDetailsScreen = () => {
    const route = useRoute();
    const navigation = useNavigation();
    const { artist } = route.params as { artist: Artist };
    const [details, setDetails] = useState<Artist | null>(null);
    const [songs, setSongs] = useState<Song[]>([]);
    const [loading, setLoading] = useState(true);
    const [loadingMore, setLoadingMore] = useState(false);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const { playSongList } = usePlayerStore();
    const { isDarkMode } = useThemeStore();
    const colors = isDarkMode ? DARK_COLORS : LIGHT_COLORS;
    const styles = React.useMemo(() => createStyles(colors), [colors]);

    const fetchArtistData = async (pageNum: number) => {
        try {
            if (pageNum === 1) setLoading(true);
            else setLoadingMore(true);

            const promises: Promise<any>[] = [getArtistSongs(artist.id, pageNum)];
            if (pageNum === 1) {
                promises.push(getArtist(artist.id));
            }

            const results = await Promise.all(promises);
            const songsData = results[0];
            const artistData = pageNum === 1 ? results[1] : null;

            if (artistData?.data) {
                // @ts-ignore
                setDetails(Array.isArray(artistData.data) ? artistData.data[0] : artistData.data);
            }

            let newSongs: Song[] = [];
            if (songsData.data?.songs) {
                newSongs = songsData.data.songs;
            } else if (Array.isArray(songsData.data)) {
                newSongs = songsData.data;
            } else if (songsData.data?.results) {
                newSongs = songsData.data.results;
            }

            if (newSongs.length === 0) {
                setHasMore(false);
            } else {
                setSongs(prev => pageNum === 1 ? newSongs : [...prev, ...newSongs]);
            }
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
            setLoadingMore(false);
        }
    };

    useEffect(() => {
        fetchArtistData(1);
    }, [artist.id]);

    const loadMore = () => {
        if (!loadingMore && hasMore && !loading) {
            const nextPage = page + 1;
            setPage(nextPage);
            fetchArtistData(nextPage);
        }
    };

    const currentArtist = details || artist;
    const getArtistImage = () => {
        if (Array.isArray(currentArtist.image)) {
            const img = currentArtist.image.find((img) => img.quality === '500x500') || currentArtist.image[0];
            return img?.url || img?.link || 'https://www.jiosaavn.com/img/c_icon.png';
        }
        return typeof currentArtist.image === 'string' ? currentArtist.image : 'https://www.jiosaavn.com/img/c_icon.png';
    };

    const imageUrl = getArtistImage();

    const renderHeader = () => (
        <View style={styles.headerContent}>
            <Image source={{ uri: imageUrl }} style={styles.artistImage} />
            <Text style={[styles.title, { color: colors.text }]} numberOfLines={2}>{currentArtist.name}</Text>
            <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
                {currentArtist.role || 'Artist'} | {currentArtist.type || 'Music'}
            </Text>

            <View style={styles.buttonContainer}>
                <TouchableOpacity style={[styles.shuffleButton, { backgroundColor: colors.primary }]}>
                    <Ionicons name="shuffle" size={20} color="#FFFFFF" />
                    <Text style={styles.shuffleText}>Shuffle</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.playButton, { backgroundColor: isDarkMode ? colors.surface : '#FFF0E0' }]}>
                    <Ionicons name="play-circle" size={20} color={colors.primary} />
                    <Text style={[styles.playText, { color: colors.primary }]}>Play</Text>
                </TouchableOpacity>
            </View>

            <View style={styles.sectionHeader}>
                <Text style={[styles.sectionTitle, { color: colors.text }]}>Songs</Text>
            </View>
        </View>
    );

    const renderFooter = () => {
        if (!loadingMore) return null;
        return (
            <View style={{ paddingVertical: 20 }}>
                <ActivityIndicator size="small" color={colors.primary} />
            </View>
        );
    };

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
            <StatusBar barStyle={isDarkMode ? "light-content" : "dark-content"} backgroundColor={colors.background} />

            <View style={styles.navbar}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Ionicons name="arrow-back" size={24} color={colors.text} />
                </TouchableOpacity>
                <View style={styles.navActions}>
                    <TouchableOpacity style={styles.navIcon}>
                        <Ionicons name="search" size={24} color={colors.text} />
                    </TouchableOpacity>
                </View>
            </View>

            <FlatList
                data={songs}
                renderItem={({ item, index }) => (
                    <SongItem
                        song={item}
                        onPress={() => playSongList(songs, index)}
                    />
                )}
                keyExtractor={(item, index) => `${item.id}-${index}`}
                ListHeaderComponent={
                    <>
                        {renderHeader()}
                        {loading && songs.length === 0 && (
                            <View style={styles.loaderContainer}>
                                <ActivityIndicator size="large" color={colors.primary} />
                            </View>
                        )}
                    </>
                }
                ListEmptyComponent={
                    !loading && songs.length === 0 ? (
                        <View style={styles.loaderContainer}>
                            <Text style={[styles.emptyText, { color: colors.textSecondary }]}>No songs available</Text>
                        </View>
                    ) : null
                }
                contentContainerStyle={styles.listContent}
                onEndReached={loadMore}
                onEndReachedThreshold={0.5}
                ListFooterComponent={renderFooter}
            />
        </SafeAreaView>
    );
};

const createStyles = (colors: typeof LIGHT_COLORS) => StyleSheet.create({
    container: {
        flex: 1,
    },
    navbar: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: SPACING.m,
        paddingVertical: SPACING.s,
    },
    navActions: {
        flexDirection: 'row',
    },
    navIcon: {
        marginLeft: SPACING.m,
    },
    listContent: {
        paddingBottom: 100,
    },
    headerContent: {
        alignItems: 'center',
        padding: SPACING.l,
    },
    artistImage: {
        width: 200,
        height: 200,
        borderRadius: 100,
        marginBottom: SPACING.m,
        backgroundColor: colors.surface,
    },
    title: {
        fontSize: FONT_SIZE.xl,
        fontWeight: '700',
        textAlign: 'center',
        marginBottom: SPACING.xs,
    },
    subtitle: {
        fontSize: FONT_SIZE.s,
        textAlign: 'center',
        marginBottom: SPACING.l,
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        width: '100%',
        paddingHorizontal: SPACING.l,
        marginBottom: SPACING.xl,
    },
    shuffleButton: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: SPACING.m,
        borderRadius: 30,
        marginRight: SPACING.m,
    },
    shuffleText: {
        color: '#FFFFFF',
        fontWeight: '600',
        marginLeft: SPACING.xs,
        fontSize: FONT_SIZE.m,
    },
    playButton: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: SPACING.m,
        borderRadius: 30,
    },
    playText: {
        fontWeight: '600',
        marginLeft: SPACING.xs,
        fontSize: FONT_SIZE.m,
    },
    sectionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        width: '100%',
        paddingHorizontal: SPACING.m,
        marginBottom: SPACING.m,
    },
    sectionTitle: {
        fontSize: FONT_SIZE.l,
        fontWeight: '700',
    },
    loaderContainer: {
        paddingVertical: SPACING.xl,
        alignItems: 'center',
    },
    emptyText: {
        fontSize: FONT_SIZE.m,
    },
});
