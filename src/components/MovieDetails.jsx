import { useEffect, useRef, useState } from "react";
import StarRating from "./StarRating";
import Loader from "./Loader";
import ErrorMessage from "./ErrorMessage";
import { useKey } from "../hooks/useKey";

const MovieDetails = ({
  selectedId,
  onCloseMovie,
  KEY,
  onAddWatched,
  watched,
}) => {
  const [movie, setMovie] = useState({});
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [userRating, setUserRating] = useState(0);
  const isExist = watched.map((movie) => movie.imdbID).includes(selectedId);
  const userRate = watched.find(
    (movie) => movie.imdbID === selectedId
  )?.userRating;

  const {
    Title: title,
    Year: year,
    Poster: poster,
    Runtime: runtime,
    imdbRating,
    Released: released,
    Actors: actors,
    Director: director,
    Genre: genre,
    Plot: plot,
  } = movie;

  const countRef = useRef(0);

  useEffect(() => {
    if (userRating) countRef.current++;
  }, [userRating]);

  useEffect(() => {
    async function getMovieDetail() {
      try {
        setIsLoading(true);
        setError("");
        const response = await fetch(
          `http://www.omdbapi.com/?apikey=${KEY}&i=${selectedId}`
        );
        if (!response.ok) throw new Error("Smoething went Wrong!");
        const data = await response.json();
        setMovie(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    }
    getMovieDetail();
  }, [selectedId, KEY]);

  useEffect(() => {
    if (!title) return;
    document.title = `Movie|${title}`;

    return () => {
      document.title = "usePopcorn";
    };
  }, [title]);
  useKey("escape", onCloseMovie);

  const handleAdd = () => {
    const newWatchedMovie = {
      imdbID: selectedId,
      title,
      year,
      poster,
      imdbRating: Number(imdbRating),
      userRating,
      runtime: Number(runtime.split(" ").at(0)),
      countRatingDecisions: countRef,
    };
    onAddWatched(newWatchedMovie);
    onCloseMovie();
  };

  return (
    <div className="details">
      {isLoading && <Loader />}
      {!isLoading && error && <ErrorMessage error={error} />}
      {!isLoading && !error && (
        <>
          {" "}
          <header>
            <button className="btn-back" onClick={onCloseMovie}>
              &larr;
            </button>
            <img src={poster} alt={`the poster of ${title} movie`} />
            <div className="details-overview">
              <h2>{title}</h2>
              <p>
                {released} &bull; {runtime}
              </p>
              <p>{genre}</p>
              <p>
                <span>⭐</span>
                {imdbRating} IMDb Rating
              </p>
            </div>
          </header>
          <section>
            <div className="rating" disable={true}>
              {!isExist ? (
                <>
                  <StarRating
                    maxRate={10}
                    size={24}
                    onSetRate={setUserRating}
                  />
                  {userRating > 0 && (
                    <button className="btn-add" onClick={handleAdd}>
                      + Add to list
                    </button>
                  )}
                </>
              ) : (
                <p>
                  You rated with movie{" "}
                  <strong style={{ color: "gold" }}>{userRate}</strong>{" "}
                  <span>🌟</span>
                </p>
              )}
            </div>
            <p>
              <em>{plot}</em>
            </p>
            <p>Starring: {actors}</p>
            <p>Directed by {director}</p>
          </section>
        </>
      )}
    </div>
  );
};

export default MovieDetails;
