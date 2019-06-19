import React from 'react';
import { Redirect } from 'react-router-dom';

import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';

class Register extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      errors: '',
    };
  }

  handleRegistration = (e) => {
    e.preventDefault();

    const username = e.target.username.value;
    const password = e.target.password.value;
    const matchPassword = e.target.matchPassword.value;

    if (password != matchPassword) {
      this.setState({
        errors: "Your password does not match!",
      });
    } else {
      Meteor.call('users.register', { username, password }, (err) => {
        if (err) {
          console.error(err);
          return;
        }

        this.props.history.replace("/login");
      });
    }
  }

  register() {
    return(
      <div>
        <Form onSubmit={this.handleRegistration}>
          <label>
            Username:
            <input name="username"/>
          </label>
          <label>
            Password:
            <input type="password" name="password"/>
          </label>
          <label>
            Re-enter password:
            <input type="password" name="matchPassword"/>
          </label>
          {this.state.errors != '' && <label>{this.state.errors}</label>}
          <Button type="submit">Register</Button>
        </Form>
      </div>
    );
  }

  render() {
    if (Meteor.userId()) {
      return <Redirect to="/"/>;
    } else {
      return (
        <div>
          {this.register()}
        </div>
      );
    }
  }
}

export default Register;