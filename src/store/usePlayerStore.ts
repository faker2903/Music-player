import { create } from 'zustand';
import { Audio } from 'expo-av';
import { Song } from '../types';
import { useHomeStore } from './useHomeStore';
import { useDownloadStore } from './useDownloadStore';

interface PlayerState {
    sound: Audio.Sound | null;
    isPlaying: boolean;
    currentSong: Song | null;
    queue: Song[];
    currentIndex: number;
    duration: number;
    position: number;
    isLoading: boolean;
    currentPlaybackId: string | null;
    repeatMode: 'off' | 'one' | 'all';

    // Actions
    playSong: (song: Song) => Promise<void>;
    pauseSong: () => Promise<void>;
    resumeSong: () => Promise<void>;
    stopSong: () => Promise<void>;
    playNext: () => Promise<void>;
    playPrevious: () => Promise<void>;
    seekTo: (position: number) => Promise<void>;
    setQueue: (songs: Song[], startIndex?: number) => void;
    addToQueue: (song: Song) => void;
    playSongList: (songs: Song[], index: number) => Promise<void>;
    toggleRepeatMode: () => void;
}

export const usePlayerStore = create<PlayerState>((set, get) => ({
    sound: null,
    isPlaying: false,
    currentSong: null,
    queue: [],
    currentIndex: -1,
    duration: 0,
    position: 0,
    isLoading: false,
    currentPlaybackId: null,
    repeatMode: 'off',

    playSong: async (song: Song) => {
        const playbackId = Date.now().toString();
        set({
            isLoading: true,
            currentSong: song,
            isPlaying: false,
            position: 0,
            duration: 0,
            currentPlaybackId: playbackId
        });

        // Add to recently played
        useHomeStore.getState().addRecentlyPlayedSong(song);

        const { sound } = get();
        try {
            if (sound) {
                await sound.unloadAsync();
            }

            // Check if a new playback request has started while we were unloading
            if (get().currentPlaybackId !== playbackId) return;

            // Check if song is downloaded
            const localUri = useDownloadStore.getState().getLocalUri(song.id);
            let downloadUrl = localUri;

            if (!downloadUrl) {
                // Find the best quality URL
                const getUrl = (quality: string) => {
                    const match = song.downloadUrl?.find(u => u.quality === quality);
                    return match?.url || match?.link;
                };

                downloadUrl = getUrl('320kbps') ||
                    getUrl('160kbps') ||
                    getUrl('96kbps') ||
                    getUrl('48kbps') ||
                    getUrl('12kbps') ||
                    (song.downloadUrl?.[0]?.url || song.downloadUrl?.[0]?.link) || null;
            }

            if (!downloadUrl) {
                console.error('No download URL found for song:', song.name);
                if (get().currentPlaybackId === playbackId) {
                    set({ isLoading: false });
                }
                return;
            }

            const { sound: newSound } = await Audio.Sound.createAsync(
                { uri: downloadUrl },
                { shouldPlay: true },
                (status) => {
                    // Only update state if this is still the active playback
                    if (get().currentPlaybackId === playbackId && status.isLoaded) {
                        set({
                            duration: status.durationMillis || 0,
                            position: status.positionMillis,
                            isPlaying: status.isPlaying,
                        });

                        if (status.didJustFinish) {
                            const { repeatMode } = get();
                            if (repeatMode === 'one') {
                                get().playSong(get().currentSong!);
                            } else {
                                get().playNext();
                            }
                        }
                    }
                }
            );

            // Final check before setting the sound
            if (get().currentPlaybackId !== playbackId) {
                await newSound.unloadAsync();
                return;
            }

            set({ sound: newSound, isPlaying: true, isLoading: false });
        } catch (error) {
            console.error('Error playing song:', error);
            if (get().currentPlaybackId === playbackId) {
                set({ isLoading: false });
            }
        }
    },

    pauseSong: async () => {
        const { sound } = get();
        if (sound) {
            await sound.pauseAsync();
            set({ isPlaying: false });
        }
    },

    resumeSong: async () => {
        const { sound } = get();
        if (sound) {
            await sound.playAsync();
            set({ isPlaying: true });
        }
    },

    stopSong: async () => {
        const { sound } = get();
        if (sound) {
            await sound.stopAsync();
            set({ isPlaying: false, position: 0 });
        }
    },

    playNext: async () => {
        const { queue, currentIndex, repeatMode } = get();
        if (currentIndex < queue.length - 1) {
            const nextIndex = currentIndex + 1;
            set({ currentIndex: nextIndex });
            await get().playSong(queue[nextIndex]);
        } else if (repeatMode === 'all' && queue.length > 0) {
            // Wrap around to the start
            set({ currentIndex: 0 });
            await get().playSong(queue[0]);
        } else {
            // End of queue
            set({ isPlaying: false });
        }
    },

    playPrevious: async () => {
        const { queue, currentIndex } = get();
        if (currentIndex > 0) {
            const prevIndex = currentIndex - 1;
            set({ currentIndex: prevIndex });
            await get().playSong(queue[prevIndex]);
        } else {
            // Restart current song
            await get().seekTo(0);
        }
    },

    playSongList: async (songs: Song[], index: number) => {
        set({ queue: songs, currentIndex: index });
        await get().playSong(songs[index]);
    },

    seekTo: async (position: number) => {
        const { sound } = get();
        if (sound) {
            await sound.setPositionAsync(position);
            set({ position });
        }
    },

    setQueue: (songs: Song[], startIndex = 0) => {
        set({ queue: songs, currentIndex: startIndex });
        if (songs.length > 0 && startIndex >= 0 && startIndex < songs.length) {
            get().playSong(songs[startIndex]);
        }
    },

    addToQueue: (song: Song) => {
        const { queue } = get();
        set({ queue: [...queue, song] });
    },

    toggleRepeatMode: () => {
        const { repeatMode } = get();
        const modes: ('off' | 'one' | 'all')[] = ['off', 'all', 'one'];
        const nextIndex = (modes.indexOf(repeatMode) + 1) % modes.length;
        set({ repeatMode: modes[nextIndex] });
    }
}));
