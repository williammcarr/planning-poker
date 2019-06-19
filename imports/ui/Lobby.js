import React from 'react';
import { Redirect } from 'react-router-dom';
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
    	roomName: '',
    	showRoomModal: false,
    };
  }

  showRoomModal = () => {
    this.setState({ showRoomModal: true });
  };

  hideRoomModal = () => {
    this.setState({ showRoomModal: false });
  };

  updateRoomName = (e) => {
  	this.setState({
  		roomName: e.target.value,
  	});
  }

	addRoom = (e) => {
		e.preventDefault();

    Rooms.insert({
    	text: this.state.roomName,
    	userId: Meteor.user()._id,
    	username: Meteor.user().username,
      voters: [],
    });

    this.setState({
  		roomName: '',
  		showRoomModal: false,
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
					    <Form.Control type="text" onChange={this.updateRoomName} value={this.state.roomName} />
					  </Form.Group>
					</Modal.Body>
					<Modal.Footer>
				  	<Button type="submit">Create</Button>
				  </Modal.Footer>
				</Form>
      </Modal>
		);
	}

	render() {
		if (!Meteor.userId()) {
			return <Redirect to="/login"/>;
		} else {
			return(
				<React.Fragment>
					<h1 style={{textAlign: 'center'}}>Welcome to Planning Poker!</h1>
					<div>
		        <Button onClick={this.showRoomModal}>Create New Room</Button>
						<RoomList rooms={this.props.rooms}/>
						<ChatBox location="lobby" messages={this.props.messages}/>
						{this.roomModal()}
					</div>
				</React.Fragment>
			);
		}
	}
}

export default withTracker(() => {
  return {
    rooms: Rooms.find({}).fetch(),
    messages: Messages.find({location: 'lobby'}, { sort: { createdAt: 1 } }).fetch(),
  };
})(Lobby);
