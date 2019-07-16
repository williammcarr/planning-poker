import React from 'react';
import { withTracker } from 'meteor/react-meteor-data';

import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Modal from 'react-bootstrap/Modal';

import ChatBox from './ChatBox';
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
    return(
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
    Meteor.logout(() => {
      this.props.history.replace('/')
    });
  }

  render() {
    if (this.props.loading) {
      return <p>Loading...</p>;
    }

    const { messages, rooms } = this.props;

    return (
      <React.Fragment>
        <h1 style={{textAlign: 'center'}}>Welcome to Planning Poker!</h1>
        <div>
          <Button onClick={this.showRoomModal}>Create New Room</Button>
          <Button style={{margin:10}}onClick={this.logout}>logout</Button>
          <RoomList rooms={rooms}/>
          <ChatBox location="lobby" messages={messages}/>
          {this.roomModal()}
        </div>
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
    rooms = Rooms.find({}).fetch();
  }

  return {
    loading,
    messages,
    rooms,
  };
})(Lobby);
