import React from 'react';

import Card from 'react-bootstrap/Card';

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
            {this.props.tickets.map((ticket) => (
                <div key={ticket._id} style={{float: 'left', padding: '5px'}}>
                  <TicketComponent ticket={ticket} />
                </div>
              )
            )}
          </Card.Body>
        </Card>
      </React.Fragment>
    );
  }
}

export default TicketList;