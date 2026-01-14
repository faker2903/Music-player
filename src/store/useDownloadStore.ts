import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { File, Directory, Paths } from 'expo-file-system';
import { Song } from '../types';

interface DownloadState {
    downloadedSongs: Song[];
    downloadPaths: Record<string, string>; // songId -> localUri
    downloadingIds: Set<string>;

    // Actions
    downloadSong: (song: Song) => Promise<void>;
    removeDownload: (songId: string) => Promise<void>;
    isDownloaded: (songId: string) => boolean;
    getLocalUri: (songId: string) => string | null;
}

export const useDownloadStore = create<DownloadState>()(
    persist(
        (set, get) => ({
            downloadedSongs: [],
            downloadPaths: {},
            downloadingIds: new Set(),

            downloadSong: async (song: Song) => {
                if (get().isDownloaded(song.id)) return;

                set((state) => {
                    const newDownloading = new Set(state.downloadingIds);
                    newDownloading.add(song.id);
                    return { downloadingIds: newDownloading };
                });

                try {
                    // Find the best quality URL
                    const getUrl = (quality: string) => {
                        const match = song.downloadUrl?.find(u => u.quality === quality);
                        return match?.url || match?.link;
                    };

                    const remoteUrl = getUrl('320kbps') ||
                        getUrl('160kbps') ||
                        getUrl('96kbps') ||
                        (song.downloadUrl?.[0]?.url || song.downloadUrl?.[0]?.link);

                    if (!remoteUrl) throw new Error('No download URL found');

                    const fileExtension = remoteUrl.split('.').pop() || 'mp3';
                    const fileName = `${song.id}.${fileExtension}`;
                    const downloadsDir = new Directory(Paths.document, 'downloads');

                    // Ensure downloads directory exists
                    if (!downloadsDir.exists) {
                        downloadsDir.create();
                    }

                    const targetFile = new File(downloadsDir, fileName);

                    const result = await File.downloadFileAsync(remoteUrl, targetFile);

                    if (result) {
                        set((state) => ({
                            downloadedSongs: [song, ...state.downloadedSongs],
                            downloadPaths: { ...state.downloadPaths, [song.id]: targetFile.uri },
                        }));
                    }
                } catch (error) {
                    console.error('Error downloading song:', error);
                } finally {
                    set((state) => {
                        const newDownloading = new Set(state.downloadingIds);
                        newDownloading.delete(song.id);
                        return { downloadingIds: newDownloading };
                    });
                }
            },

            removeDownload: async (songId: string) => {
                const localUri = get().downloadPaths[songId];
                if (localUri) {
                    try {
                        const file = new File(localUri);
                        if (file.exists) {
                            file.delete();
                        }
                    } catch (error) {
                        console.error('Error deleting local file:', error);
                    }
                }

                set((state) => {
                    const newPaths = { ...state.downloadPaths };
                    delete newPaths[songId];
                    return {
                        downloadedSongs: state.downloadedSongs.filter(s => s.id !== songId),
                        downloadPaths: newPaths,
                    };
                });
            },

            isDownloaded: (songId: string) => {
                return !!get().downloadPaths[songId];
            },

            getLocalUri: (songId: string) => {
                return get().downloadPaths[songId] || null;
            },
        }),
        {
            name: 'download-storage',
            storage: createJSONStorage(() => AsyncStorage),
            partialize: (state) => ({
                downloadedSongs: state.downloadedSongs,
                downloadPaths: state.downloadPaths,
            }),
        }
    )
);
