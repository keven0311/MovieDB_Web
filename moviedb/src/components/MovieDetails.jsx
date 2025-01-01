import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import "../styles/MovieDetails.css";
import { toast, ToastContainer } from "react-toastify";

const MovieDetails = ({ BASE_URL, baseImgSrc, API_OPTIONS, setRatedMovies }) => {
  const { id } = useParams();
  const [movie, setMovie] = useState(null);
  const [rating, setRating] = useState(1);

  useEffect(() => {
    const fetchMovieDetails = async () => {
      const res = await fetch(`${BASE_URL}/movie/${id}`, API_OPTIONS);
      const data = await res.json();
      setMovie(data);
    };
    fetchMovieDetails();
  }, [id]);

  const handleRatingChange = (e) => {
    setRating(e.target.value);
  }
  
  const handleRate = async (movie, rating) => {
    const options = {
      method: "POST",
      headers: {
        accept: "application/json",
        "Content-Type": "application/json;charset=utf-8",
        Authorization:
          "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIwMjQ5YjhlZjliNGNmMzE0OGQzOGRjZmE4NDBkOGQyMCIsIm5iZiI6MTczMzI0MDgwOS41MTIsInN1YiI6IjY3NGYyN2U5ZDI3ZGNmMDA1MjNmNGE5MSIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.WFQwhzh-pSTIAJWXUMZPgkTQvHkLMHVViJZwIMdSB8I",
      },
      body: `{"value":${rating}}`,
    };

    const ratingApiRes = await fetch(
      `https://api.themoviedb.org/3/movie/${movie.id}/rating`,
      options
    );
    if (ratingApiRes.ok) {
      const res = await ratingApiRes.json();
      if(res.success){
        toast.success("Rating success!")
      }
      setRatedMovies((prev) =>
        prev.some((rated) => rated.id === movie.id)
          ? prev.map((rated) =>
              rated.id === movie.id ? { ...rated, ...movie } : rated
            )
          : [...prev, movie]
      );
    }
  };

  if (!movie) return <div>Loading...</div>;

  return (
    <div className="movie-details">
      <ToastContainer/>
      <div className="movie-details-left">
        <img src={`${baseImgSrc}${movie.poster_path}`} alt={movie.title} />
      </div>
      <div className="movie-details-right">
        <div className="movie-details-right-sections">
          <h1>{movie.title}</h1>
        </div>
        <div className="movie-details-right-sections">
          <h3>Release Date:</h3>
          <p>{movie.release_date}</p>
        </div>
        <div className="movie-details-right-sections">
          <h3>Overview:</h3>
          <p className="movie--details-overview">{movie.overview}</p>
        </div>
        <div className="movie-details-right-sections">
          <h3>Genres:</h3>
          <div className="movie-details-genres">
            {movie.genres.map((genre) => {
              return <div key={genre.id} className="movie-details-genre">
                  <span>{genre.name}</span>
                </div>
            })}
          </div>
        </div>
        <div className="movie-details-right-sections">
          <h3>Average Rating:</h3>
          <div className="movie-details-rating">
            <p>⭐</p>
            <p>{movie.vote_average}</p>
          </div>
        </div>
        <div className="movie-details-right-sections">
          <h3>Your Rating:</h3>
          <div className="movie-details-selectMenu">
            <select value={rating} onChange={handleRatingChange}>
              {[...Array(10)].map((_,index) => (
                <option key={index+1} value={index+1}>
                  {index+1}
                </option>
              ))}
            </select>
            <button onClick={() => handleRate(movie,rating)}>RATE IT!</button>
          </div>
        </div>
        <div className="movie-details-right-sections">
          <h3>Production Companies</h3>
          <div className="movie-details-productionCompanies">
              {movie.production_companies.map((company) => {
                return <div key={company.id} className="movie-details-company">
                    <img
                      className="movie-details-companyLogo" 
                      src={`https://image.tmdb.org/t/p/w500${company.logo_path}`}/>
                    <p>{company.name}</p>
                  </div>
              })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MovieDetails;
