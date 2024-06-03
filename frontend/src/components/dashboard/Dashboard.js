import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import SearchBar from '../movies_search/SearchBar';
import MovieList from '../movies_search/MovieList';
import PlaylistForm from '../PlayListForm';
import { Container, Navbar, Nav, Row, Col } from "react-bootstrap";
import { logout } from "../login/LoginActions";
import axios from 'axios';
import './Dashboard.css';

const Dashboard = (props) => {
  const navigate = useNavigate();
  const [movies, setMovies] = useState([]);
  const [playlists, setPlaylists] = useState([]);
  const [selectedPlaylist, setSelectedPlaylist] = useState('');
  const [playlistMovies, setPlaylistMovies] = useState([]);

  const onLogout = () => {
    props.logout();
    navigate("/"); 
  };

  const fetchPlaylists = async () => {
    try {
        const token = localStorage.getItem('token');
        if (!token) {
            throw new Error('No token found');
        }

        console.log('Token:', token); // Verify the token

        const response = await axios.get('http://localhost:8000/api/playlists/', {
            headers: {
                'Authorization': `Token ${token}`
            }
        });
        setPlaylists(response.data);
        console.log('Fetched playlists:', response.data);
    } catch (error) {
        console.error('Error fetching playlists:', error);
        if (error.response && error.response.status === 401) {
            alert('Unauthorized access - please log in again.');
            // Optionally, redirect to the login page
            // navigate('/login');
        }
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
    const releaseDate = `${releaseYear}-01-01`; 
  
    const movieData = {
      title: movie.Title,
      description: movie.Description || "",
      release_date: releaseDate,
      image_url: movie.Poster 
    };
  
    console.log('Movie data to add:', movieData);
  
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
        fetchPlaylistMovies(selectedPlaylist); 
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
        console.log('Fetching movies for playlist:', playlistId); 
        const response = await axios.get(`http://localhost:8000/api/playlists/${playlistId}/movies/`, {
            headers: {
                'Authorization': `Token ${localStorage.getItem('token')}`
            }
        });
        console.log('Fetched playlist movies:', response.data); 
        setPlaylistMovies(response.data); 
    } catch (error) {
        console.error('Error fetching playlist movies:', error);
    }
};

  useEffect(() => {
    if (selectedPlaylist) {
      fetchPlaylistMovies(selectedPlaylist);
    }
  }, [selectedPlaylist]);

  const username = props.auth.user?.username || "Unknown User";

  return (
    <div className="dashboard-container">
      <Navbar bg="dark" variant="dark" expand="lg" className="navbar">
        <Navbar.Brand as={Link} to="/" className="navbar-brand">
          Home
        </Navbar.Brand>
        <Navbar.Toggle />
        <Navbar.Collapse className="justify-content-end">
          <Nav className="ml-auto">
            <Nav.Link onClick={onLogout} className="nav-link">Logout</Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Navbar>
      <Container>
        <h1 className="dashboard-title">Dashboard</h1>
        <Row>
            <Col md={6}>
              <SearchBar className="search-bar" onSearch={handleSearch} />
              <MovieList movies={movies} onAddToPlaylist={handleAddToPlaylist} />
            </Col>
          <Col md={6}>
            <PlaylistForm fetchPlaylists={fetchPlaylists} />
            <div className="playlist-section">
              <h2>Your Playlists</h2>
              <select onChange={(e) => setSelectedPlaylist(e.target.value)} value={selectedPlaylist}>
                <option value="">Select Playlist</option>
                {playlists.map((playlist) => (
                  <option key={playlist.id} value={playlist.id}>{playlist.name}</option>
                ))}
              </select>
              <ul className="playlist-list">
                {playlists.map((playlist) => (
                  <li key={playlist.id} className="playlist-item">
                    {playlist.name} - {playlist.is_public ? 'Public' : 'Private'}
                  </li>
                ))}
              </ul>
            </div>
            <div className="movie-section">
              <h2>Movies in Selected Playlist</h2>
              <ul className="movie-list">
                {playlistMovies.map((movie, index) => (
                  <li key={index} className="movie-item">
                    <img src={movie.image_url} alt={movie.title} />
                    <div>
                      <h4>{movie.title} ({movie.release_date})</h4>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </Col>
        </Row>
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
