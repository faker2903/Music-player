import React, { useEffect, useState } from 'react';
import {
    View,
    Text,
    FlatList,
    StyleSheet,
    Image,
    TouchableOpacity,
    SafeAreaView,
    StatusBar,
    ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useHomeStore } from '../store/useHomeStore';
import { COLORS, SPACING, FONT_SIZE } from '../constants/theme';
import { Song } from '../types';
import { useNavigation } from '@react-navigation/native';
import { AlbumItem } from '../components/AlbumItem';
import { ArtistItem } from '../components/ArtistItem';
import { SongItem } from '../components/SongItem';
import { usePlayerStore } from '../store/usePlayerStore';

const TABS = ['Suggested', 'Songs', 'Artists', 'Albums'];

export const HomeScreen = () => {
    const {
        songs,
        albums,
        artists,
        isLoading,
        error,
        fetchHomeSongs,
        fetchHomeAlbums,
        fetchHomeArtists
    } = useHomeStore();
    const { playSongList } = usePlayerStore();
    const navigation = useNavigation();
    const [activeTab, setActiveTab] = useState('Songs');

    useEffect(() => {
        if (activeTab === 'Songs' && songs.length === 0) fetchHomeSongs();
        if (activeTab === 'Albums' && albums.length === 0) fetchHomeAlbums();
        if (activeTab === 'Artists' && artists.length === 0) fetchHomeArtists();
    }, [activeTab]);



    const renderContent = () => {
        if (isLoading) {
            return <ActivityIndicator size="large" color={COLORS.primary} style={styles.loader} />;
        }

        if (error) {
            return (
                <View style={styles.centerContainer}>
                    <Text style={styles.errorText}>{error}</Text>
                    <TouchableOpacity
                        onPress={() => {
                            if (activeTab === 'Songs') fetchHomeSongs();
                            if (activeTab === 'Albums') fetchHomeAlbums();
                            if (activeTab === 'Artists') fetchHomeArtists();
                        }}
                        style={styles.retryButton}
                    >
                        <Text style={styles.retryText}>Retry</Text>
                    </TouchableOpacity>
                </View>
            );
        }

        if (activeTab === 'Albums') {
            return (
                <FlatList
                    data={albums}
                    renderItem={({ item }) => (
                        <AlbumItem
                            album={item}
                            onPress={(album) => navigation.navigate('AlbumDetails' as never, { album } as never)}
                        />
                    )}
                    keyExtractor={(item) => item.id}
                    contentContainerStyle={styles.listContent}
                    numColumns={2}
                    key={`albums-grid`}
                />
            );
        }

        if (activeTab === 'Artists') {
            return (
                <FlatList
                    data={artists}
                    renderItem={({ item }) => (
                        <ArtistItem
                            artist={item}
                            onPress={(artist) => navigation.navigate('ArtistDetails' as never, { artist } as never)}
                        />
                    )}
                    keyExtractor={(item) => item.id}
                    contentContainerStyle={styles.listContent}
                    key={`artists-list`}
                />
            );
        }

        // Default to Songs
        return (
            <FlatList
                data={songs}
                renderItem={({ item, index }) => (
                    <SongItem
                        song={item}
                        onPress={() => playSongList(songs, index)}
                    />
                )}
                keyExtractor={(item) => item.id}
                contentContainerStyle={styles.listContent}
                key={`songs-list`}
            />
        );
    };

    const getCountText = () => {
        if (activeTab === 'Albums') return `${albums.length} albums`;
        if (activeTab === 'Artists') return `${artists.length} artists`;
        return `${songs.length} songs`;
    };

    const getSortText = () => {
        if (activeTab === 'Albums') return 'Date Modified';
        if (activeTab === 'Artists') return 'Date Added';
        return 'Ascending';
    };

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="dark-content" backgroundColor={COLORS.background} />

            {/* Header */}
            <View style={styles.header}>
                <View style={styles.logoContainer}>
                    <Ionicons name="musical-notes" size={24} color={COLORS.primary} />
                    <Text style={styles.logoText}>Mume</Text>
                </View>
                <TouchableOpacity onPress={() => navigation.navigate('Search' as never)}>
                    <Ionicons name="search" size={24} color={COLORS.text} />
                </TouchableOpacity>
            </View>

            {/* Tabs */}
            <View style={styles.tabsContainer}>
                <FlatList
                    data={TABS}
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    keyExtractor={(item) => item}
                    contentContainerStyle={styles.tabsContent}
                    renderItem={({ item }) => (
                        <TouchableOpacity
                            style={styles.tabItem}
                            onPress={() => setActiveTab(item)}
                            disabled={item === 'Suggested'}
                        >
                            <Text style={[
                                styles.tabText,
                                activeTab === item && styles.activeTabText,
                                item === 'Suggested' && styles.disabledTabText
                            ]}>
                                {item}
                            </Text>
                            {activeTab === item && <View style={styles.activeTabIndicator} />}
                        </TouchableOpacity>
                    )}
                />
            </View>

            {/* Sort Bar */}
            <View style={styles.sortBar}>
                <Text style={styles.songCount}>{getCountText()}</Text>
                <TouchableOpacity style={styles.sortButton}>
                    <Text style={styles.sortText}>{getSortText()}</Text>
                    <Ionicons name="swap-vertical" size={16} color={COLORS.primary} />
                </TouchableOpacity>
            </View>

            {/* Content */}
            {renderContent()}
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
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: SPACING.m,
        paddingVertical: SPACING.m,
    },
    logoContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    logoText: {
        fontSize: FONT_SIZE.xl,
        fontWeight: '700',
        color: COLORS.text,
        marginLeft: SPACING.s,
    },
    tabsContainer: {
        paddingVertical: SPACING.s,
    },
    tabsContent: {
        paddingHorizontal: SPACING.m,
    },
    tabItem: {
        marginRight: SPACING.xl,
        alignItems: 'center',
    },
    tabText: {
        fontSize: FONT_SIZE.m,
        color: COLORS.textSecondary,
        fontWeight: '500',
        marginBottom: SPACING.xs,
    },
    activeTabText: {
        color: COLORS.primary,
        fontWeight: '700',
    },
    disabledTabText: {
        color: COLORS.border,
    },
    activeTabIndicator: {
        width: 20,
        height: 3,
        backgroundColor: COLORS.primary,
        borderRadius: 1.5,
    },
    sortBar: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: SPACING.m,
        paddingVertical: SPACING.s,
    },
    songCount: {
        fontSize: FONT_SIZE.l,
        fontWeight: '700',
        color: COLORS.text,
    },
    sortButton: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    sortText: {
        fontSize: FONT_SIZE.s,
        color: COLORS.primary,
        fontWeight: '600',
        marginRight: SPACING.xs,
    },
    listContent: {
        paddingHorizontal: SPACING.m,
        paddingBottom: 100,
    },
    songItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: SPACING.s,
        marginBottom: SPACING.s,
    },
    songImage: {
        width: 60,
        height: 60,
        borderRadius: 16,
        backgroundColor: COLORS.surface,
    },
    songInfo: {
        flex: 1,
        marginLeft: SPACING.m,
        justifyContent: 'center',
    },
    songTitle: {
        fontSize: FONT_SIZE.m,
        fontWeight: '700',
        color: COLORS.text,
        marginBottom: 4,
    },
    songArtist: {
        fontSize: FONT_SIZE.s,
        color: COLORS.textSecondary,
    },
    playButton: {
        padding: SPACING.s,
    },
    moreButton: {
        padding: SPACING.s,
    },
    loader: {
        marginTop: SPACING.xl,
    },
    centerContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    errorText: {
        color: COLORS.error,
        marginBottom: SPACING.m,
    },
    retryButton: {
        padding: SPACING.s,
        backgroundColor: COLORS.primary,
        borderRadius: 8,
    },
    retryText: {
        color: '#FFFFFF',
        fontWeight: '600',
    },
});
