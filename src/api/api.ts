import axios from 'axios';
import { SearchResponse, Song, Album, Artist, Playlist } from '../types';

const BASE_URL = 'https://saavn.sumit.co/api';

export const api = axios.create({
    baseURL: BASE_URL,
    timeout: 10000,
});

export const searchSongs = async (query: string) => {
    try {
        const response = await api.get<SearchResponse<Song>>('/search/songs', {
            params: { query },
        });
        return response.data;
    } catch (error) {
        console.error('Error searching songs:', error);
        throw error;
    }
};

export const searchAlbums = async (query: string) => {
    try {
        const response = await api.get<SearchResponse<Album>>('/search/albums', {
            params: { query },
        });
        return response.data;
    } catch (error) {
        console.error('Error searching albums:', error);
        throw error;
    }
};

export const searchArtists = async (query: string) => {
    try {
        const response = await api.get<SearchResponse<Artist>>('/search/artists', {
            params: { query },
        });
        return response.data;
    } catch (error) {
        console.error('Error searching artists:', error);
        throw error;
    }
};

export const searchPlaylists = async (query: string) => {
    try {
        const response = await api.get<SearchResponse<Playlist>>('/search/playlists', {
            params: { query },
        });
        return response.data;
    } catch (error) {
        console.error('Error searching playlists:', error);
        throw error;
    }
};

export const getAlbum = async (id: string) => {
    try {
        const response = await api.get('/albums', {
            params: { id },
        });
        return response.data;
    } catch (error) {
        console.error('Error getting album:', error);
        throw error;
    }
};

export const getArtist = async (id: string) => {
    try {
        const response = await api.get('/artists', {
            params: { id },
        });
        return response.data;
    } catch (error) {
        console.error('Error getting artist:', error);
        throw error;
    }
};

export const getArtistSongs = async (id: string, page = 1) => {
    try {
        const response = await api.get(`/artists/${id}/songs`, {
            params: { page },
        });
        return response.data;
    } catch (error) {
        console.error('Error getting artist songs:', error);
        throw error;
    }
};
