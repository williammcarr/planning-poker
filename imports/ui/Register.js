import React from 'react';
import { Redirect } from 'react-router-dom';

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

        this.props.history.replace("/login");
      });
    }
  }

  register() {
    return(
      <React.Fragment>
        <Row>
          <Col xs={{ span: 4, offset: 4 }}>
            <h3 style={{textAlign: 'center'}}>Create an Account</h3>
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
                  <div style={{textAlign: 'center'}}>
                    <Button type="submit">Register</Button>
                  </div>
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