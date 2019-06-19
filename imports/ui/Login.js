import React from 'react';
import { Link } from "react-router-dom";
import { Redirect } from 'react-router-dom';

import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';

class Login extends React.Component {
  constructor(props) {
    super(props);
  }

  handleLogin = (e) => {
    e.preventDefault();

    Meteor.loginWithPassword(e.target.username.value, e.target.password.value, (err) => {
      if (err) {
        console.error(err.reason);
        return;
      }

      // Sean: Why does this work but <Redirect to=""> doesnt?
      this.props.history.replace("/");
    });
  }

  login() {
    return(
      <div>
        <h1>Welcome to Planning Poker!</h1>
        <div>
          <p>Need an account?</p><Link to="/register"><Button>Register</Button></Link>
        </div>
        <Form onSubmit={this.handleLogin}>
          <label>
            Username:
            <input name="username"/>
          </label>
          <label>
            Password:
            <input type="password" name="password"/>
          </label>
          <Button type="submit">Login</Button>
        </Form>
      </div>
    );
  }

  render() {
    // Sean: why do I have to wrap this.login in a <div> element?
    if (Meteor.userId()) {
      return <Redirect to="/"/>;
    } else {
      return (
        <div>
          {this.login()}
        </div>
      );
    }
  }
}

export default Login;