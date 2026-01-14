import React, { useState } from 'react';
import { View, Text, Modal, StyleSheet, TouchableOpacity, TouchableWithoutFeedback, TextInput, ScrollView, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SPACING, FONT_SIZE, LIGHT_COLORS, DARK_COLORS } from '../constants/theme';
import { Song } from '../types';
import { useFavoritesStore } from '../store/useFavoritesStore';
import { usePlaylistStore } from '../store/usePlaylistStore';
import { useThemeStore } from '../store/useThemeStore';
import { useDownloadStore } from '../store/useDownloadStore';
import { getArtistName } from '../utils/songUtils';

interface SongOptionsModalProps {
    visible: boolean;
    onClose: () => void;
    song: Song | null;
}

export const SongOptionsModal = ({ visible, onClose, song }: SongOptionsModalProps) => {
    const { isFavorite, toggleFavorite } = useFavoritesStore();
    const { playlists, createPlaylist, addToPlaylist, removeFromPlaylist } = usePlaylistStore();
    const { isDarkMode } = useThemeStore();
    const { downloadSong, isDownloaded, removeDownload, downloadingIds } = useDownloadStore();
    const colors = isDarkMode ? DARK_COLORS : LIGHT_COLORS;
    const styles = React.useMemo(() => createStyles(colors), [colors]);
    const [showPlaylists, setShowPlaylists] = useState(false);
    const [newPlaylistName, setNewPlaylistName] = useState('');
    const [showCreatePlaylist, setShowCreatePlaylist] = useState(false);

    if (!song) return null;

    const isFav = isFavorite(song.id);

    const handleToggleFavorite = () => {
        toggleFavorite(song);
        onClose();
    };

    const handleDownload = async () => {
        if (isDownloaded(song.id)) {
            await removeDownload(song.id);
        } else {
            await downloadSong(song);
        }
        onClose();
    };

    const handleAddToPlaylist = (playlistId: string) => {
        addToPlaylist(playlistId, song);
        onClose();
        setShowPlaylists(false);
    };

    const handleCreatePlaylist = () => {
        if (newPlaylistName.trim()) {
            createPlaylist(newPlaylistName.trim());
            setNewPlaylistName('');
            setShowCreatePlaylist(false);
        }
    };

    return (
        <Modal
            visible={visible}
            transparent
            animationType="fade"
            onRequestClose={onClose}
        >
            <TouchableWithoutFeedback onPress={onClose}>
                <View style={styles.overlay}>
                    <TouchableWithoutFeedback>
                        <View style={[styles.content, { backgroundColor: colors.surface }]}>
                            <View style={[styles.header, { borderBottomColor: colors.border }]}>
                                <Image source={{ uri: song.image?.[2]?.link || song.image?.[0]?.link }} style={styles.artwork} />
                                <View style={styles.headerText}>
                                    <Text style={[styles.title, { color: colors.text }]} numberOfLines={1}>{song.name}</Text>
                                    <Text style={[styles.artist, { color: colors.textSecondary }]} numberOfLines={1}>{getArtistName(song)}</Text>
                                </View>
                            </View>

                            {!showPlaylists ? (
                                <>
                                    <TouchableOpacity style={styles.option} onPress={handleToggleFavorite}>
                                        <Ionicons
                                            name={isFav ? "heart" : "heart-outline"}
                                            size={24}
                                            color={isFav ? colors.primary : colors.text}
                                        />
                                        <Text style={[styles.optionText, { color: isFav ? colors.primary : colors.text }]}>
                                            {isFav ? 'Remove from Favorites' : 'Add to Favorites'}
                                        </Text>
                                    </TouchableOpacity>

                                    <TouchableOpacity style={styles.option} onPress={() => setShowPlaylists(true)}>
                                        <Ionicons name="list" size={24} color={colors.text} />
                                        <Text style={[styles.optionText, { color: colors.text }]}>Add to Playlist</Text>
                                    </TouchableOpacity>

                                    <TouchableOpacity
                                        style={styles.option}
                                        onPress={handleDownload}
                                        disabled={downloadingIds.has(song.id)}
                                    >
                                        <Ionicons
                                            name={downloadingIds.has(song.id) ? "sync" : isDownloaded(song.id) ? "cloud-done" : "cloud-download-outline"}
                                            size={24}
                                            color={isDownloaded(song.id) ? colors.primary : colors.text}
                                        />
                                        <Text style={[styles.optionText, { color: isDownloaded(song.id) ? colors.primary : colors.text }]}>
                                            {downloadingIds.has(song.id) ? 'Downloading...' : isDownloaded(song.id) ? 'Downloaded' : 'Download Offline'}
                                        </Text>
                                    </TouchableOpacity>
                                </>
                            ) : (
                                <View style={styles.playlistContainer}>
                                    <View style={styles.playlistHeader}>
                                        <TouchableOpacity onPress={() => setShowPlaylists(false)}>
                                            <Ionicons name="arrow-back" size={24} color={colors.text} />
                                        </TouchableOpacity>
                                        <Text style={[styles.playlistTitle, { color: colors.text }]}>Select Playlist</Text>
                                        <TouchableOpacity onPress={() => setShowCreatePlaylist(true)}>
                                            <Ionicons name="add" size={24} color={colors.primary} />
                                        </TouchableOpacity>
                                    </View>

                                    {showCreatePlaylist && (
                                        <View style={[styles.createContainer, { backgroundColor: colors.background }]}>
                                            <TextInput
                                                style={[styles.input, { color: colors.text }]}
                                                placeholder="Playlist Name"
                                                placeholderTextColor={colors.textSecondary}
                                                value={newPlaylistName}
                                                onChangeText={setNewPlaylistName}
                                                autoFocus
                                            />
                                            <TouchableOpacity onPress={handleCreatePlaylist}>
                                                <Text style={[styles.createText, { color: colors.primary }]}>Create</Text>
                                            </TouchableOpacity>
                                        </View>
                                    )}

                                    <ScrollView style={styles.playlistList}>
                                        {playlists.map(playlist => {
                                            const isInPlaylist = playlist.songs.some(s => s.id === song.id);
                                            return (
                                                <TouchableOpacity
                                                    key={playlist.id}
                                                    style={styles.playlistItem}
                                                    onPress={() => {
                                                        if (isInPlaylist) {
                                                            removeFromPlaylist(playlist.id, song.id);
                                                        } else {
                                                            handleAddToPlaylist(playlist.id);
                                                        }
                                                        onClose();
                                                        setShowPlaylists(false);
                                                    }}
                                                >
                                                    <Ionicons
                                                        name={isInPlaylist ? "checkmark-circle" : "add-circle-outline"}
                                                        size={20}
                                                        color={isInPlaylist ? colors.primary : colors.text}
                                                    />
                                                    <Text style={[styles.playlistName, { color: colors.text }]}>{playlist.name}</Text>
                                                    <Text style={[styles.songCount, { color: colors.textSecondary }]}>
                                                        {isInPlaylist ? 'Added' : `${playlist.songs.length} songs`}
                                                    </Text>
                                                </TouchableOpacity>
                                            );
                                        })}
                                    </ScrollView>
                                </View>
                            )}
                        </View>
                    </TouchableWithoutFeedback>
                </View>
            </TouchableWithoutFeedback>
        </Modal>
    );
};

const createStyles = (colors: typeof LIGHT_COLORS) => StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'flex-end',
    },
    content: {
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        padding: SPACING.m,
        maxHeight: '80%',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: SPACING.l,
        borderBottomWidth: 1,
        paddingBottom: SPACING.m,
    },
    artwork: {
        width: 50,
        height: 50,
        borderRadius: 8,
    },
    headerText: {
        marginLeft: SPACING.m,
        flex: 1,
    },
    title: {
        fontSize: FONT_SIZE.m,
        fontWeight: '700',
        marginBottom: 4,
    },
    artist: {
        fontSize: FONT_SIZE.s,
    },
    option: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: SPACING.m,
    },
    optionText: {
        fontSize: FONT_SIZE.m,
        marginLeft: SPACING.m,
        fontWeight: '500',
    },
    playlistContainer: {
        height: 300,
    },
    playlistHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: SPACING.m,
    },
    playlistTitle: {
        fontSize: FONT_SIZE.l,
        fontWeight: '700',
    },
    createContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: SPACING.m,
        borderRadius: 8,
        paddingHorizontal: SPACING.s,
    },
    input: {
        flex: 1,
        paddingVertical: SPACING.s,
        fontSize: FONT_SIZE.m,
    },
    createText: {
        fontWeight: '600',
        padding: SPACING.s,
    },
    playlistList: {
        flex: 1,
    },
    playlistItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: SPACING.s,
    },
    playlistName: {
        flex: 1,
        fontSize: FONT_SIZE.m,
        marginLeft: SPACING.s,
    },
    songCount: {
        fontSize: FONT_SIZE.s,
    },
});
