import React from 'react';
import { Link, Redirect } from 'react-router-dom';

import Alert from 'react-bootstrap/Alert';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';

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

        Meteor.loginWithPassword(username, password, (err) => {
          if (err) {
            console.error(err.reason);
            return;
          }

          this.props.history.replace("/");
        });
      });
    }
  }

  register() {
    return(
      <React.Fragment>
        <Row>
          <Col xs={{ span: 4, offset: 4 }}>
            <h4 style={{textAlign: 'center'}}>Create an Account</h4>
            <Card>
              <Card.Body>
                <Form onSubmit={this.handleRegistration}>
                  <Form.Group>
                    <Form.Label>Username:</Form.Label>
                    <Form.Control type="input" name="username"></Form.Control>
                  </Form.Group>
                  <Form.Group>
                    <Form.Label>Password:</Form.Label>
                    <Form.Control type="password" name="password"></Form.Control>
                  </Form.Group>
                  <Form.Group>
                    <Form.Label>Re-enter password:</Form.Label>
                    <Form.Control type="password" name="matchPassword"></Form.Control>
                    {this.state.errors != '' && <Alert variant="danger">{this.state.errors}</Alert>}
                  </Form.Group>
                  <Row>
                    <Col xs={12}>
                      <Button type="submit">Register</Button>
                      <Link className="btn btn-light float-right" to="/login">Login</Link>
                    </Col>
                  </Row>
                </Form>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </React.Fragment>
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
