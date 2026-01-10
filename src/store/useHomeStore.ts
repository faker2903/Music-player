import { create } from 'zustand';
import { searchSongs, searchAlbums, searchArtists } from '../api/api';
import { Song, Album, Artist } from '../types';

interface HomeState {
    songs: Song[];
    albums: Album[];
    artists: Artist[];
    recentlyPlayed: Artist[];
    mostPlayed: Artist[];
    recentlyPlayedSongs: Song[];
    mostPlayedSongs: Song[];
    totalSongs: number;
    totalAlbums: number;
    totalArtists: number;
    isLoading: boolean;
    error: string | null;
    fetchHomeSongs: () => Promise<void>;
    fetchHomeAlbums: () => Promise<void>;
    fetchHomeArtists: () => Promise<void>;
}

export const useHomeStore = create<HomeState>((set) => ({
    songs: [],
    albums: [],
    artists: [],
    recentlyPlayed: [],
    mostPlayed: [],
    recentlyPlayedSongs: [],
    mostPlayedSongs: [],
    totalSongs: 0,
    totalAlbums: 0,
    totalArtists: 0,
    isLoading: false,
    error: null,
    fetchHomeSongs: async () => {
        set({ isLoading: true, error: null });
        try {
            // Fetch songs from a popular artist (e.g., Arijit Singh) to ensure we have data
            const response = await searchSongs('Arijit Singh?sort=popularity');

            let songs: Song[] = [];
            if (response.data && response.data.results) {
                songs = response.data.results;
            } else if (response.data && Array.isArray(response.data)) {
                songs = response.data;
            } else if (response.success && response.data) {
                songs = response.data.results || response.data;
            }

            // Helper to shuffle array
            const shuffle = <T>(array: T[]): T[] => {
                return array.map(value => ({ value, sort: Math.random() }))
                    .sort((a, b) => a.sort - b.sort)
                    .map(({ value }) => value);
            };

            const shuffledSongs = shuffle(songs);
            set({
                songs: shuffledSongs,
                recentlyPlayedSongs: shuffledSongs.slice(0, 10), // Simulate recently played songs
                mostPlayedSongs: shuffledSongs.slice(5, 15), // Simulate most played songs
                totalSongs: response.data?.total || 0,
                isLoading: false
            });
        } catch (error) {
            set({ error: 'Failed to fetch songs', isLoading: false });
        }
    },
    fetchHomeAlbums: async () => {
        set({ isLoading: true, error: null });
        try {
            const response = await searchAlbums('trending');
            if (response.success || response.data) {
                set({
                    albums: response.data.results,
                    totalAlbums: response.data.total || 0,
                    isLoading: false
                });
            } else {
                set({ error: 'Failed to fetch albums', isLoading: false });
            }
        } catch (error) {
            set({ error: 'An error occurred', isLoading: false });
        }
    },
    fetchHomeArtists: async () => {
        set({ isLoading: true, error: null });
        try {
            const response = await searchArtists('artist');
            if (response.success || response.data) {
                const allArtists = response.data.results;
                set({
                    artists: allArtists,
                    totalArtists: response.data.total || 0,
                    isLoading: false
                });
            } else {
                set({ error: 'Failed to fetch artists', isLoading: false });
            }
        } catch (error) {
            set({ error: 'An error occurred', isLoading: false });
        }
    },
}));
