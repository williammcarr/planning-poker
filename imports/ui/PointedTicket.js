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
      <React.Fragment>
        <Card.Header>{ticket.name}</Card.Header>
        <Card.Body>
          {ticket.description}
          {ticket.status == 'closed' && 
            <Row>
              <Col>
                <Badge variant="secondary" style={{marginRight: '2px'}}>Votes:</Badge>
                {values(ticket.userVotes).map((vote, keyIndex) => (<Badge key={keyIndex} variant="info" style={{marginRight: '2px'}}>{vote}</Badge>))}
              </Col>
            </Row>
          }
        </Card.Body>
        {ticket.points && <Card.Footer>Points: {ticket.points}</Card.Footer>}
        {ticket.points == null && <Card.Footer>Closed</Card.Footer>}
      </React.Fragment>
    );
  }
}

export default PointedTicket;