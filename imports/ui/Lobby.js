import React from 'react';
import { Random } from 'meteor/random';
import { withTracker } from 'meteor/react-meteor-data';

import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Modal from 'react-bootstrap/Modal';
import Table from 'react-bootstrap/Table';

import ChatBox from './ChatBox';
import RoomList from './RoomList';
import { Messages } from '../api/messages.js';
import { Rooms } from '../api/rooms.js';

class Lobby extends React.Component {
	constructor(props) {
    super(props);

    this.state = {
    	roomName: '',
    	userName: '',
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

  updateUserName = (e) => {
  	this.setState({
  		userName: e.target.value,
  	});
  }

	addRoom = (e) => {
		e.preventDefault();

    Rooms.insert({
    	text: this.state.roomName,
    	userId: localStorage.getItem('userId'),
    	userName: localStorage.getItem('userName'),
      voters: [],
    });

    this.setState({
  		roomName: '',
  		showRoomModal: false,
  	});
	}

	handleLogin = () => {
		localStorage.setItem('userId', Random.id());
		localStorage.setItem('userName', this.state.userName);
	}

	login() {
		return(
			<div>
				<h1>Planning Poker!</h1>
				<form onSubmit={this.handleLogin}>
					<label>
						Enter your name:
						<input value={this.state.userName} onChange={this.updateUserName}/>
					</label>
					<Button type="submit">Login</Button>
				</form>
			</div>
		);
	}

	modals() {
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
		const loggedIn = localStorage.getItem('userId') !== null;

		if (!loggedIn) {
			return(
				this.login()
			);
		} else {
			return(
				<React.Fragment>
					<h1 style={{textAlign: 'center'}}>Welcome to Planning Poker!</h1>
					<div>
		        <Button onClick={this.showRoomModal}>Create New Room</Button>
						<RoomList rooms={this.props.rooms}/>
						<ChatBox location="lobby" messages={this.props.messages}/>
						{this.modals()}
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
