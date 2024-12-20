import { Link } from "react-router-dom";
import '../styles/MovieCard.css'

const MovieCard = ({ movie, isLiked, handleLike, baseImgSrc }) => {
  return (
    <div className="movie-card">
      <div className="movie-card-img">
        <img src={`${baseImgSrc}${movie.poster_path}`} alt={movie.title} />
      </div>
      <Link className="movie-card-link" to={`/movie/${movie.id}`}>
        <h4 className="movie-card-title">{movie.title}</h4>
      </Link>
      <div className="rating">
        <span>
            <i className="ion-md-star"/>
            {movie.vote_average}
        </span>
        <i
          className={`like-icon ${
            isLiked ? "ion-md-heart" : "ion-md-heart-empty"
          }`}
          onClick={(e) => {
            e.preventDefault();
            handleLike(movie);
          }}
        />
      </div>
    </div>
  );
};

export default MovieCard;
