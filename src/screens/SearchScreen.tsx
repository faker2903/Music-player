import React, { useEffect, useState } from 'react';
import {
    View,
    Text,
    TextInput,
    FlatList,
    StyleSheet,
    ActivityIndicator,
    TouchableOpacity,
    SafeAreaView,
    StatusBar,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSearchStore } from '../store/useSearchStore';
import { usePlayerStore } from '../store/usePlayerStore';
import { useNavigation } from '@react-navigation/native';
import { SongItem } from '../components/SongItem';
import { AlbumItem } from '../components/AlbumItem';
import { ArtistItem } from '../components/ArtistItem';
import { RecentSearches } from '../components/RecentSearches';
import { COLORS, SPACING, FONT_SIZE } from '../constants/theme';
import { Song, Album, Artist } from '../types';

const TABS = ['Songs', 'Artists', 'Albums'];

export const SearchScreen = () => {
    const {
        query,
        results,
        isLoading,
        error,
        history,
        setQuery,
        search,
        clearResults,
        addToHistory,
        removeFromHistory,
        clearHistory
    } = useSearchStore();
    const [activeTab, setActiveTab] = useState('Songs');
    const navigation = useNavigation();
    const { playSong } = usePlayerStore();

    // Debounce search
    useEffect(() => {
        const timer = setTimeout(() => {
            if (query.trim()) {
                search(query, activeTab);
            }
        }, 500);

        return () => clearTimeout(timer);
    }, [query, activeTab, search]);

    const handleClear = () => {
        setQuery('');
        clearResults();
    };

    const renderItem = ({ item }: { item: any }) => {
        if (activeTab === 'Songs') {
            return <SongItem song={item as Song} onPress={(song) => playSong(song)} />;
        } else if (activeTab === 'Albums') {
            return (
                <AlbumItem
                    album={item as Album}
                    onPress={(album) => navigation.navigate('AlbumDetails' as never, { album } as never)}
                />
            );
        } else if (activeTab === 'Artists') {
            return (
                <ArtistItem
                    artist={item as Artist}
                    onPress={(artist) => navigation.navigate('ArtistDetails' as never, { artist } as never)}
                />
            );
        }
        return null;
    };

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="dark-content" backgroundColor={COLORS.background} />

            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
                    <Ionicons name="arrow-back" size={24} color={COLORS.text} />
                </TouchableOpacity>
                <View style={styles.searchContainer}>
                    <Ionicons name="search" size={20} color={COLORS.textSecondary} style={styles.searchIcon} />
                    <TextInput
                        style={styles.input}
                        placeholder={`Search ${activeTab.toLowerCase()}...`}
                        placeholderTextColor={COLORS.textSecondary}
                        value={query}
                        onChangeText={setQuery}
                        autoCapitalize="none"
                        autoCorrect={false}
                    />
                    {query.length > 0 && (
                        <TouchableOpacity onPress={handleClear}>
                            <Ionicons name="close-circle" size={20} color={COLORS.textSecondary} />
                        </TouchableOpacity>
                    )}
                </View>
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
                            style={[
                                styles.tab,
                                activeTab === item && styles.activeTab,
                            ]}
                            onPress={() => {
                                setActiveTab(item);
                                // Trigger search immediately if query exists
                                if (query.trim()) {
                                    clearResults(); // Clear old results first
                                    // The useEffect will trigger the search
                                }
                            }}
                        >
                            <Text
                                style={[
                                    styles.tabText,
                                    activeTab === item && styles.activeTabText,
                                ]}
                            >
                                {item}
                            </Text>
                        </TouchableOpacity>
                    )}
                />
            </View>

            {/* Content */}
            <View style={styles.content}>
                {isLoading ? (
                    <ActivityIndicator size="large" color={COLORS.primary} style={styles.loader} />
                ) : error ? (
                    <View style={styles.centerContainer}>
                        <Ionicons name="alert-circle-outline" size={48} color={COLORS.error} />
                        <Text style={styles.errorText}>{error}</Text>
                    </View>
                ) : query.length === 0 ? (
                    <RecentSearches
                        history={history}
                        onSelect={(term) => {
                            setQuery(term);
                            search(term, activeTab);
                        }}
                        onRemove={removeFromHistory}
                        onClear={clearHistory}
                    />
                ) : results.length > 0 ? (
                    <FlatList
                        data={results}
                        renderItem={renderItem}
                        keyExtractor={(item) => item.id}
                        contentContainerStyle={styles.listContent}
                        numColumns={activeTab === 'Albums' ? 2 : 1}
                        key={activeTab} // Force re-render when tab changes
                    />
                ) : (
                    <View style={styles.centerContainer}>
                        <Ionicons name="search-outline" size={64} color={COLORS.border} />
                        <Text style={styles.placeholderText}>No results found for "{query}"</Text>
                    </View>
                )}
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
        paddingHorizontal: SPACING.m,
        paddingVertical: SPACING.s,
    },
    backButton: {
        marginRight: SPACING.m,
    },
    searchContainer: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: COLORS.surface,
        borderRadius: 8,
        paddingHorizontal: SPACING.s,
        height: 40,
    },
    searchIcon: {
        marginRight: SPACING.s,
    },
    input: {
        flex: 1,
        fontSize: FONT_SIZE.m,
        color: COLORS.text,
        height: '100%',
    },
    tabsContainer: {
        paddingVertical: SPACING.s,
    },
    tabsContent: {
        paddingHorizontal: SPACING.m,
    },
    tab: {
        paddingHorizontal: SPACING.l,
        paddingVertical: SPACING.s,
        borderRadius: 20,
        marginRight: SPACING.s,
        borderWidth: 1,
        borderColor: COLORS.border,
    },
    activeTab: {
        backgroundColor: COLORS.primary,
        borderColor: COLORS.primary,
    },
    tabText: {
        fontSize: FONT_SIZE.m,
        color: COLORS.textSecondary,
        fontWeight: '500',
    },
    activeTabText: {
        color: '#FFFFFF',
    },
    content: {
        flex: 1,
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
        marginTop: SPACING.m,
        color: COLORS.error,
        fontSize: FONT_SIZE.m,
    },
    placeholderText: {
        marginTop: SPACING.m,
        color: COLORS.textSecondary,
        fontSize: FONT_SIZE.m,
    },
    listContent: {
        paddingBottom: SPACING.xl,
    },
});
