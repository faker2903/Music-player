import React, { useState } from 'react';
import { View, Text, Modal, StyleSheet, TouchableOpacity, TouchableWithoutFeedback, TextInput, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SPACING, FONT_SIZE } from '../constants/theme';
import { Song } from '../types';
import { useFavoritesStore } from '../store/useFavoritesStore';
import { usePlaylistStore } from '../store/usePlaylistStore';
import { useThemeStore } from '../store/useThemeStore';
import { LIGHT_COLORS, DARK_COLORS } from '../constants/theme';

interface SongOptionsModalProps {
    visible: boolean;
    onClose: () => void;
    song: Song | null;
}

export const SongOptionsModal = ({ visible, onClose, song }: SongOptionsModalProps) => {
    const { isFavorite, toggleFavorite } = useFavoritesStore();
    const { playlists, createPlaylist, addToPlaylist, removeFromPlaylist } = usePlaylistStore();
    const { isDarkMode } = useThemeStore();
    const colors = isDarkMode ? DARK_COLORS : LIGHT_COLORS;
    const [showPlaylists, setShowPlaylists] = useState(false);
    const [newPlaylistName, setNewPlaylistName] = useState('');
    const [showCreatePlaylist, setShowCreatePlaylist] = useState(false);

    if (!song) return null;

    const isFav = isFavorite(song.id);

    const handleToggleFavorite = () => {
        toggleFavorite(song);
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
                        <View style={styles.content}>
                            <View style={styles.header}>
                                <Image source={{ uri: song.image?.[2]?.link || song.image?.[0]?.link }} style={styles.artwork} />
                                <View style={styles.headerText}>
                                    <Text style={styles.title} numberOfLines={1}>{song.name}</Text>
                                    <Text style={styles.artist} numberOfLines={1}>{song.primaryArtists}</Text>
                                </View>
                            </View>

                            {!showPlaylists ? (
                                <>
                                    <TouchableOpacity style={styles.option} onPress={handleToggleFavorite}>
                                        <Ionicons
                                            name={isFav ? "heart" : "heart-outline"}
                                            size={24}
                                            color={isFav ? COLORS.primary : COLORS.text}
                                        />
                                        <Text style={[styles.optionText, isFav && styles.activeText]}>
                                            {isFav ? 'Remove from Favorites' : 'Add to Favorites'}
                                        </Text>
                                    </TouchableOpacity>

                                    <TouchableOpacity style={styles.option} onPress={() => setShowPlaylists(true)}>
                                        <Ionicons name="list" size={24} color={colors.text} />
                                        <Text style={[styles.optionText, { color: colors.text }]}>Add to Playlist</Text>
                                    </TouchableOpacity>

                                    <TouchableOpacity
                                        style={styles.option}
                                        onPress={() => {
                                            // This is a bit tricky without knowing the current playlist context.
                                            // For now, we'll show a way to remove it if it's in any playlist.
                                            // Or better, we can just show this option if we are in PlaylistDetailsScreen.
                                            // But for a global modal, let's just add it as an option.
                                            setShowPlaylists(true); // Re-using playlist selection to choose which one to remove from
                                        }}
                                    >
                                        <Ionicons name="remove-circle-outline" size={24} color={colors.error} />
                                        <Text style={[styles.optionText, { color: colors.error }]}>Remove from Playlist</Text>
                                    </TouchableOpacity>
                                </>
                            ) : (
                                <View style={styles.playlistContainer}>
                                    <View style={styles.playlistHeader}>
                                        <TouchableOpacity onPress={() => setShowPlaylists(false)}>
                                            <Ionicons name="arrow-back" size={24} color={COLORS.text} />
                                        </TouchableOpacity>
                                        <Text style={styles.playlistTitle}>Select Playlist</Text>
                                        <TouchableOpacity onPress={() => setShowCreatePlaylist(true)}>
                                            <Ionicons name="add" size={24} color={COLORS.primary} />
                                        </TouchableOpacity>
                                    </View>

                                    {showCreatePlaylist && (
                                        <View style={styles.createContainer}>
                                            <TextInput
                                                style={styles.input}
                                                placeholder="Playlist Name"
                                                placeholderTextColor={COLORS.textSecondary}
                                                value={newPlaylistName}
                                                onChangeText={setNewPlaylistName}
                                                autoFocus
                                            />
                                            <TouchableOpacity onPress={handleCreatePlaylist}>
                                                <Text style={styles.createText}>Create</Text>
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
                                                    }}
                                                >
                                                    <Ionicons
                                                        name={isInPlaylist ? "remove-circle" : "add-circle"}
                                                        size={20}
                                                        color={isInPlaylist ? colors.error : colors.primary}
                                                    />
                                                    <Text style={[styles.playlistName, { color: colors.text }]}>{playlist.name}</Text>
                                                    <Text style={[styles.songCount, { color: colors.textSecondary }]}>
                                                        {isInPlaylist ? 'Remove' : 'Add'}
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

import { Image } from 'react-native';

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'flex-end',
    },
    content: {
        backgroundColor: COLORS.surface,
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
        borderBottomColor: COLORS.border,
        paddingBottom: SPACING.m,
    },
    artwork: {
        width: 50,
        height: 50,
        borderRadius: 8,
        backgroundColor: COLORS.background,
    },
    headerText: {
        marginLeft: SPACING.m,
        flex: 1,
    },
    title: {
        fontSize: FONT_SIZE.m,
        fontWeight: '700',
        color: COLORS.text,
        marginBottom: 4,
    },
    artist: {
        fontSize: FONT_SIZE.s,
        color: COLORS.textSecondary,
    },
    option: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: SPACING.m,
    },
    optionText: {
        fontSize: FONT_SIZE.m,
        color: COLORS.text,
        marginLeft: SPACING.m,
        fontWeight: '500',
    },
    activeText: {
        color: COLORS.primary,
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
        color: COLORS.text,
    },
    createContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: SPACING.m,
        backgroundColor: COLORS.background,
        borderRadius: 8,
        paddingHorizontal: SPACING.s,
    },
    input: {
        flex: 1,
        paddingVertical: SPACING.s,
        color: COLORS.text,
        fontSize: FONT_SIZE.m,
    },
    createText: {
        color: COLORS.primary,
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
        color: COLORS.text,
        marginLeft: SPACING.s,
    },
    songCount: {
        fontSize: FONT_SIZE.s,
        color: COLORS.textSecondary,
    },
});
