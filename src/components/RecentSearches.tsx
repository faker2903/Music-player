import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, FlatList } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SPACING, FONT_SIZE } from '../constants/theme';

interface RecentSearchesProps {
    history: string[];
    onSelect: (term: string) => void;
    onRemove: (term: string) => void;
    onClear: () => void;
}

export const RecentSearches: React.FC<RecentSearchesProps> = ({
    history,
    onSelect,
    onRemove,
    onClear,
}) => {
    if (history.length === 0) return null;

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.title}>Recent Searches</Text>
                <TouchableOpacity onPress={onClear}>
                    <Text style={styles.clearText}>Clear All</Text>
                </TouchableOpacity>
            </View>
            <FlatList
                data={history}
                keyExtractor={(item) => item}
                renderItem={({ item }) => (
                    <View style={styles.itemContainer}>
                        <TouchableOpacity style={styles.itemContent} onPress={() => onSelect(item)}>
                            <Text style={styles.itemText}>{item}</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => onRemove(item)} style={styles.removeButton}>
                            <Ionicons name="close" size={20} color={COLORS.textSecondary} />
                        </TouchableOpacity>
                    </View>
                )}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingHorizontal: SPACING.m,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: SPACING.m,
        marginTop: SPACING.m,
    },
    title: {
        fontSize: FONT_SIZE.l,
        fontWeight: '700',
        color: COLORS.text,
    },
    clearText: {
        fontSize: FONT_SIZE.m,
        color: COLORS.primary,
        fontWeight: '600',
    },
    itemContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: SPACING.s,
    },
    itemContent: {
        flex: 1,
    },
    itemText: {
        fontSize: FONT_SIZE.m,
        color: COLORS.textSecondary,
    },
    removeButton: {
        padding: SPACING.xs,
    },
});
