import React from 'react';
import { Link } from "react-router-dom";
import { Redirect } from 'react-router-dom';

import Alert from 'react-bootstrap/Alert';
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

    const { username, password } = e.target;

    if (username.value == '' || password.value == '') {
      this.setState({
        errors: 'please enter your username and password',
      });
      return;
    }

    Meteor.loginWithPassword(username.value, password.value, (err) => {
      if (err) {
        console.error(err.reason);
        this.setState({
          errors: err.reason,
        });
        return;
      }

      this.props.history.replace("/lobby");
    });
  }

  render() {
    return (
        <Row style={{ marginTop: 20 }}>
          <Col sm={{ span: 6, offset: 3 }} md={{ span: 4, offset: 4 }}>
            <Card>
              <Card.Body>
                {this.state.errors != '' && <Alert style={{ marginTop: 5 }} variant="danger">{this.state.errors}</Alert>}
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
                    <Col xs={12}>
                      <Button type="submit">Login</Button>
                      <Link className="btn btn-light float-right" to="/register">Register</Link>
                    </Col>
                  </Row>
                </Form>
              </Card.Body>
            </Card>
          </Col>
        </Row>
    );
  }
}

export default Login;
