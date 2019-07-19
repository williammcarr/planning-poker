import React from 'react';

import Badge from 'react-bootstrap/Badge';
import Card from 'react-bootstrap/Card';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';

import values from 'lodash/values';

class PointedTicket extends React.Component {
  render() {
    const ticket = this.props.ticket;

    return(
      <Card style={this.props.style}>
        <Card.Header>{ticket.name}</Card.Header>
        <Card.Body style={{ maxWidth: 254 }}>
          {ticket.description}
          {ticket.status == 'closed' &&
            <Row>
              <Col>
                <Badge variant="secondary" style={{ marginRight: 2 }}>Votes:</Badge>
                {values(ticket.userVotes).map((vote, keyIndex) => (<Badge key={keyIndex} variant="info" style={{ marginRight: 2 }}>{vote}</Badge>))}
              </Col>
            </Row>
          }
        </Card.Body>
        {ticket.points && <Card.Footer>Points: {ticket.points}</Card.Footer>}
        {!ticket.points && <Card.Footer>Closed</Card.Footer>}
      </Card>
    );
  }
}

export default PointedTicket;
