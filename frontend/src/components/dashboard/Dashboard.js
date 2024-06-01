import React, {useState} from "react";
import { Link, useNavigate } from "react-router-dom";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import SearchBar from '../movies_search/SearchBar';
import MovieList from '../movies_search/MovieList';

import { Container, Navbar, Nav } from "react-bootstrap";
import { logout } from "../login/LoginActions";

const Dashboard = (props) => {
  const navigate = useNavigate();
  const [movies, setMovies] = useState([]);

  const onLogout = () => {
    props.logout();
    navigate("/"); // Redirect to home after logout
  };

  const handleSearch = async (query) => {
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
  };


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
          {/* <Navbar.Text>
            User: <b>{username}</b>
          </Navbar.Text> */}
          <Nav.Link onClick={onLogout}>Logout</Nav.Link>
        </Navbar.Collapse>
      </Navbar>
      <Container>
        <h1>Dashboard</h1>
        <SearchBar onSearch={handleSearch} />
        <MovieList movies={movies} />
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
