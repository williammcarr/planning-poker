import React from 'react';
import Container from 'react-bootstrap/Container';

export default class NotFoundPage extends React.Component {
  render() {
    return (
      <Container>
        <h3>Page Not Found</h3>
        <p>Please go back and try again.</p>
      </Container>
    );
  }
}
