import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import '../styles/MovieDetails.css';

const MovieDetails = ({ BASE_URL, baseImgSrc, API_OPTIONS }) => {
  const { id } = useParams();
  const [movie, setMovie] = useState(null);

  useEffect(() => {
    const fetchMovieDetails = async () => {
      const res = await fetch(`${BASE_URL}/movie/${id}`, API_OPTIONS);
      const data = await res.json();
      setMovie(data);
    };
    fetchMovieDetails();
  }, [id]);

  if (!movie) return <div>Loading...</div>;

  return (
    <div className="movie-details">
      <h1>{movie.title}</h1>
      <img src={`${baseImgSrc}${movie.poster_path}`} alt={movie.title} />
      <p>{movie.overview}</p>
      <p>Rating: {movie.vote_average}</p>
    </div>
  );
};

export default MovieDetails;
