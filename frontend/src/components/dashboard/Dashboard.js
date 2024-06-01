import React from "react";
import { Link, useNavigate } from "react-router-dom";
import PropTypes from "prop-types";
import { connect } from "react-redux";

import { Container, Navbar, Nav } from "react-bootstrap";
import { logout } from "../login/LoginActions";

const Dashboard = (props) => {
  const navigate = useNavigate();

  const onLogout = () => {
    props.logout();
    navigate("/"); // Redirect to home after logout
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
