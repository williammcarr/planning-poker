import React from 'react';

import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';

import { Tickets } from '../api/tickets.js';

class UnpointedTicket extends React.Component {
  handlePointing = () => {
    Tickets.update(
      {_id: this.props.ticket._id},
      {$set: { points: 5 } }
    );
  }

  render() {
    const ticket = this.props.ticket;

    return(
      <React.Fragment>
        <Card>
          <Card.Header>{ticket.name}</Card.Header>
          <Card.Body>{ticket.description}</Card.Body>
          <Card.Footer><Button onClick={this.handlePointing}>Point This Ticket</Button></Card.Footer>
        </Card>
      </React.Fragment>
    );
  }
}

export default UnpointedTicket;