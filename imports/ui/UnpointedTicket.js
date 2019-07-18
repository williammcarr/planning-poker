import React from 'react';

import Button from 'react-bootstrap/Button';
import ButtonGroup from 'react-bootstrap/ButtonGroup';
import Card from 'react-bootstrap/Card';

import get from 'lodash/get';

import { Tickets } from '../api/tickets.js';

class UnpointedTicket extends React.Component {
  handlePointing = () => {
    Tickets.update(
      {_id: this.props.ticket._id},
      {$set: { status: 'active' } }
    );
  }

  handleVote = (e) => {
    const params = {
      ticketId: this.props.ticket._id,
      voteValue: e.target.value,
      voters: this.props.voters,
    }

    Meteor.call('tickets.vote', params);
  }

  render() {
    const ticket = this.props.ticket;
    const userId = Meteor.user()._id;
    // if we have voted on this ticket we need to show how many points
    const vote = get(ticket, `userVotes.${userId}`, null);
    const voteValues = ['1', '2', '3', '5', '8', '13'];

    return(
      <React.Fragment>
        <Card.Header><a href={`https://on-site.atlassian.net/browse/${ticket.name}`} target="_blank">{ticket.name}</a></Card.Header>
        <Card.Body>{ticket.description}</Card.Body>
        <Card.Footer>
          {ticket.status == 'new' && <Button onClick={this.handlePointing}>Point This Ticket</Button>}
          {ticket.status == 'active' &&
            <ButtonGroup>
              {voteValues.map((value) => {
                let active = { active: vote === value };
                return <Button key={value} {...active} onClick={this.handleVote} value={value}>{value}</Button>;
              })}
            </ButtonGroup>
          }
        </Card.Footer>
      </React.Fragment>
    );
  }
}

export default UnpointedTicket;
