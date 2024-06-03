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
  onLoginClick = () => {
    const userData = {
      username: this.state.username,
      password: this.state.password
    };
    // Pass the navigate function as redirectTo parameter
    this.props.login(userData, this.props.navigate);
  };//new

  render() {
    return (
      <Container class="container">
        <Row class="row">
          <Col md="4">
            <h1 class="title">Login</h1>
            <Form>
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
            </Form>
            <Button class="btn" color="primary" onClick={this.onLoginClick}>Login</Button>
            <p className="mt-2">
              Don't have account? <Link to="/signup">Signup</Link>
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
