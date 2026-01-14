import React from 'react';
import { View, Text, FlatList, StyleSheet, SafeAreaView, StatusBar, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useDownloadStore } from '../store/useDownloadStore';
import { usePlayerStore } from '../store/usePlayerStore';
import { SongItem } from '../components/SongItem';
import { SPACING, FONT_SIZE, LIGHT_COLORS, DARK_COLORS } from '../constants/theme';
import { Ionicons } from '@expo/vector-icons';
import { useThemeStore } from '../store/useThemeStore';

export const DownloadsScreen = () => {
    const { downloadedSongs } = useDownloadStore();
    const { playSongList } = usePlayerStore();
    const navigation = useNavigation();
    const { isDarkMode } = useThemeStore();
    const colors = isDarkMode ? DARK_COLORS : LIGHT_COLORS;
    const styles = React.useMemo(() => createStyles(colors), [colors]);

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
            <StatusBar barStyle={isDarkMode ? "light-content" : "dark-content"} backgroundColor={colors.background} />
            <View style={[styles.header, { borderBottomColor: colors.border }]}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                    <Ionicons name="arrow-back" size={24} color={colors.text} />
                </TouchableOpacity>
                <Text style={[styles.headerTitle, { color: colors.text }]}>Downloads</Text>
            </View>
            <FlatList
                data={downloadedSongs}
                renderItem={({ item, index }) => (
                    <SongItem
                        song={item}
                        onPress={() => playSongList(downloadedSongs, index)}
                    />
                )}
                keyExtractor={(item) => item.id}
                contentContainerStyle={styles.listContent}
                ListEmptyComponent={
                    <View style={styles.centerContainer}>
                        <Ionicons name="cloud-download-outline" size={64} color={colors.textSecondary} />
                        <Text style={[styles.emptyText, { color: colors.text }]}>No downloads yet</Text>
                        <Text style={[styles.subText, { color: colors.textSecondary }]}>Songs you download will appear here</Text>
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
        alignItems: 'center',
        padding: SPACING.m,
        borderBottomWidth: 1,
    },
    backButton: {
        marginRight: SPACING.m,
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
});
