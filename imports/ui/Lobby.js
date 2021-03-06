import React from 'react';
import { withTracker } from 'meteor/react-meteor-data';

import Button from 'react-bootstrap/Button';
import CardDeck from 'react-bootstrap/CardDeck';
import Col from 'react-bootstrap/Col';
import Container from 'react-bootstrap/Container';
import Form from 'react-bootstrap/Form';
import Modal from 'react-bootstrap/Modal';
import Row from 'react-bootstrap/Row';

import ChatBox from './ChatBox';
import OnlineUsersList from './OnlineUsersList';
import RoomList from './RoomList';
import { Messages } from '../api/messages.js';
import { Rooms } from '../api/rooms.js';

class Lobby extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      showRoomModal: false,
    };
  }

  showRoomModal = () => {
    this.setState({ showRoomModal: true });
  };

  hideRoomModal = () => {
    this.setState({ showRoomModal: false });
  };

  addRoom = (e) => {
    e.preventDefault();

    const text = e.target.roomname.value;

    Meteor.call('rooms.insert', text, (err, id) => {
      if (err) {
        console.error(err.reason);
        return;
      }

      this.props.history.push(`/room/${id}`);
    });
  }

  roomModal() {
    return (
      <Modal show={this.state.showRoomModal} onHide={this.hideRoomModal}>
        <Form onSubmit={this.addRoom}>
          <Modal.Header closeButton>
            <Modal.Title>Create Room</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form.Group>
              <Form.Label>Enter a room name:</Form.Label>
              <Form.Control type="text" name="roomname" />
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button type="submit">Create</Button>
          </Modal.Footer>
        </Form>
      </Modal>
    );
  }

  logout = () => {
    Meteor.logout((err) => {
      if (err) console.error(err);

      this.props.history.replace('/login');
    });
  }

  render() {
    if (this.props.loading) {
      return <p>Loading...</p>;
    }

    const { messages, rooms } = this.props;

    return (
      <React.Fragment>
        <Row>
          <Col xs={12}>
            <Button variant="danger" onClick={this.showRoomModal}>Create New Room</Button>
            <Button onClick={this.logout} variant="dark" style={{ marginLeft: 10 }}>Logout</Button>
          </Col>
        </Row>
        <Row>
          <Col xs={9}>
            <RoomList rooms={rooms}/>
          </Col>
          <Col xs={3}>
            <OnlineUsersList />
          </Col>
        </Row>
        <Row>
          <Col xs={12}>
            <ChatBox location="lobby" messages={messages}/>
          </Col>
        </Row>
        {this.roomModal()}
      </React.Fragment>
    );
  }
}

export default withTracker(() => {
  const roomHandle = Meteor.subscribe('rooms.all');
  const messagesHandle = Meteor.subscribe('messages', 'lobby');
  const loading = !roomHandle.ready() || !messagesHandle.ready();

  let messages = [];
  let rooms = [];

  if (!loading) {
    messages = Messages.find({location: 'lobby'}, { sort: { createdAt: 1 } }).fetch();
    rooms = Rooms.find({}, { sort: { createdAt: -1 } }).fetch();
  }

  return {
    loading,
    messages,
    rooms,
  };
})(Lobby);
