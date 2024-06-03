import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import SearchBar from '../movies_search/SearchBar';
import MovieList from '../movies_search/MovieList';
import PlaylistForm from '../PlayListForm';
import { Container, Navbar, Nav } from "react-bootstrap";
import { logout } from "../login/LoginActions";
import axios from 'axios';

const Dashboard = (props) => {
  const navigate = useNavigate();
  const [movies, setMovies] = useState([]);
  const [playlists, setPlaylists] = useState([]);
  const [selectedPlaylist, setSelectedPlaylist] = useState('');
  const [playlistMovies, setPlaylistMovies] = useState([]);

  const onLogout = () => {
    props.logout();
    navigate("/"); // Redirect to home after logout
  };

  const fetchPlaylists = async () => {
    try {
      const response = await axios.get('http://localhost:8000/api/playlists/', {
        headers: {
          'Authorization': `Token ${localStorage.getItem('token')}`
        }
      });
      setPlaylists(response.data);
      console.log('Fetched playlists:', response.data); // Debug: log fetched playlists
    } catch (error) {
      console.error('Error fetching playlists:', error);
    }
  };

  useEffect(() => {
    fetchPlaylists();
  }, []);

  const handleSearch = async (query) => {
    try {
      const response = await fetch(`http://localhost:8000/api/search/?query=${query}`, {
        method: 'GET',
        headers: {
          'Authorization': `Token ${localStorage.getItem('token')}`
        }
      });
      const data = await response.json();
      if (data.Response === 'True') {
        setMovies(data.Search);
      } else {
        setMovies([]);
      }
    } catch (error) {
      console.error('Error searching movies:', error);
    }
  };

  const handleAddToPlaylist = async (movie) => {
    if (!selectedPlaylist) {
      alert("Please select a playlist first");
      return;
    }
  
    const releaseYear = movie.Year;
    const releaseDate = `${releaseYear}-01-01`; // Default to January 1st
  
    const movieData = {
      title: movie.Title,
      description: movie.Description || "", // Assuming the description is optional
      release_date: releaseDate,
      image_url: movie.Poster // Include image URL
    };
  
    console.log('Movie data to add:', movieData); // Debug: log movie data
  
    try {
      const response = await axios.post(`http://localhost:8000/api/playlists/${selectedPlaylist}/add_movie/`, {
        movie: movieData
      }, {
        headers: {
          'Authorization': `Token ${localStorage.getItem('token')}`
        }
      });
  
      if (response.status === 200) {
        alert('Movie added to playlist');
        fetchPlaylistMovies(selectedPlaylist); // Fetch the updated movies for the selected playlist
      } else {
        alert('Failed to add movie to playlist');
      }
    } catch (error) {
      console.error('Error adding movie to playlist:', error.response);
      if (error.response && error.response.data && error.response.data.errors) {
        console.error('Detailed errors:', error.response.data.errors);
        alert(`Error adding movie to playlist: ${JSON.stringify(error.response.data.errors)}`);
      } else {
        alert(`Error adding movie to playlist: ${error.response.status} ${error.response.statusText}`);
      }
    }
  };
  

  const fetchPlaylistMovies = async (playlistId) => {
    try {
        console.log('Fetching movies for playlist:', playlistId); // Debug: log fetching movies
        const response = await axios.get(`http://localhost:8000/api/playlists/${playlistId}/movies/`, {
            headers: {
                'Authorization': `Token ${localStorage.getItem('token')}`
            }
        });
        console.log('Fetched playlist movies:', response.data); // Debug: log fetched playlist movies
        setPlaylistMovies(response.data); // Assuming the response is a list of movies
    } catch (error) {
        console.error('Error fetching playlist movies:', error);
    }
};

  useEffect(() => {
    if (selectedPlaylist) {
      fetchPlaylistMovies(selectedPlaylist);
    }
  }, [selectedPlaylist]);

  // Handle missing username with optional chaining
  const username = props.auth.user?.username || "Unknown User";

  return (
    <div>
      <Navbar bg="light">
        <Navbar.Brand as={Link} to="/">
          Home
        </Navbar.Brand>
        <Navbar.Toggle />
        <Navbar.Collapse className="justify-content-end">
          <Nav.Link onClick={onLogout}>Logout</Nav.Link>
        </Navbar.Collapse>
      </Navbar>
      <Container>
        <h1>Dashboard</h1>
        <SearchBar onSearch={handleSearch} />
        <MovieList movies={movies} onAddToPlaylist={handleAddToPlaylist} />
        <PlaylistForm fetchPlaylists={fetchPlaylists} />
        <div>
          <h2>Your Playlists</h2>
          <select onChange={(e) => setSelectedPlaylist(e.target.value)} value={selectedPlaylist}>
            <option value="">Select Playlist</option>
            {playlists.map((playlist) => (
              <option key={playlist.id} value={playlist.id}>{playlist.name}</option>
            ))}
          </select>
          <ul>
            {playlists.map((playlist) => (
              <li key={playlist.id}>
                {playlist.name} - {playlist.is_public ? 'Public' : 'Private'}
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h2>Movies in Selected Playlist</h2>
          <ul>
            {playlistMovies.map((movie, index) => (
              <li key={index} style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
                <img src={movie.image_url} alt={movie.title} style={{ width: '50px', marginRight: '10px' }} />
                <div>
                  <h4>{movie.title} ({movie.release_date})</h4>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </Container>
    </div>
  );
};

Dashboard.propTypes = {
  logout: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  auth: state.auth,
});

export default connect(mapStateToProps, { logout })(Dashboard);
