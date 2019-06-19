import React from 'react';
import { Link } from "react-router-dom";
import { Redirect } from 'react-router-dom';

import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';

class Login extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      errors: '',
    };
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
      <React.Fragment>
        <h1 style={{textAlign: 'center'}}>Welcome to Planning Poker!</h1>
        <Row style={{marginTop: '100px'}}>
          <Col xs={{ span: 4, offset: 4 }}>
            <Card>
              <Card.Body>
                <Form onSubmit={this.handleLogin}>
                  <Form.Group>
                    <Form.Label>Username:</Form.Label>
                    <Form.Control type="input" name="username"></Form.Control>
                  </Form.Group>
                  <Form.Group>
                    <Form.Label>Password:</Form.Label>
                    <Form.Control type="password" name="password"></Form.Control>
                  </Form.Group>
                  <Row>
                    <Col xs>
                      <Button type="submit">Login</Button>
                    </Col>
                    <Col xs>
                      <div style={{textAlign: 'right'}}>
                        <Link to="/register"><Button>Register</Button></Link>
                      </div>
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