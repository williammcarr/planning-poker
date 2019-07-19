import React from 'react';

import Card from 'react-bootstrap/Card';
import CardDeck from 'react-bootstrap/CardDeck';

import UnpointedTicket from './UnpointedTicket';
import PointedTicket from './PointedTicket';

class TicketList extends React.Component {
  render() {
    const TicketComponent = this.props.pointed ? PointedTicket : UnpointedTicket;
    const title = this.props.pointed ? "Pointed Tickets" : "Unpointed Tickets";

    return(
      <React.Fragment>
        <Card className="mt-2" style={{ minHeight: 300 }}>
          <Card.Header>{title}</Card.Header>
          <Card.Body style={{ padding: 5 }}>
            <CardDeck style={{ display: 'inline-flex', flexWrap: 'wrap' }}>
              {this.props.tickets.map(ticket => <TicketComponent style={{ marginBottom: 5, flex: '0 0 auto' }} key={ticket._id} voters={this.props.voters} ticket={ticket} />)}
            </CardDeck>
          </Card.Body>
        </Card>
      </React.Fragment>
    );
  }
}

export default TicketList;
