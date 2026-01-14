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
import { SPACING, FONT_SIZE, LIGHT_COLORS, DARK_COLORS } from '../constants/theme';
import { Song, Album, Artist } from '../types';
import { useThemeStore } from '../store/useThemeStore';

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
    const { isDarkMode } = useThemeStore();
    const colors = isDarkMode ? DARK_COLORS : LIGHT_COLORS;
    const styles = React.useMemo(() => createStyles(colors), [colors]);

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
        <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
            <StatusBar barStyle={isDarkMode ? "light-content" : "dark-content"} backgroundColor={colors.background} />

            <View style={styles.header}>
                <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
                    <Ionicons name="arrow-back" size={24} color={colors.text} />
                </TouchableOpacity>
                <View style={[styles.searchContainer, { backgroundColor: colors.surface }]}>
                    <Ionicons name="search" size={20} color={colors.textSecondary} style={styles.searchIcon} />
                    <TextInput
                        style={[styles.input, { color: colors.text }]}
                        placeholder={`Search ${activeTab.toLowerCase()}...`}
                        placeholderTextColor={colors.textSecondary}
                        value={query}
                        onChangeText={setQuery}
                        autoCapitalize="none"
                        autoCorrect={false}
                    />
                    {query !== '' && (
                        <TouchableOpacity onPress={handleClear} style={styles.clearButton}>
                            <Ionicons name="close-circle" size={20} color={colors.textSecondary} />
                        </TouchableOpacity>
                    )}
                </View>
            </View>

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
                                { borderColor: colors.border },
                                activeTab === item && [styles.activeTab, { backgroundColor: colors.primary, borderColor: colors.primary }],
                            ]}
                            onPress={() => {
                                setActiveTab(item);
                                if (query.trim()) {
                                    clearResults();
                                }
                            }}
                        >
                            <Text
                                style={[
                                    styles.tabText,
                                    { color: colors.textSecondary },
                                    activeTab === item && styles.activeTabText,
                                ]}
                            >
                                {item}
                            </Text>
                        </TouchableOpacity>
                    )}
                />
            </View>

            <View style={styles.content}>
                {isLoading ? (
                    <ActivityIndicator size="large" color={colors.primary} style={styles.loader} />
                ) : error ? (
                    <View style={styles.centerContainer}>
                        <Ionicons name="alert-circle-outline" size={48} color={colors.error} />
                        <Text style={[styles.errorText, { color: colors.error }]}>{error}</Text>
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
                        key={activeTab}
                    />
                ) : (
                    <View style={styles.centerContainer}>
                        <Ionicons name="search-outline" size={64} color={colors.border} />
                        <Text style={[styles.placeholderText, { color: colors.textSecondary }]}>No results found for "{query}"</Text>
                    </View>
                )}
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
        height: '100%',
    },
    clearButton: {
        padding: 4,
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
    },
    activeTab: {
    },
    tabText: {
        fontSize: FONT_SIZE.m,
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
        fontSize: FONT_SIZE.m,
    },
    placeholderText: {
        marginTop: SPACING.m,
        fontSize: FONT_SIZE.m,
    },
    listContent: {
        paddingBottom: SPACING.xl,
    },
});
