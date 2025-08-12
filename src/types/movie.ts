export interface Movie {
  id: number;
  title: string;
  poster_path: string | null;
}

export interface MovieResponse {
  page: number;
  results: Movie[];
  total_pages: number;
}
