import { Song } from '../types';

export const getArtistName = (song: Song | null): string => {
    if (!song) return 'Unknown Artist';

    // Try primaryArtists first
    if (song.primaryArtists && typeof song.primaryArtists === 'string') {
        return song.primaryArtists;
    }

    // If it's an array (sometimes API returns array)
    if (Array.isArray(song.primaryArtists)) {
        return song.primaryArtists.map((a: any) => typeof a === 'string' ? a : a.name).join(', ');
    }

    // Try nested artists object (common in some API versions)
    const anySong = song as any;
    if (anySong.artists?.primary && Array.isArray(anySong.artists.primary)) {
        return anySong.artists.primary.map((a: any) => a.name).join(', ');
    }

    if (anySong.artists?.all && Array.isArray(anySong.artists.all)) {
        return anySong.artists.all.map((a: any) => a.name).join(', ');
    }

    // Try single artist field
    if (anySong.artist) return anySong.artist;

    return 'Unknown Artist';
};
