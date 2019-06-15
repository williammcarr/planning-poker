import React from 'react';
import { Link } from "react-router-dom";
import { withTracker } from 'meteor/react-meteor-data';

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

    Tickets.insert({
      name: this.state.ticketName,
      description: this.state.ticketDescription,
      roomId: this.props.room._id,
      points: null,
      status: 'new',
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

  hideTicketModal = () => {
    this.setState({ showTicketModal: false });
  };

  handleLeaveRoom = () => {
    const roomId = this.props.room._id;
    // we should get real user id username
    const userId = localStorage.getItem('userId');
    const userName = localStorage.getItem('userName');

    Meteor.call('rooms.leave', { roomId, userId, userName }, (err) => {
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
    const loggedIn = localStorage.getItem('userId') !== null;

    if (!loggedIn) {
        this.props.history.push('/');
    }

    if(this.props.room == null || this.props.tickets == null) {
      return (
        <p>Loading...</p>
      );
    }

    return(
      <div>
        <Button onClick={this.handleLeaveRoom} variant="light">Return to Lobby</Button>
        <h3 style={{textAlign: 'center'}}>{this.props.room.text}</h3>
        <div>
          <Button onClick={this.showTicketModal}>Add Ticket</Button>
          <Row>
            <Col className="xs-6">
              <TicketList tickets={this.props.unpointedTickets} pointed={false}/>
            </Col>
            <Col className="xs-6">
              <TicketList tickets={this.props.pointedTickets} pointed={true}/>
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
