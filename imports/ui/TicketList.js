import React from 'react';

import Card from 'react-bootstrap/Card';
import CardColumns from 'react-bootstrap/CardColumns';

import UnpointedTicket from './UnpointedTicket';
import PointedTicket from './PointedTicket';

class TicketList extends React.Component {
  render() {

    const TicketComponent = this.props.pointed ? PointedTicket : UnpointedTicket;
    const title = this.props.pointed ? "Pointed Tickets" : "Unpointed Tickets";

    return(
      <React.Fragment>
        <Card className="mt-4" style={{minHeight: '300px'}}>
          <Card.Header>{title}</Card.Header>
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