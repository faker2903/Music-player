import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import { Album } from '../types';
import { COLORS, SPACING, FONT_SIZE } from '../constants/theme';
import { Ionicons } from '@expo/vector-icons';

interface AlbumItemProps {
    album: Album;
    onPress: (album: Album) => void;
}

const { width } = Dimensions.get('window');
const ITEM_WIDTH = (width - SPACING.m * 3) / 2;

export const AlbumItem: React.FC<AlbumItemProps> = ({ album, onPress }) => {
    const imageUrl = album.image?.find((img) => img.quality === '500x500')?.link ||
        album.image?.find((img) => img.quality === '500x500')?.url ||
        album.image?.[0]?.link ||
        album.image?.[0]?.url ||
        'https://www.jiosaavn.com/img/c_icon.png';

    return (
        <TouchableOpacity style={styles.container} onPress={() => onPress(album)}>
            <Image source={{ uri: imageUrl }} style={styles.image} />
            <View style={styles.infoContainer}>
                <Text style={styles.title} numberOfLines={1}>
                    {album.name}
                </Text>
                <Text style={styles.subtitle} numberOfLines={1}>
                    {album.primaryArtists} | {album.year}
                </Text>
                <Text style={styles.songCount} numberOfLines={1}>
                    {album.songCount ? `${album.songCount} songs` : ''}
                </Text>
            </View>
            <TouchableOpacity style={styles.moreButton}>
                <Ionicons name="ellipsis-vertical" size={20} color={COLORS.textSecondary} />
            </TouchableOpacity>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    container: {
        width: ITEM_WIDTH,
        marginBottom: SPACING.m,
        marginRight: SPACING.m,
    },
    image: {
        width: ITEM_WIDTH,
        height: ITEM_WIDTH,
        borderRadius: 16,
        backgroundColor: COLORS.surface,
        marginBottom: SPACING.s,
    },
    infoContainer: {
        flex: 1,
    },
    title: {
        fontSize: FONT_SIZE.m,
        fontWeight: '700',
        color: COLORS.text,
        marginBottom: 2,
    },
    subtitle: {
        fontSize: FONT_SIZE.s,
        color: COLORS.textSecondary,
        marginBottom: 2,
    },
    songCount: {
        fontSize: FONT_SIZE.s,
        color: COLORS.textSecondary,
    },
    moreButton: {
        position: 'absolute',
        bottom: 0,
        right: 0,
        padding: SPACING.xs,
    },
});
