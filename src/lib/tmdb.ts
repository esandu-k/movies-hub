import type { Movie, DetailedMovie } from '../types';

export const TMDB_API_KEY = 'fd532763738966b6c1bf99e66511d84d'; 
export const TMDB_BASE_URL = 'https://api.themoviedb.org/3';
export const TMDB_IMAGE_BASE_URL = 'https://image.tmdb.org/t/p/w500'; 
export const TMDB_BACKDROP_BASE_URL = 'https://image.tmdb.org/t/p/original'; 

export const endpoints = {
    trending: `/trending/all/week?api_key=${TMDB_API_KEY}&language=en-US`,
    originals: `/discover/tv?api_key=${TMDB_API_KEY}&with_networks=213&language=en-US`,
    action: `/discover/movie?api_key=${TMDB_API_KEY}&with_genres=28&language=en-US`,
    comedy: `/discover/movie?api_key=${TMDB_API_KEY}&with_genres=35&language=en-US`,
    horror: `/discover/movie?api_key=${TMDB_API_KEY}&with_genres=27&language=en-US`,
    romance: `/discover/movie?api_key=${TMDB_API_KEY}&with_genres=10749&language=en-US`,
    documentaries: `/discover/movie?api_key=${TMDB_API_KEY}&with_genres=99&language=en-US`
};

export async function fetchMovies(url: string): Promise<Movie[]> {
    try {
        const res = await fetch(TMDB_BASE_URL + url);
        const data = await res.json();
        return data.results || [];
    } catch (err) {
        console.error("Error fetching from TMDB:", err);
        return [];
    }
}

export async function fetchMovieDetails(id: number, mediaType: 'movie' | 'tv' = 'movie'): Promise<DetailedMovie | null> {
    try {
        const res = await fetch(`${TMDB_BASE_URL}/${mediaType}/${id}?api_key=${TMDB_API_KEY}&language=en-US&append_to_response=credits,videos,similar,reviews,watch/providers`);
        return await res.json();
    } catch (err) {
        console.error("Error fetching full details:", err);
        return null;
    }
}

export async function searchMovies(query: string): Promise<Movie[]> {
    try {
        const res = await fetch(`${TMDB_BASE_URL}/search/multi?api_key=${TMDB_API_KEY}&query=${encodeURIComponent(query)}&language=en-US&page=1`);
        const data = await res.json();
        const movies: Movie[] = (data.results || []).filter((item: any) => item.media_type !== 'person' && (item.backdrop_path || item.poster_path));
        movies.sort((a, b) => (b.popularity || 0) - (a.popularity || 0));
        return movies;
    } catch (err) {
        console.error("Error searching:", err);
        return [];
    }
}
