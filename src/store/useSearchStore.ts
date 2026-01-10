import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { searchSongs, searchAlbums, searchArtists, searchPlaylists } from '../api/api';
import { Song } from '../types';

interface SearchState {
    query: string;
    results: any[];
    isLoading: boolean;
    error: string | null;
    history: string[];
    setQuery: (query: string) => void;
    search: (query: string, type?: string) => Promise<void>;
    clearResults: () => void;
    addToHistory: (term: string) => void;
    removeFromHistory: (term: string) => void;
    clearHistory: () => void;
}

export const useSearchStore = create<SearchState>()(
    persist(
        (set, get) => ({
            query: '',
            results: [],
            isLoading: false,
            error: null,
            history: [],
            setQuery: (query) => set({ query }),
            search: async (query, type = 'Songs') => {
                if (!query.trim()) return;
                set({ isLoading: true, error: null });

                // Add to history
                get().addToHistory(query);

                try {
                    let response;
                    if (type === 'Artists') {
                        response = await searchArtists(query);
                    } else if (type === 'Albums') {
                        response = await searchAlbums(query);
                    } else if (type === 'Playlists') {
                        response = await searchPlaylists(query);
                    } else {
                        response = await searchSongs(query);
                    }

                    console.log('Search Response:', JSON.stringify(response, null, 2));

                    // Handle both API response formats
                    const isSuccess = response?.status === 'SUCCESS' || response?.success === true;

                    if (isSuccess) {
                        set({ results: response.data.results, isLoading: false });
                    } else {
                        console.log('Search failed. Status:', response?.status, 'Success:', response?.success);
                        set({ error: 'Failed to fetch results', isLoading: false });
                    }
                } catch (error) {
                    set({ error: 'An error occurred', isLoading: false });
                }
            },
            clearResults: () => set({ results: [], query: '', error: null }),
            addToHistory: (term) => {
                const { history } = get();
                const newHistory = [term, ...history.filter((t) => t !== term)].slice(0, 10);
                set({ history: newHistory });
            },
            removeFromHistory: (term) => {
                set({ history: get().history.filter((t) => t !== term) });
            },
            clearHistory: () => set({ history: [] }),
        }),
        {
            name: 'search-storage',
            storage: createJSONStorage(() => AsyncStorage),
            partialize: (state) => ({ history: state.history }),
        }
    )
);
