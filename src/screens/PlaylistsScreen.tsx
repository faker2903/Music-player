import React from 'react';
import { View, Text, FlatList, StyleSheet, SafeAreaView, StatusBar, TouchableOpacity, Alert, Modal, TextInput } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { usePlaylistStore } from '../store/usePlaylistStore';
import { useDownloadStore } from '../store/useDownloadStore';
import { SPACING, FONT_SIZE, LIGHT_COLORS, DARK_COLORS } from '../constants/theme';
import { Ionicons } from '@expo/vector-icons';
import { useThemeStore } from '../store/useThemeStore';

export const PlaylistsScreen = () => {
    const { playlists, createPlaylist, deletePlaylist } = usePlaylistStore();
    const { downloadedSongs } = useDownloadStore();
    const navigation = useNavigation();
    const { isDarkMode } = useThemeStore();
    const colors = isDarkMode ? DARK_COLORS : LIGHT_COLORS;
    const styles = React.useMemo(() => createStyles(colors), [colors]);
    const [isModalVisible, setIsModalVisible] = React.useState(false);
    const [newPlaylistName, setNewPlaylistName] = React.useState('');

    const handleCreatePlaylist = () => {
        setIsModalVisible(true);
    };

    const confirmCreatePlaylist = () => {
        if (newPlaylistName.trim()) {
            createPlaylist(newPlaylistName.trim());
            setNewPlaylistName('');
            setIsModalVisible(false);
        }
    };

    const handleDeletePlaylist = (id: string, name: string) => {
        Alert.alert(
            'Delete Playlist',
            `Are you sure you want to delete "${name}"?`,
            [
                {
                    text: 'Cancel',
                    style: 'cancel',
                },
                {
                    text: 'Delete',
                    onPress: () => deletePlaylist(id),
                    style: 'destructive',
                },
            ]
        );
    };

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
            <StatusBar barStyle={isDarkMode ? "light-content" : "dark-content"} backgroundColor={colors.background} />
            <View style={[styles.header, { borderBottomColor: colors.border }]}>
                <Text style={[styles.headerTitle, { color: colors.text }]}>Playlists</Text>
                <TouchableOpacity onPress={handleCreatePlaylist}>
                    <Ionicons name="add" size={28} color={colors.primary} />
                </TouchableOpacity>
            </View>
            <TouchableOpacity
                style={[styles.playlistItem, { borderBottomColor: colors.border }]}
                onPress={() => navigation.navigate('Downloads' as never)}
            >
                <View style={[styles.playlistIcon, { backgroundColor: colors.surface }]}>
                    <Ionicons name="cloud-download" size={30} color={colors.primary} />
                </View>
                <View style={styles.playlistInfo}>
                    <Text style={[styles.playlistName, { color: colors.text }]}>Downloads</Text>
                    <Text style={[styles.playlistCount, { color: colors.textSecondary }]}>
                        {downloadedSongs.length} songs
                    </Text>
                </View>
                <Ionicons name="chevron-forward" size={20} color={colors.textSecondary} />
            </TouchableOpacity>
            <FlatList
                data={playlists}
                renderItem={({ item }) => (
                    <TouchableOpacity
                        style={[styles.playlistItem, { borderBottomColor: colors.border }]}
                        onPress={() => (navigation as any).navigate('PlaylistDetails', { playlistId: item.id })}
                    >
                        <View style={[styles.playlistIcon, { backgroundColor: colors.surface }]}>
                            <Ionicons name="musical-notes" size={30} color={colors.primary} />
                        </View>
                        <View style={styles.playlistInfo}>
                            <Text style={[styles.playlistName, { color: colors.text }]}>{item.name}</Text>
                            <Text style={[styles.playlistCount, { color: colors.textSecondary }]}>{item.songs.length} songs</Text>
                        </View>
                        <TouchableOpacity
                            onPress={() => handleDeletePlaylist(item.id, item.name)}
                            style={styles.deleteButton}
                        >
                            <Ionicons name="trash-outline" size={20} color={colors.error || '#FF3B30'} />
                        </TouchableOpacity>
                        <Ionicons name="chevron-forward" size={20} color={colors.textSecondary} />
                    </TouchableOpacity>
                )}
                keyExtractor={(item) => item.id}
                contentContainerStyle={styles.listContent}
                ListEmptyComponent={
                    <TouchableOpacity style={styles.centerContainer} onPress={handleCreatePlaylist}>
                        <Ionicons name="musical-notes-outline" size={64} color={colors.textSecondary} />
                        <Text style={[styles.emptyText, { color: colors.text }]}>No playlists yet</Text>
                        <Text style={[styles.subText, { color: colors.textSecondary }]}>Create your first playlist</Text>
                    </TouchableOpacity>
                }
            />

            <Modal
                visible={isModalVisible}
                transparent
                animationType="fade"
                onRequestClose={() => setIsModalVisible(false)}
            >
                <View style={styles.modalOverlay}>
                    <View style={[styles.modalContent, { backgroundColor: colors.surface }]}>
                        <Text style={[styles.modalTitle, { color: colors.text }]}>New Playlist</Text>
                        <TextInput
                            style={[styles.input, { color: colors.text, borderColor: colors.border }]}
                            placeholder="Playlist name"
                            placeholderTextColor={colors.textSecondary}
                            value={newPlaylistName}
                            onChangeText={setNewPlaylistName}
                            autoFocus
                        />
                        <View style={styles.modalButtons}>
                            <TouchableOpacity
                                style={styles.modalButton}
                                onPress={() => {
                                    setIsModalVisible(false);
                                    setNewPlaylistName('');
                                }}
                            >
                                <Text style={{ color: colors.textSecondary }}>Cancel</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={[styles.modalButton, styles.createButton, { backgroundColor: colors.primary }]}
                                onPress={confirmCreatePlaylist}
                            >
                                <Text style={{ color: '#FFFFFF', fontWeight: 'bold' }}>Create</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>
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
        fontSize: FONT_SIZE.xl,
        fontWeight: '700',
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
    emptyText: {
        fontSize: FONT_SIZE.l,
        fontWeight: '600',
        marginTop: SPACING.m,
    },
    subText: {
        fontSize: FONT_SIZE.m,
        marginTop: SPACING.s,
    },
    playlistItem: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: SPACING.m,
        borderBottomWidth: 1,
    },
    playlistIcon: {
        width: 60,
        height: 60,
        borderRadius: 8,
        justifyContent: 'center',
        alignItems: 'center',
    },
    playlistInfo: {
        flex: 1,
        marginLeft: SPACING.m,
    },
    playlistName: {
        fontSize: FONT_SIZE.m,
        fontWeight: '700',
        marginBottom: 4,
    },
    playlistCount: {
        fontSize: FONT_SIZE.s,
    },
    deleteButton: {
        padding: SPACING.s,
        marginRight: SPACING.s,
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'center',
        alignItems: 'center',
        padding: SPACING.xl,
    },
    modalContent: {
        width: '100%',
        borderRadius: 16,
        padding: SPACING.xl,
        elevation: 5,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 4,
    },
    modalTitle: {
        fontSize: FONT_SIZE.l,
        fontWeight: 'bold',
        marginBottom: SPACING.m,
        textAlign: 'center',
    },
    input: {
        borderWidth: 1,
        borderRadius: 8,
        padding: SPACING.m,
        marginBottom: SPACING.l,
        fontSize: FONT_SIZE.m,
    },
    modalButtons: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
    },
    modalButton: {
        paddingVertical: SPACING.s,
        paddingHorizontal: SPACING.l,
        borderRadius: 8,
        marginLeft: SPACING.m,
    },
    createButton: {
        minWidth: 80,
        alignItems: 'center',
    },
});
