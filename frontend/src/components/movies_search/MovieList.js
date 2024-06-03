import React from 'react';

const MovieList = ({ movies, onAddToPlaylist }) => {
  return (
    <div className="movie-list">
      {movies.map((movie) => (
        <div key={movie.imdbID} className="movie-item">
          <img src={movie.Poster} alt={movie.Title} />
          <h3>{movie.Title}</h3>
          <p>{movie.Year}</p>
          <button onClick={() => onAddToPlaylist(movie)}>Add to Playlist</button>
        </div>
      ))}
    </div>
  );
};

export default MovieList;
