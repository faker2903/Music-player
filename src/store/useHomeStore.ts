import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
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
    addRecentlyPlayedSong: (song: Song) => void;
}

export const useHomeStore = create<HomeState>()(
    persist(
        (set, get) => ({
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
                    const searchTerms = [
                        'Top Songs', 'Latest Hits', 'Trending', 'New Releases',
                        'Pop Hits', 'Rock Classics', 'Hip Hop 2024', 'Romantic Melodies',
                        'Party Anthems', 'Arijit Singh', 'Justin Bieber', 'Taylor Swift',
                        'Drake', 'Ed Sheeran', 'Bollywood', 'Punjabi Hits'
                    ];
                    const randomTerm = searchTerms[Math.floor(Math.random() * searchTerms.length)];

                    const response = await searchSongs(randomTerm);

                    let songs: Song[] = [];
                    let total = 0;

                    if (response.data) {
                        songs = response.data.results || (Array.isArray(response.data) ? response.data : []);
                        total = response.data.total || songs.length;
                    } else if (Array.isArray(response)) {
                        songs = response;
                        total = songs.length;
                    }

                    // Helper to shuffle array
                    const shuffle = <T>(array: T[]): T[] => {
                        return array.map(value => ({ value, sort: Math.random() }))
                            .sort((a, b) => a.sort - b.sort)
                            .map(({ value }) => value);
                    };

                    const shuffledSongs = shuffle(songs);
                    const currentMostPlayed = get().mostPlayedSongs;

                    set({
                        songs: shuffledSongs,
                        mostPlayedSongs: currentMostPlayed.length === 0 ? shuffledSongs.slice(5, 15) : currentMostPlayed,
                        totalSongs: total,
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
            addRecentlyPlayedSong: (song: Song) => {
                const { recentlyPlayedSongs } = get();
                // Remove the song if it already exists to move it to the front
                const filteredSongs = recentlyPlayedSongs.filter(s => s.id !== song.id);
                // Add new song to the beginning and limit to 20 songs
                const updatedSongs = [song, ...filteredSongs].slice(0, 20);
                set({ recentlyPlayedSongs: updatedSongs });
            },
        }),
        {
            name: 'home-storage',
            storage: createJSONStorage(() => AsyncStorage),
            partialize: (state) => ({
                recentlyPlayedSongs: state.recentlyPlayedSongs,
                mostPlayedSongs: state.mostPlayedSongs,
            }),
        }
    )
);
