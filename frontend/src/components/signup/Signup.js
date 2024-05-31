import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { connect } from "react-redux"; 
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import {
  Container,
  Button,
  Row,
  Col,
  Form,
  FormControl
} from "react-bootstrap";

import { signupNewUser } from "./SignupActions";

const Signup = ({ signupNewUser, createUser }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate(); 

  const onChange = (e) => {
    const { name, value } = e.target;
    switch (name) {
      case "username":
        setUsername(value);
        break;
      case "password":
        setPassword(value);
        break;
      default:
        break;
    }
  };

  const onSignupClick = () => {
    const userData = {
      username,
      password,
    };
    signupNewUser(userData); 
  };

  return (
    <Container>
      <Row>
        <Col md="4">
          <h1>Sign up</h1>
          <Form>
            <Form.Group controlId="usernameId">
              <Form.Label>User name</Form.Label>
              <Form.Control
                isInvalid={createUser.usernameError}
                type="text"
                name="username"
                placeholder="Enter user name"
                value={username}
                onChange={onChange}
              />
              <FormControl.Feedback type="invalid">
                {createUser.usernameError}
              </FormControl.Feedback>
            </Form.Group>

            <Form.Group controlId="passwordId">
              <Form.Label>Your password</Form.Label>
              <Form.Control
                isInvalid={createUser.passwordError}
                type="password"
                name="password"
                placeholder="Enter password"
                value={password}
                onChange={onChange}
              />
              <FormControl.Feedback type="invalid">
                {createUser.passwordError}
              </FormControl.Feedback>
            </Form.Group>
          </Form>
          <Button color="primary" onClick={onSignupClick}>
            Sign up
          </Button>
          <p className="mt-2">
            Already have account? <Link to="/login">Login</Link>
          </p>
        </Col>
      </Row>
    </Container>
  );
};

Signup.propTypes = {
  signupNewUser: PropTypes.func.isRequired,
  createUser: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  createUser: state.createUser,
});

export default connect(mapStateToProps, { signupNewUser })(Signup);
