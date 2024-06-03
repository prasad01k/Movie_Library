import React, { Component } from "react";
import { useNavigate } from "react-router-dom";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import { Container, Button, Row, Col, Form } from "react-bootstrap";
import { login } from "./LoginActions.js"; 
import './Login.css';

const LoginWithNavigation = (props) => {
  const navigate = useNavigate();
  return <Login {...props} navigate={navigate} />;
};

class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      username: "",
      password: ""
    };
  }

  onChange = e => {
    this.setState({ [e.target.name]: e.target.value });
  };

  onLoginClick = e => {
    e.preventDefault();
    const userData = {
      username: this.state.username,
      password: this.state.password
    };
    this.props.login(userData, this.props.navigate);
  };

  render() {
    return (
      <Container className="container">
        <Row className="row">
          <Col md="4">
            <h1 className="title">Login</h1>
            <Form onSubmit={this.onLoginClick}>
              <Form.Group controlId="usernameId">
                <Form.Label>User name</Form.Label>
                <Form.Control
                  type="text"
                  name="username"
                  placeholder="Enter user name"
                  value={this.state.username}
                  onChange={this.onChange}
                />
              </Form.Group>

              <Form.Group controlId="passwordId">
                <Form.Label>Your password</Form.Label>
                <Form.Control
                  type="password"
                  name="password"
                  placeholder="Enter password"
                  value={this.state.password}
                  onChange={this.onChange}
                />
              </Form.Group>
              <Button type="submit" className="btn" color="primary">Login</Button>
            </Form>
            <p className="mt-2">
              Don't have an account? <Link to="/signup">Signup</Link>
            </p>
          </Col>
        </Row>
      </Container>
    );
  }
}

Login.propTypes = {
  login: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired,
  navigate: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
  auth: state.auth
});

export default connect(mapStateToProps, { login })(LoginWithNavigation);
