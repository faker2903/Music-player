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
import { COLORS, SPACING, FONT_SIZE } from '../constants/theme';
import { Artist, Song } from '../types';
import { getArtist, getArtistSongs } from '../api/api';
import { usePlayerStore } from '../store/usePlayerStore';
import { SongItem } from '../components/SongItem';

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

    const fetchArtistData = async (pageNum: number) => {
        try {
            if (pageNum === 1) setLoading(true);
            else setLoadingMore(true);

            // Fetch details only on first page
            const promises: Promise<any>[] = [getArtistSongs(artist.id, pageNum)];
            if (pageNum === 1) {
                promises.push(getArtist(artist.id));
            }

            const results = await Promise.all(promises);
            const songsData = results[0];
            const artistData = pageNum === 1 ? results[1] : null;

            // Handle Artist Details
            if (artistData) {
                if (artistData.data) {
                    // @ts-ignore
                    setDetails(Array.isArray(artistData.data) ? artistData.data[0] : artistData.data);
                }
            }

            // Handle Songs
            let newSongs: Song[] = [];
            if (songsData.data && songsData.data.songs) {
                newSongs = songsData.data.songs;
            } else if (Array.isArray(songsData.data)) {
                newSongs = songsData.data;
            } else if (songsData.data && songsData.data.results) {
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
    // Handle image array or string, and check for both url and link properties
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
            <Text style={styles.title} numberOfLines={2}>{currentArtist.name}</Text>
            <Text style={styles.subtitle}>
                {currentArtist.role || 'Artist'} | {currentArtist.type || 'Music'}
            </Text>

            <View style={styles.buttonContainer}>
                <TouchableOpacity style={styles.shuffleButton}>
                    <Ionicons name="shuffle" size={20} color="#FFFFFF" />
                    <Text style={styles.shuffleText}>Shuffle</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.playButton}>
                    <Ionicons name="play-circle" size={20} color={COLORS.primary} />
                    <Text style={styles.playText}>Play</Text>
                </TouchableOpacity>
            </View>

            <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>Songs</Text>
            </View>
        </View>
    );

    const renderFooter = () => {
        if (!loadingMore) return null;
        return (
            <View style={{ paddingVertical: 20 }}>
                <ActivityIndicator size="small" color={COLORS.primary} />
            </View>
        );
    };

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="dark-content" backgroundColor={COLORS.background} />

            {/* Navbar */}
            <View style={styles.navbar}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Ionicons name="arrow-back" size={24} color={COLORS.text} />
                </TouchableOpacity>
                <View style={styles.navActions}>
                    <TouchableOpacity style={styles.navIcon}>
                        <Ionicons name="search" size={24} color={COLORS.text} />
                    </TouchableOpacity>
                </View>
            </View>

            {loading ? (
                <View style={styles.loader}>
                    <ActivityIndicator size="large" color={COLORS.primary} />
                </View>
            ) : (
                <FlatList
                    data={songs}
                    renderItem={({ item, index }) => (
                        <SongItem
                            song={item}
                            onPress={() => playSongList(songs, index)}
                        />
                    )}
                    keyExtractor={(item, index) => `${item.id}-${index}`}
                    ListHeaderComponent={renderHeader}
                    contentContainerStyle={styles.listContent}
                    onEndReached={loadMore}
                    onEndReachedThreshold={0.5}
                    ListFooterComponent={renderFooter}
                />
            )}
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.background,
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
        borderRadius: 100, // Circular
        marginBottom: SPACING.m,
        backgroundColor: COLORS.surface,
    },
    title: {
        fontSize: FONT_SIZE.xl,
        fontWeight: '700',
        color: COLORS.text,
        textAlign: 'center',
        marginBottom: SPACING.xs,
    },
    subtitle: {
        fontSize: FONT_SIZE.s,
        color: COLORS.textSecondary,
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
        backgroundColor: COLORS.primary,
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
        backgroundColor: '#FFF0E0', // Light orange
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: SPACING.m,
        borderRadius: 30,
    },
    playText: {
        color: COLORS.primary,
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
        color: COLORS.text,
    },
    seeAllText: {
        fontSize: FONT_SIZE.s,
        color: COLORS.primary,
        fontWeight: '600',
    },
    songItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: SPACING.m,
        paddingVertical: SPACING.s,
    },
    songImage: {
        width: 50,
        height: 50,
        borderRadius: 12,
        backgroundColor: COLORS.surface,
    },
    songInfo: {
        flex: 1,
        marginLeft: SPACING.m,
    },
    songTitle: {
        fontSize: FONT_SIZE.m,
        fontWeight: '600',
        color: COLORS.text,
        marginBottom: 2,
    },
    songArtist: {
        fontSize: FONT_SIZE.s,
        color: COLORS.textSecondary,
    },
    iconButton: {
        padding: SPACING.s,
    },
    loader: {
        marginTop: SPACING.xl,
    },
});
