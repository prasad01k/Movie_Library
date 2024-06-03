import React, { Component } from "react";
import { Link } from "react-router-dom";
import { Container, Navbar, Nav } from "react-bootstrap";
import './Home.css';

class Home extends Component {
    render() {
        return (
            <div className="home-container">
                <Navbar bg="dark" variant="dark" expand="lg">
                    <Navbar.Brand href="/">Home</Navbar.Brand>
                    <Navbar.Toggle aria-controls="basic-navbar-nav" />
                    <Navbar.Collapse id="basic-navbar-nav">
                        <Nav className="mr-auto">
                            <Nav.Link as={Link} to="/dashboard" className="home-link">Dashboard</Nav.Link>
                        </Nav>
                        <Nav className="ml-auto">
                            <Nav.Link as={Link} to="/login/" className="home-link">Login</Nav.Link>
                            <Nav.Link as={Link} to="/signup" className="home-link">Sign up</Nav.Link>
                        </Nav>
                    </Navbar.Collapse>
                </Navbar>
                <Container className="home-content">
                    <h1 className="home-title">Welcome to the Home Page</h1>
                </Container>
            </div>
        );
    }
}

export default Home;
