import React from 'react';
import { View, Text, FlatList, StyleSheet, SafeAreaView, StatusBar, TouchableOpacity } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SPACING, FONT_SIZE } from '../constants/theme';
import { usePlaylistStore } from '../store/usePlaylistStore';
import { usePlayerStore } from '../store/usePlayerStore';
import { SongItem } from '../components/SongItem';
import { UserPlaylist } from '../store/usePlaylistStore';

export const PlaylistDetailsScreen = () => {
    const route = useRoute();
    const navigation = useNavigation();
    const { playlistId } = route.params as { playlistId: string };
    const { playlists } = usePlaylistStore();
    const { playSongList } = usePlayerStore();

    const playlist = playlists.find(p => p.id === playlistId);

    if (!playlist) {
        return (
            <SafeAreaView style={styles.container}>
                <View style={styles.centerContainer}>
                    <Text style={styles.errorText}>Playlist not found</Text>
                    <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                        <Text style={styles.backButtonText}>Go Back</Text>
                    </TouchableOpacity>
                </View >
            </SafeAreaView >
        );
    }

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="dark-content" backgroundColor={COLORS.background} />

            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Ionicons name="arrow-back" size={24} color={COLORS.text} />
                </TouchableOpacity>
                <Text style={styles.headerTitle} numberOfLines={1}>{playlist.name}</Text>
                <View style={{ width: 24 }} />
            </View>

            <View style={styles.playlistInfo}>
                <View style={styles.playlistIcon}>
                    <Ionicons name="musical-notes" size={40} color={COLORS.primary} />
                </View>
                <View style={styles.infoText}>
                    <Text style={styles.playlistName}>{playlist.name}</Text>
                    <Text style={styles.songCount}>{playlist.songs.length} songs</Text>
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
                        <Text style={styles.emptyText}>No songs in this playlist</Text>
                    </View>
                }
            />
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
        padding: SPACING.m,
        borderBottomWidth: 1,
        borderBottomColor: COLORS.border,
    },
    headerTitle: {
        fontSize: FONT_SIZE.l,
        fontWeight: '700',
        color: COLORS.text,
        flex: 1,
        textAlign: 'center',
        marginHorizontal: SPACING.m,
    },
    playlistInfo: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: SPACING.l,
        borderBottomWidth: 1,
        borderBottomColor: COLORS.border,
    },
    playlistIcon: {
        width: 80,
        height: 80,
        borderRadius: 8,
        backgroundColor: COLORS.surface,
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
        color: COLORS.text,
        marginBottom: 4,
    },
    songCount: {
        fontSize: FONT_SIZE.m,
        color: COLORS.textSecondary,
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
        color: COLORS.text,
        marginBottom: SPACING.m,
    },
    emptyText: {
        fontSize: FONT_SIZE.m,
        color: COLORS.textSecondary,
    },
    backButton: {
        padding: SPACING.m,
        backgroundColor: COLORS.primary,
        borderRadius: 8,
    },
    backButtonText: {
        color: '#FFFFFF',
        fontWeight: '600',
    },
});
