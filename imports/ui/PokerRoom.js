import React from 'react';
import { Link } from "react-router-dom";
import { withTracker } from 'meteor/react-meteor-data';

import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

import ChatBox from './ChatBox';
import { Messages } from '../api/messages.js';
import { Rooms } from '../api/rooms.js';
import TicketList from './TicketList';
import { Tickets } from '../api/tickets.js';

class PokerRoom extends React.Component {
  constructor(props) {
    super(props);
 
    this.state = {
      roomId: null,
      ticketDescription: '',
      ticketName: '',
      showTicketModal: false,
    };
  }

  updateTicketName = (e) => {
    this.setState({
      ticketName: e.target.value,
    });
  }

  updateTicketDescription = (e) => {
    this.setState({
      ticketDescription: e.target.value,
    });
  }

  addTicket = (e) => {
    e.preventDefault();
 
    Tickets.insert({
      name: this.state.ticketName,
      description: this.state.ticketDescription,
      roomId: this.props.room._id,
      points: null,
    });
 
    this.setState({
      ticketName: '',
      ticketDescription: '',
      showTicketModal: false,
    });
  }

  showTicketModal = () => {
    this.setState({ showTicketModal: true });
  };

  modals() {
    return(
      <Modal show={this.state.showTicketModal}>
        <Modal.Header>
          <Modal.Title>Create Ticket</Modal.Title>
        </Modal.Header>
        <form onSubmit={this.addTicket}>
          <Modal.Body>
            <label>Enter Ticket Name:
            <input type="text" onChange={this.updateTicketName} value={this.state.ticketName} />
            </label>
            <label>Enter Ticket description:
            <input type="text" onChange={this.updateTicketDescription} value={this.state.ticketDescription} />
            </label>
          </Modal.Body>
          <Modal.Footer>
            <Button type="submit">Create Ticket</Button>
          </Modal.Footer>
        </form>
      </Modal>
    );
  }

  render() {
    if(this.props.room == null || this.props.tickets == null) {
      return (
        <p>Loading...</p>
      );
    }

    return(
      <div>
        <Link to="/"><Button>Return to Lobby</Button></Link>
        <h3 style={{textAlign: 'center'}}>{this.props.room.text}</h3>
        <div>
          <Button onClick={this.showTicketModal}>Add Ticket</Button>
          <Row>
            <Col className="xs-6">
              <TicketList tickets={this.props.unpointedTickets} room={this.props.room} title="Unpointed Tickets"/>
            </Col>
            <Col className="xs-6">
              <TicketList tickets={this.props.pointedTickets} room={this.props.room} title="Pointed Tickets"/>
            </Col>
          </Row>
        </div>
        <div>
          <ChatBox location={this.props.room._id} messages={this.props.messages}/>
        </div>
        {this.modals()}
      </div>
    );
  }
}

export default withTracker((route) => {
  const roomId = route.match.params.id;

  return {
    tickets: Tickets.find({roomId}).fetch(),
    pointedTickets: Tickets.find({roomId: roomId, points: { $gte: 1 }}).fetch(),
    unpointedTickets: Tickets.find({roomId: roomId, points: null }).fetch(),
    room: Rooms.findOne({_id: roomId}),
    messages: Messages.find({location: roomId}).fetch(),
  };
})(PokerRoom);