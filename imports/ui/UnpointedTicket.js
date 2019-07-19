import React from 'react';

import Badge from 'react-bootstrap/Badge';
import Button from 'react-bootstrap/Button';
import ButtonGroup from 'react-bootstrap/ButtonGroup';
import Card from 'react-bootstrap/Card';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';

import get from 'lodash/get';
import values from 'lodash/values';

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

  updateTicketStatus = (status) => {
    const ticketId = this.props.ticket._id;

    const params = {
      ticketId: ticketId,
      status: status,
    }

    if (status == 'revote') {
      Meteor.call('tickets.clearVotes', { ticketId });
    }

    Meteor.call('tickets.updateStatus', params);
  }

  render() {
    const ticket = this.props.ticket;
    const userId = Meteor.user()._id;
    const vote = get(ticket, `userVotes.${userId}`, null);
    const pastVote = get(ticket, `pastVotes.${userId}`, null);
    const voteValues = ['1', '2', '3', '5', '8', '13'];

    return(
      <Card style={this.props.style}>
        <Card.Header><a href={`https://on-site.atlassian.net/browse/${ticket.name}`} target="_blank">{ticket.name}</a></Card.Header>
        <Card.Body style={{ maxWidth: 254 }}>
          {ticket.description}
          {ticket.status == 'revote' &&
            <Row>
              <Col>
                <Badge variant="secondary" style={{ marginRight: 2 }}>Votes:</Badge>
                {values(ticket.pastVotes).map((vote, keyIndex) => (<Badge key={keyIndex} variant="info" style={{ marginRight: 2 }}>{vote}</Badge>))}
              </Col>
            </Row>
          }
        </Card.Body>
        <Card.Footer>
          {ticket.status == 'new' && <Button onClick={this.handlePointing}>Point This Ticket</Button>}
          {ticket.status == 'discuss' &&
            <React.Fragment>
              <Button onClick={() => this.updateTicketStatus('revote')}>Re-Vote</Button>
              <Button style={{ float: 'right' }} onClick={() => this.updateTicketStatus('closed')}>Close</Button>
            </React.Fragment>
          }
          {(ticket.status == 'active' || ticket.status == 'revote') &&
            <ButtonGroup>
              {voteValues.map((value) => {
                let active = { active: (vote === value || (pastVote === value && vote == null)) };
                return <Button variant="outline-info" key={value} {...active} onClick={this.handleVote} value={value}>{value}</Button>;
              })}
            </ButtonGroup>
          }
        </Card.Footer>
      </Card>
    );
  }
}

export default UnpointedTicket;
