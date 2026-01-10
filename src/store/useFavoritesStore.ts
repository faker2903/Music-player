import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Song } from '../types';

interface FavoritesState {
    favorites: Song[];
    addFavorite: (song: Song) => void;
    removeFavorite: (songId: string) => void;
    isFavorite: (songId: string) => boolean;
    toggleFavorite: (song: Song) => void;
}

export const useFavoritesStore = create<FavoritesState>()(
    persist(
        (set, get) => ({
            favorites: [],
            addFavorite: (song) => {
                const { favorites } = get();
                if (!favorites.some(f => f.id === song.id)) {
                    set({ favorites: [...favorites, song] });
                }
            },
            removeFavorite: (songId) => {
                set({ favorites: get().favorites.filter(f => f.id !== songId) });
            },
            isFavorite: (songId) => {
                return get().favorites.some(f => f.id === songId);
            },
            toggleFavorite: (song) => {
                const { isFavorite, addFavorite, removeFavorite } = get();
                if (isFavorite(song.id)) {
                    removeFavorite(song.id);
                } else {
                    addFavorite(song);
                }
            }
        }),
        {
            name: 'favorites-storage',
            storage: createJSONStorage(() => AsyncStorage),
        }
    )
);
