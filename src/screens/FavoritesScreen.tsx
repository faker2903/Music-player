import React from 'react';
import { View, Text, FlatList, StyleSheet, SafeAreaView, StatusBar } from 'react-native';
import { useFavoritesStore } from '../store/useFavoritesStore';
import { SongItem } from '../components/SongItem';
import { COLORS, SPACING, FONT_SIZE } from '../constants/theme';
import { Ionicons } from '@expo/vector-icons';

export const FavoritesScreen = () => {
    const { favorites } = useFavoritesStore();

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="dark-content" backgroundColor={COLORS.background} />
            <View style={styles.header}>
                <Text style={styles.headerTitle}>Favorites</Text>
            </View>
            <FlatList
                data={favorites}
                renderItem={({ item }) => (
                    <SongItem
                        song={item}
                        onPress={() => { }} // Play logic handled inside SongItem for now, or pass handlePlay
                    />
                )}
                keyExtractor={(item) => item.id}
                contentContainerStyle={styles.listContent}
                ListEmptyComponent={
                    <View style={styles.centerContainer}>
                        <Ionicons name="heart-outline" size={64} color={COLORS.textSecondary} />
                        <Text style={styles.emptyText}>No favorites yet</Text>
                        <Text style={styles.subText}>Songs you like will appear here</Text>
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
});
