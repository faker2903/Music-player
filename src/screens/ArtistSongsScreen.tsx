import React, { useEffect, useState } from 'react';
import {
    View,
    Text,
    FlatList,
    StyleSheet,
    TouchableOpacity,
    ActivityIndicator,
    SafeAreaView,
    StatusBar,
} from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SPACING, FONT_SIZE } from '../constants/theme';
import { Song, Artist } from '../types';
import { getArtistSongs } from '../api/api';
import { usePlayerStore } from '../store/usePlayerStore';
import { SongItem } from '../components/SongItem';

export const ArtistSongsScreen = () => {
    const route = useRoute();
    const navigation = useNavigation();
    const { artist } = route.params as { artist: Artist };
    const [songs, setSongs] = useState<Song[]>([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const [loadingMore, setLoadingMore] = useState(false);
    const { playSong } = usePlayerStore();

    const fetchSongs = async (pageNum: number) => {
        try {
            if (pageNum === 1) setLoading(true);
            else setLoadingMore(true);

            const data = await getArtistSongs(artist.id, pageNum);

            let newSongs: Song[] = [];
            if (data.data && data.data.songs) {
                newSongs = data.data.songs;
            } else if (Array.isArray(data.data)) {
                newSongs = data.data;
            } else if (data.data && data.data.results) {
                newSongs = data.data.results;
            }

            if (newSongs.length === 0) {
                setHasMore(false);
            } else {
                setSongs(prev => pageNum === 1 ? newSongs : [...prev, ...newSongs]);
            }
        } catch (error) {
            console.error('Error fetching artist songs:', error);
        } finally {
            setLoading(false);
            setLoadingMore(false);
        }
    };

    useEffect(() => {
        fetchSongs(1);
    }, [artist.id]);

    const loadMore = () => {
        if (!loadingMore && hasMore) {
            const nextPage = page + 1;
            setPage(nextPage);
            fetchSongs(nextPage);
        }
    };

    const renderFooter = () => {
        if (!loadingMore) return null;
        return (
            <View style={styles.footerLoader}>
                <ActivityIndicator size="small" color={COLORS.primary} />
            </View>
        );
    };

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="dark-content" backgroundColor={COLORS.background} />

            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                    <Ionicons name="arrow-back" size={24} color={COLORS.text} />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>{artist.name} - All Songs</Text>
            </View>

            {loading ? (
                <View style={styles.centerLoader}>
                    <ActivityIndicator size="large" color={COLORS.primary} />
                </View>
            ) : (
                <FlatList
                    data={songs}
                    renderItem={({ item }) => (
                        <SongItem
                            song={item}
                            onPress={(song) => playSong(song)}
                        />
                    )}
                    keyExtractor={(item, index) => `${item.id}-${index}`}
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
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: SPACING.m,
        borderBottomWidth: 1,
        borderBottomColor: COLORS.surface,
    },
    backButton: {
        marginRight: SPACING.m,
    },
    headerTitle: {
        fontSize: FONT_SIZE.l,
        fontWeight: '700',
        color: COLORS.text,
    },
    listContent: {
        padding: SPACING.m,
        paddingBottom: 100, // For mini player
    },
    centerLoader: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    footerLoader: {
        paddingVertical: SPACING.m,
        alignItems: 'center',
    },
});
