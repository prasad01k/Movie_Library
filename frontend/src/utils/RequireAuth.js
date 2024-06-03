import React from "react";
import { connect } from "react-redux";
import { push } from "@lagunovsky/redux-react-router";
import PropTypes from "prop-types";

export default function requireAuth(Component) {
  class AuthenticatedComponent extends React.Component {
    // constructor(props) {
    //   super(props);
    // }

    componentDidMount() {
      this.checkAuth();
    }

    componentDidUpdate(prevProps) {
      if (prevProps.isAuthenticated !== this.props.isAuthenticated) {
        this.checkAuth();
      }
    }

    checkAuth() {
      if (!this.props.isAuthenticated) {
        const redirectAfterLogin = this.props.location?.pathname || "/"; 
        this.props.dispatch(push(`/login?next=${redirectAfterLogin}`));
      }
    }

    render() {
      return (
        <div>
          {this.props.isAuthenticated ? (
            <Component {...this.props} />
          ) : null}
        </div>
      );
    }
  }

  AuthenticatedComponent.propTypes = {
    isAuthenticated: PropTypes.bool.isRequired,
    location: PropTypes.shape({
      pathname: PropTypes.string,
    }),
    dispatch: PropTypes.func.isRequired,
  };

  const mapStateToProps = (state) => ({
    isAuthenticated: state.auth.isAuthenticated,
    token: state.auth.token,
  });

  return connect(mapStateToProps)(AuthenticatedComponent);
}
