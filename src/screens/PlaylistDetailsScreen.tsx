import React from 'react';
import { View, Text, FlatList, StyleSheet, SafeAreaView, StatusBar, TouchableOpacity } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { SPACING, FONT_SIZE, LIGHT_COLORS, DARK_COLORS } from '../constants/theme';
import { usePlaylistStore } from '../store/usePlaylistStore';
import { usePlayerStore } from '../store/usePlayerStore';
import { SongItem } from '../components/SongItem';
import { UserPlaylist } from '../store/usePlaylistStore';
import { useThemeStore } from '../store/useThemeStore';

export const PlaylistDetailsScreen = () => {
    const route = useRoute();
    const navigation = useNavigation();
    const { playlistId } = route.params as { playlistId: string };
    const { playlists } = usePlaylistStore();
    const { playSongList } = usePlayerStore();
    const { isDarkMode } = useThemeStore();
    const colors = isDarkMode ? DARK_COLORS : LIGHT_COLORS;
    const styles = React.useMemo(() => createStyles(colors), [colors]);

    const playlist = playlists.find(p => p.id === playlistId);

    if (!playlist) {
        return (
            <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
                <View style={styles.centerContainer}>
                    <Text style={[styles.errorText, { color: colors.text }]}>Playlist not found</Text>
                    <TouchableOpacity onPress={() => navigation.goBack()} style={[styles.backButton, { backgroundColor: colors.primary }]}>
                        <Text style={styles.backButtonText}>Go Back</Text>
                    </TouchableOpacity>
                </View >
            </SafeAreaView >
        );
    }

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
            <StatusBar barStyle={isDarkMode ? "light-content" : "dark-content"} backgroundColor={colors.background} />

            <View style={[styles.header, { borderBottomColor: colors.border }]}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Ionicons name="arrow-back" size={24} color={colors.text} />
                </TouchableOpacity>
                <Text style={[styles.headerTitle, { color: colors.text }]} numberOfLines={1}>{playlist.name}</Text>
                <View style={{ width: 24 }} />
            </View>

            <View style={[styles.playlistInfo, { borderBottomColor: colors.border }]}>
                <View style={[styles.playlistIcon, { backgroundColor: colors.surface }]}>
                    <Ionicons name="musical-notes" size={40} color={colors.primary} />
                </View>
                <View style={styles.infoText}>
                    <Text style={[styles.playlistName, { color: colors.text }]}>{playlist.name}</Text>
                    <Text style={[styles.songCount, { color: colors.textSecondary }]}>{playlist.songs.length} songs</Text>
                </View>
            </View>

            <FlatList
                data={playlist.songs}
                renderItem={({ item, index }) => (
                    <SongItem
                        song={item}
                        onPress={() => playSongList(playlist.songs, index)}
                    />
                )}
                keyExtractor={(item) => item.id}
                contentContainerStyle={styles.listContent}
                ListEmptyComponent={
                    <View style={styles.centerContainer}>
                        <Text style={[styles.emptyText, { color: colors.textSecondary }]}>No songs in this playlist</Text>
                    </View>
                }
            />
        </SafeAreaView>
    );
};

const createStyles = (colors: typeof LIGHT_COLORS) => StyleSheet.create({
    container: {
        flex: 1,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: SPACING.m,
        borderBottomWidth: 1,
    },
    headerTitle: {
        fontSize: FONT_SIZE.l,
        fontWeight: '700',
        flex: 1,
        textAlign: 'center',
        marginHorizontal: SPACING.m,
    },
    playlistInfo: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: SPACING.l,
        borderBottomWidth: 1,
    },
    playlistIcon: {
        width: 80,
        height: 80,
        borderRadius: 8,
        justifyContent: 'center',
        alignItems: 'center',
    },
    infoText: {
        marginLeft: SPACING.m,
        flex: 1,
    },
    playlistName: {
        fontSize: FONT_SIZE.xl,
        fontWeight: '700',
        marginBottom: 4,
    },
    songCount: {
        fontSize: FONT_SIZE.m,
    },
    listContent: {
        paddingBottom: 100,
    },
    centerContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: SPACING.xl * 2,
    },
    errorText: {
        fontSize: FONT_SIZE.l,
        marginBottom: SPACING.m,
    },
    emptyText: {
        fontSize: FONT_SIZE.m,
    },
    backButton: {
        padding: SPACING.m,
        borderRadius: 8,
    },
    backButtonText: {
        color: '#FFFFFF',
        fontWeight: '600',
    },
});
