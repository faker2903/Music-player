import React from 'react';
import { View, Text, FlatList, StyleSheet, SafeAreaView, StatusBar, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { usePlaylistStore } from '../store/usePlaylistStore';
import { COLORS, SPACING, FONT_SIZE } from '../constants/theme';
import { Ionicons } from '@expo/vector-icons';

export const PlaylistsScreen = () => {
    const { playlists } = usePlaylistStore();
    const navigation = useNavigation();

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="dark-content" backgroundColor={COLORS.background} />
            <View style={styles.header}>
                <Text style={styles.headerTitle}>Playlists</Text>
                <TouchableOpacity>
                    <Ionicons name="add" size={28} color={COLORS.primary} />
                </TouchableOpacity>
            </View>
            <FlatList
                data={playlists}
                renderItem={({ item }) => (
                    <TouchableOpacity
                        style={styles.playlistItem}
                        onPress={() => navigation.navigate('PlaylistDetails' as never, { playlistId: item.id } as never)}
                    >
                        <View style={styles.playlistIcon}>
                            <Ionicons name="musical-notes" size={30} color={COLORS.primary} />
                        </View>
                        <View style={styles.playlistInfo}>
                            <Text style={styles.playlistName}>{item.name}</Text>
                            <Text style={styles.playlistCount}>{item.songs.length} songs</Text>
                        </View>
                        <Ionicons name="chevron-forward" size={20} color={COLORS.textSecondary} />
                    </TouchableOpacity>
                )}
                keyExtractor={(item) => item.id}
                contentContainerStyle={styles.listContent}
                ListEmptyComponent={
                    <View style={styles.centerContainer}>
                        <Ionicons name="musical-notes-outline" size={64} color={COLORS.textSecondary} />
                        <Text style={styles.emptyText}>No playlists yet</Text>
                        <Text style={styles.subText}>Create your first playlist</Text>
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
        fontSize: FONT_SIZE.xl,
        fontWeight: '700',
        color: COLORS.text,
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
        color: COLORS.text,
        marginTop: SPACING.m,
    },
    subText: {
        fontSize: FONT_SIZE.m,
        color: COLORS.textSecondary,
        marginTop: SPACING.s,
    },
    playlistItem: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: SPACING.m,
        borderBottomWidth: 1,
        borderBottomColor: COLORS.border,
    },
    playlistIcon: {
        width: 60,
        height: 60,
        borderRadius: 8,
        backgroundColor: COLORS.surface,
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
        color: COLORS.text,
        marginBottom: 4,
    },
    playlistCount: {
        fontSize: FONT_SIZE.s,
        color: COLORS.textSecondary,
    },
});
