import React from 'react';

import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';

class PointedTicket extends React.Component {
  render() {
    const ticket = this.props.ticket;

    return(
      <React.Fragment>
        <Card>
          <Card.Header>{ticket.name}</Card.Header>
          <Card.Body>{ticket.description}</Card.Body>
          <Card.Footer>Points: {ticket.points}</Card.Footer>
        </Card>
      </React.Fragment>
    );
  }
}

export default PointedTicket;