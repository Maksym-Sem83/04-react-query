import { useState, useEffect, useRef } from 'react';
import { useQuery } from '@tanstack/react-query';
import ReactPaginate from 'react-paginate';
import SearchBar from '../SearchBar/SearchBar';
import MovieGrid from '../MovieGrid/MovieGrid';
import Loader from '../Loader/Loader';
import ErrorMessage from '../ErrorMessage/ErrorMessage';
import MovieModal from '../MovieModal/MovieModal';
import { fetchMovies } from '../../services/movieService';
import type { MovieResponse, Movie } from '../../types/movie';
import css from './App.module.css';
import toast from 'react-hot-toast';

export default function App() {
  const [query, setQuery] = useState('');
  const [page, setPage] = useState(1);
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);

  const shownErrorFor = useRef<{ query: string; page: number } | null>(null);

  const { data, isLoading, isError } = useQuery<MovieResponse, Error>({
    queryKey: ['movies', query, page],
    queryFn: () => fetchMovies(query, page),
    enabled: query.trim().length > 0,
  });

  const handleSearch = (searchQuery: string) => {
    if (searchQuery === query) return;
    setQuery(searchQuery);
    setPage(1);
    shownErrorFor.current = null;
  };

  const handleSelect = (movie: Movie) => {
    setSelectedMovie(movie);
  };

  const totalPages = data?.total_pages ?? 0;
  const movies = data?.results ?? [];

  useEffect(() => {
    if (
      !isLoading &&
      data &&
      data.results.length === 0 &&
      query.trim() !== '' &&
      !(shownErrorFor.current?.query === query && shownErrorFor.current?.page === page)
    ) {
      toast.error('No movies found for your request.');
      shownErrorFor.current = { query, page };
    }
  }, [data, query, page, isLoading]);

  return (
    <div className={css.app}>
      <SearchBar onSubmit={handleSearch} />

      {isLoading && <Loader />}
      {isError && <ErrorMessage />}

      {!isLoading && !isError && totalPages > 1 && (
        <ReactPaginate
          pageCount={totalPages}
          pageRangeDisplayed={5}
          marginPagesDisplayed={1}
          onPageChange={({ selected }) => {
            setPage(selected + 1);
            shownErrorFor.current = null;
          }}
          forcePage={page - 1}
          containerClassName={css.pagination}
          activeClassName={css.active}
          nextLabel={<span>→</span>}
          previousLabel={<span>←</span>}
        />
      )}

      {!isLoading && !isError && movies.length > 0 && (
        <MovieGrid movies={movies} onSelect={handleSelect} />
      )}

      {selectedMovie && (
        <MovieModal movie={selectedMovie} onClose={() => setSelectedMovie(null)} />
      )}
    </div>
  );
}
