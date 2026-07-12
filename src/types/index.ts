export interface Movie {
  id: number;
  title?: string;
  name?: string;
  overview: string;
  poster_path: string | null;
  backdrop_path: string | null;
  media_type?: 'movie' | 'tv';
  vote_average?: number;
  release_date?: string;
  first_air_date?: string;
  popularity?: number;
}

export interface Provider {
  provider_id: number;
  provider_name: string;
  logo_path: string;
}

export interface DetailedMovie extends Movie {
  runtime?: number;
  episode_run_time?: number[];
  genres?: { id: number; name: string }[];
  credits?: {
    cast: { name: string; character: string; profile_path: string | null }[];
    crew: { name: string; job: string }[];
  };
  similar?: { results: Movie[] };
  reviews?: { results: { author: string; content: string }[] };
  videos?: { results: { site: string; type: string; key: string }[] };
  created_by?: { name: string }[];
  'watch/providers'?: {
    results: {
      [countryCode: string]: {
        link?: string;
        flatrate?: Provider[];
        rent?: Provider[];
        buy?: Provider[];
      };
    };
  };
}

export interface User {
  id: number;
  username: string;
}
