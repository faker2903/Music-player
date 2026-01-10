import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Song } from '../types';

export interface UserPlaylist {
    id: string;
    name: string;
    songs: Song[];
    createdAt: number;
}

interface PlaylistState {
    playlists: UserPlaylist[];
    createPlaylist: (name: string) => void;
    deletePlaylist: (id: string) => void;
    addToPlaylist: (playlistId: string, song: Song) => void;
    removeFromPlaylist: (playlistId: string, songId: string) => void;
    getPlaylist: (id: string) => UserPlaylist | undefined;
}

export const usePlaylistStore = create<PlaylistState>()(
    persist(
        (set, get) => ({
            playlists: [],
            createPlaylist: (name) => {
                const newPlaylist: UserPlaylist = {
                    id: Date.now().toString(),
                    name,
                    songs: [],
                    createdAt: Date.now(),
                };
                set({ playlists: [...get().playlists, newPlaylist] });
            },
            deletePlaylist: (id) => {
                set({ playlists: get().playlists.filter(p => p.id !== id) });
            },
            addToPlaylist: (playlistId, song) => {
                set({
                    playlists: get().playlists.map(p => {
                        if (p.id === playlistId) {
                            // Avoid duplicates
                            if (p.songs.some(s => s.id === song.id)) return p;
                            return { ...p, songs: [...p.songs, song] };
                        }
                        return p;
                    })
                });
            },
            removeFromPlaylist: (playlistId, songId) => {
                set({
                    playlists: get().playlists.map(p => {
                        if (p.id === playlistId) {
                            return { ...p, songs: p.songs.filter(s => s.id !== songId) };
                        }
                        return p;
                    })
                });
            },
            getPlaylist: (id) => {
                return get().playlists.find(p => p.id === id);
            }
        }),
        {
            name: 'playlists-storage',
            storage: createJSONStorage(() => AsyncStorage),
        }
    )
);
