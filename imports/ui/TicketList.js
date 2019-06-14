import React from 'react';

import Card from 'react-bootstrap/Card';
import CardColumns from 'react-bootstrap/CardColumns';

import UnpointedTicket from './UnpointedTicket';
import PointedTicket from './PointedTicket';

class TicketList extends React.Component {
  render() {
    const ticketComponents = {
      "Pointed Tickets": PointedTicket,
      "Unpointed Tickets": UnpointedTicket,
    };

    const TicketComponent = ticketComponents[this.props.title]

    return(
      <React.Fragment>
        <Card className="mt-4" style={{minHeight: '300px'}}>
          <Card.Header>{this.props.title}</Card.Header>
          <Card.Body style={{padding: '5px'}}>
            <CardColumns>
              {this.props.tickets.map((ticket) => (
                  <Card key={ticket._id}>
                    <TicketComponent ticket={ticket} />
                  </Card>
                )
              )}
            </CardColumns>
          </Card.Body>
        </Card>
      </React.Fragment>
    );
  }
}

export default TicketList;