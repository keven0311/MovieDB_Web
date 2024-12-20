import { useState, useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import MovieCard from "./components/MovieCard";
import SelectFilter from "./components/SelectFilter";
import Pagination from "./components/Pagination";
import MovieDetails from "./components/MovieDetails";
import "./App.css";

const BASE_URL = "https://api.themoviedb.org/3";
const BASE_IMG_SRC = "https://image.tmdb.org/t/p/w500";
const API_OPTIONS = {
  method: "GET",
  headers: {
    accept: "application/json",
    Authorization: "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIwMjQ5YjhlZjliNGNmMzE0OGQzOGRjZmE4NDBkOGQyMCIsIm5iZiI6MTczMzI0MDgwOS41MTIsInN1YiI6IjY3NGYyN2U5ZDI3ZGNmMDA1MjNmNGE5MSIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.WFQwhzh-pSTIAJWXUMZPgkTQvHkLMHVViJZwIMdSB8I",
  },
};

function App() {
  const [movies, setMovies] = useState([]);
  const [likedMovies, setLikedMovies] = useState([]);
  const [ratedMovies, setRatedMovies] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setToltalPages] = useState(0);
  const [currentFilter, setCurrentFilter] = useState("popular");

  //fetch movies from API:
  const fetchMovies = async (category = "popular", page = 1) => {
    // checking cache:
    const cacheKey = `${category}-movies`;
    let cache = localStorage.getItem(cacheKey);

    cache = cache ? JSON.parse(cache) : {}
    // return data if already stored in localstorage:
    if(cache[page]){
      return cache[page];
    }

    const res = await fetch(
      `${BASE_URL}/movie/${category}?language=en-US&page=${page}`,
      API_OPTIONS
    );
    const data = await res.json();

    // adding fetched data into cache
    cache[page] = data;
    localStorage.setItem(cacheKey, JSON.stringify(cache));
    
    return data;
  };

  // reset currentPage when filter change:
  useEffect(() => {
    setCurrentPage(1);
  },[currentFilter])

  useEffect(() => {
    const loadMovies = async () => {
      const data = await fetchMovies(currentFilter, currentPage);
      console.log(data)
      setMovies(data.results || []);
      setToltalPages(data.total_pages);
    };
    loadMovies();
  }, [currentFilter, currentPage]);

  const handleLike = (movie) => {
    setLikedMovies((prev) => {
      const isLiked = prev.some((liked) => liked.id === movie.id);
      if(isLiked){
        return prev.filter((liked) => liked.id !== movie.id);
      }else{
        return [...prev,movie]
      }
    });
  };

  const handleRate = (movie) => {
    setRatedMovies((prev) =>
      prev.some((rated) => rated.id === movie.id)
        ? prev.map((rated) =>
            rated.id === movie.id ? { ...rated, ...movie } : rated
          )
        : [...prev, movie]
    );
  };

  const renderMovies = (moviesList) => {
    if(!moviesList || moviesList.length === 0){
      return <p> No movies available. </p>
    }
    return moviesList.map((movie) => (
      <MovieCard
        key={movie.id}
        movie={movie}
        isLiked={likedMovies.some((liked) => liked.id === movie.id)}
        handleLike={handleLike}
        baseImgSrc={BASE_IMG_SRC}
      />
    ));
  };

  return (
    <div className="App">
      <Navbar />
      <Routes>
        <Route
          path="/"
          element={
            <>
              <SelectFilter
                currentFilter={currentFilter}
                setCurrentFilter={setCurrentFilter}
              />
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                setCurrentPage={setCurrentPage}
              />
              <div className="movie-list">{renderMovies(movies)}</div>
            </>
          }
        />
        <Route
          path="/liked"
          element={
            <div className="movie-list">{renderMovies(likedMovies)}</div>
          }
        />
        <Route
          path="/rated"
          element={
            <div className="movie-list">{renderMovies(ratedMovies)}</div>
          }
        />
        <Route
          path="/movie/:id"
          element={<MovieDetails BASE_URL={BASE_URL} baseImgSrc={BASE_IMG_SRC} API_OPTIONS={API_OPTIONS}/>}
        />
      </Routes>
    </div>
  );
}

export default App;
