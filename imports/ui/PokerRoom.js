import React from 'react';
import { Link } from "react-router-dom";
import { Redirect } from 'react-router-dom';
import { withTracker } from 'meteor/react-meteor-data';

import Badge from 'react-bootstrap/Badge';
import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Modal from 'react-bootstrap/Modal';
import Row from 'react-bootstrap/Row';

import partition from 'lodash/partition';

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

      this.props.history.replace("/lobby");
    });
  }

  ticketModal() {
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
    if (this.props.loading) {
      return <p>Loading...</p>;
    }

    const { room, messages, pointedTickets, unpointedTickets } = this.props;

    return (
      <div>
        <h1 style={{ textAlign: 'center' }}>
          <Badge variant="dark" style={{ marginRight: 2 }}>Room:</Badge>
          <Badge variant="success">{room.text}</Badge>
        </h1>
        <div>
          <Button onClick={this.showTicketModal} variant="danger">Add Ticket</Button>
          <Button onClick={this.handleLeaveRoom} variant="dark" style={{ marginRight: 5, marginLeft: 10 }}>Return to Lobby</Button>
          <Row>
            <Col md={6}>
              <TicketList voters={room.voters} tickets={unpointedTickets} pointed={false}/>
            </Col>
            <Col md={6}>
              <TicketList tickets={pointedTickets} pointed={true}/>
            </Col>
          </Row>
        </div>
        <div>
          <ChatBox location={room._id} messages={messages}/>
        </div>
        {this.ticketModal()}
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
    let partitionedTickets = partition(tickets, (ticket) => (ticket.status == 'pointed' || ticket.status == 'closed'));
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
