import React from 'react';

import Card from 'react-bootstrap/Card';

class PointedTicket extends React.Component {
  render() {
    const ticket = this.props.ticket;

    return(
      <React.Fragment>
        <Card.Header>{ticket.name}</Card.Header>
        <Card.Body>{ticket.description}</Card.Body>
        <Card.Footer>Points: {ticket.points}</Card.Footer>
      </React.Fragment>
    );
  }
}

export default PointedTicket;