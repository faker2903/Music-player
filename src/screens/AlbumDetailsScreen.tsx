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
    ScrollView,
} from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SPACING, FONT_SIZE, LIGHT_COLORS, DARK_COLORS } from '../constants/theme';
import { Album, Song } from '../types';
import { getAlbum } from '../api/api';
import { SongItem } from '../components/SongItem';
import { usePlayerStore } from '../store/usePlayerStore';
import { useThemeStore } from '../store/useThemeStore';

export const AlbumDetailsScreen = () => {
    const route = useRoute();
    const navigation = useNavigation();
    const { album } = route.params as { album: Album };
    const [details, setDetails] = useState<Album | null>(null);
    const [loading, setLoading] = useState(true);
    const { playSongList } = usePlayerStore();
    const { isDarkMode } = useThemeStore();
    const colors = isDarkMode ? DARK_COLORS : LIGHT_COLORS;
    const styles = React.useMemo(() => createStyles(colors), [colors]);

    useEffect(() => {
        const fetchDetails = async () => {
            try {
                const data = await getAlbum(album.id);
                if (data.data) {
                    // @ts-ignore
                    setDetails(Array.isArray(data.data) ? data.data[0] : data.data);
                }
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        };

        fetchDetails();
    }, [album.id]);

    const currentAlbum = details || album;
    const imageUrl = currentAlbum.image?.find((img) => img.quality === '500x500')?.link || currentAlbum.image?.[0]?.link || 'https://www.jiosaavn.com/img/c_icon.png';

    const renderHeader = () => (
        <View style={styles.headerContent}>
            <Image source={{ uri: imageUrl }} style={styles.albumArt} />
            <Text style={[styles.title, { color: colors.text }]} numberOfLines={2}>{currentAlbum.name}</Text>
            <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
                Album | {currentAlbum.songCount || 0} Songs | {currentAlbum.year || ''}
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
        </View>
    );

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
            <StatusBar barStyle={isDarkMode ? "light-content" : "dark-content"} backgroundColor={colors.background} />

            {/* Navbar */}
            <View style={styles.navbar}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Ionicons name="arrow-back" size={24} color={colors.text} />
                </TouchableOpacity>
                <View style={styles.navActions}>
                    <TouchableOpacity style={styles.navIcon}>
                        <Ionicons name="search" size={24} color={colors.text} />
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.navIcon}>
                        <Ionicons name="ellipsis-horizontal-circle" size={24} color={colors.text} />
                    </TouchableOpacity>
                </View>
            </View>

            {loading ? (
                <View style={styles.loader}>
                    <ActivityIndicator size="large" color={colors.primary} />
                </View>
            ) : (
                <FlatList
                    data={currentAlbum.songs}
                    renderItem={({ item, index }) => (
                        <SongItem
                            song={item}
                            onPress={() => playSongList(currentAlbum.songs || [], index)}
                        />
                    )}
                    keyExtractor={(item, index) => `${item.id}-${index}`}
                    ListHeaderComponent={renderHeader}
                    contentContainerStyle={styles.listContent}
                />
            )}
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
    albumArt: {
        width: 200,
        height: 200,
        borderRadius: 24,
        marginBottom: SPACING.m,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 10,
        },
        shadowOpacity: 0.3,
        shadowRadius: 20,
        elevation: 10,
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
        backgroundColor: colors.surface,
    },
    songInfo: {
        flex: 1,
        marginLeft: SPACING.m,
    },
    songTitle: {
        fontSize: FONT_SIZE.m,
        fontWeight: '600',
        color: colors.text,
        marginBottom: 2,
    },
    songArtist: {
        fontSize: FONT_SIZE.s,
        color: colors.textSecondary,
    },
    iconButton: {
        padding: SPACING.s,
    },
    loader: {
        marginTop: SPACING.xl,
        alignItems: 'center',
    },
});
