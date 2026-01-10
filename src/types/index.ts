export interface Image {
    quality: string;
    link?: string;
    url?: string;
}

export interface DownloadUrl {
    quality: string;
    link?: string;
    url?: string;
}

export interface Song {
    id: string;
    name: string;
    type: string;
    album: {
        id: string;
        name: string;
        url: string;
    };
    year: string;
    duration: string;
    label: string;
    primaryArtists: string;
    primaryArtistsId: string;
    featuredArtists: string;
    featuredArtistsId: string;
    explicitContent: number;
    playCount: string;
    language: string;
    hasLyrics: string;
    url: string;
    copyright: string;
    image: Image[];
    downloadUrl: DownloadUrl[];
}

export interface Album {
    id: string;
    name: string;
    year: string;
    type: string;
    playCount: string;
    language: string;
    explicitContent: string;
    songCount: string;
    url: string;
    primaryArtists: string; // Sometimes array, sometimes string in API, treating as string for display
    image: Image[];
    songs?: Song[]; // For details view
}

export interface Artist {
    id: string;
    name: string;
    role: string;
    type: string;
    image: Image[];
    url: string;
    songs?: Song[]; // For details view
    albums?: Album[]; // For details view
}

export interface Playlist {
    id: string;
    userId: string;
    name: string;
    songCount: string;
    username: string;
    firstname: string;
    lastname: string;
    language: string;
    image: Image[];
    url: string;
    songs?: Song[];
}

export interface SearchResponse<T> {
    success?: boolean;
    status?: string;
    data: {
        results: T[];
        total: number;
        start: number;
    };
}
