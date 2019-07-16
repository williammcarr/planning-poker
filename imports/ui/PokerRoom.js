import React from 'react';
import { Link } from "react-router-dom";
import { withTracker } from 'meteor/react-meteor-data';

import partition from 'lodash/partition';
import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Modal from 'react-bootstrap/Modal';
import Row from 'react-bootstrap/Row';

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

    const params = {
      name: this.state.ticketName,
      description: this.state.ticketDescription,
      roomId: this.props.room._id,
    };

    Meteor.call('tickets.insert', params, (err) => {
      if (err) {
        console.error(err.reason);
        return;
      }

      this.setState({
        ticketName: '',
        ticketDescription: '',
        showTicketModal: false,
      });
    });
  }

  showTicketModal = () => {
    this.setState({ showTicketModal: true });
  };

  hideTicketModal = () => {
    this.setState({ showTicketModal: false });
  };

  handleLeaveRoom = () => {
    const roomId = this.props.room._id;

    Meteor.call('rooms.leave', { roomId }, (err) => {
      if (err) {
        console.error(err.reason);
        return;
      }

      this.props.history.replace("/");
    });
  }

  modals() {
    return(
      <Modal show={this.state.showTicketModal} onHide={this.hideTicketModal}>
        <Form onSubmit={this.addTicket}>
          <Modal.Header closeButton>
            <Modal.Title>Add Ticket</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form.Group>
              <Form.Label>Enter Ticket Name:</Form.Label>
              <Form.Control type="text" onChange={this.updateTicketName} value={this.state.ticketName} placeholder="IN-1234" />
              <Form.Text className="text-muted">
                Use a ticket number, this turns into a link to JIRA.
              </Form.Text>
            </Form.Group>
            <Form.Group>
              <Form.Label>Enter Ticket Description:</Form.Label>
              <Form.Control type="text" onChange={this.updateTicketDescription} value={this.state.ticketDescription} />
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button type="submit">Add</Button>
          </Modal.Footer>
        </Form>
      </Modal>
    );
  }

  render() {
    if (!Meteor.userId()) {
      this.props.history.push('/login');
      return;
    } else if (this.props.loading) {
      return <p>Loading...</p>;
    }

    const { room, messages, pointedTickets, unpointedTickets } = this.props;

    return (
      <div>
        <Button onClick={this.handleLeaveRoom} variant="light">Return to Lobby</Button>
        <h3 style={{textAlign: 'center'}}>{room.text}</h3>
        <div>
          <Button onClick={this.showTicketModal}>Add Ticket</Button>
          <Row>
            <Col className="xs-6">
              <TicketList tickets={unpointedTickets} pointed={false}/>
            </Col>
            <Col className="xs-6">
              <TicketList tickets={pointedTickets} pointed={true}/>
            </Col>
          </Row>
        </div>
        <div>
          <ChatBox location={room._id} messages={messages}/>
        </div>
        {this.modals()}
      </div>
    );
  }
}

export default withTracker((route) => {
  const roomId = route.match.params.id;
  const messagesHandle = Meteor.subscribe('messages', roomId);
  const roomHandle = Meteor.subscribe('room', roomId);
  const ticketsHandle = Meteor.subscribe('tickets', roomId);
  const loading = !ticketsHandle.ready() || !messagesHandle.ready() || !roomHandle.ready();

  let messages = [];
  let pointedTickets = [];
  let room = {};
  let unpointedTickets = [];

  if (!loading) {
    let tickets = Tickets.find({ roomId }).fetch();
    let partitionedTickets = partition(tickets, (ticket) => ticket.points >= 1);
    pointedTickets = partitionedTickets[0];
    unpointedTickets = partitionedTickets[1];

    room = Rooms.findOne(roomId);
    messages = Messages.find({ location: roomId }, { sort: { createdAt: 1 } }).fetch();
  }

  return {
    loading,
    messages,
    pointedTickets,
    room,
    unpointedTickets,
  };
})(PokerRoom);
