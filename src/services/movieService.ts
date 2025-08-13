import axios from "axios";

const API_URL = "https://api.themoviedb.org/3";
const TOKEN = import.meta.env.VITE_TMDB_TOKEN;

export interface MovieResponse {
  page: number;
  results: Movie[];
  total_pages: number;
  total_results: number;
}

import type { Movie } from "../types/movie";

export async function fetchMovies(query: string, page: number): Promise<MovieResponse> {
  const response = await axios.get<MovieResponse>(`${API_URL}/search/movie`, {
    params: { query, page },
    headers: {
      Authorization: `Bearer ${TOKEN}`,
    },
  });
  return response.data;
}
