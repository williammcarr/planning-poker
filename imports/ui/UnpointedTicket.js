import React from 'react';

import Button from 'react-bootstrap/Button';
import ButtonGroup from 'react-bootstrap/ButtonGroup';
import Card from 'react-bootstrap/Card';

import { Tickets } from '../api/tickets.js';

class UnpointedTicket extends React.Component {
  handlePointing = () => {
    Tickets.update(
      {_id: this.props.ticket._id},
      {$set: { status: 'active' } }
    );
  }

  handleVote = (e) => {
    const userId = localStorage.getItem('userId');
    const string = `userVotes.${userId}`;

    Tickets.update(
      {_id: this.props.ticket._id},
      {$set: { [string]: e.target.value } }
    );
  }

  render() {
    const ticket = this.props.ticket;

    return(
      <React.Fragment>
        <Card.Header><a href={`https://on-site.atlassian.net/browse/${ticket.name}`} target="_blank">{ticket.name}</a></Card.Header>
        <Card.Body>{ticket.description}</Card.Body>
        <Card.Footer>
          {ticket.status == 'new' && <Button onClick={this.handlePointing}>Point This Ticket</Button>}
          {ticket.status == 'active' &&
            <ButtonGroup>
              <Button onClick={this.handleVote} value="1">1</Button>
              <Button onClick={this.handleVote} value="2">2</Button>
              <Button onClick={this.handleVote} value="3">3</Button>
              <Button onClick={this.handleVote} value="5">5</Button>
              <Button onClick={this.handleVote} value="8">8</Button>
              <Button onClick={this.handleVote} value="13">13</Button>
            </ButtonGroup>
          }
        </Card.Footer>
      </React.Fragment>
    );
  }
}

export default UnpointedTicket;
