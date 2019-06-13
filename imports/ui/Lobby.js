import React from 'react';
import { withTracker } from 'meteor/react-meteor-data';
import { Random } from 'meteor/random';

import { Rooms } from '../api/rooms.js';
import Modal from './Modal';
import { Link } from "react-router-dom";

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
    });
 
    this.setState({
  		roomName: '',
  		showRoomModal: false,
  	});
	}

	roomList() {
		return(
			<div>
				<h3>Open Rooms</h3>
				<div style={{border: 'solid black 1px', padding: '10px'}}>
					{this.props.rooms.map((room) => (
						<div key={room._id} style={{marginTop: '5px', marginBottom: '5px'}}>
							<div style={{display: 'inline-block'}}><Link style={{marginLeft: '15px'}} to={`/room/${room._id}`}><button>Join</button></Link></div><div style={{display: 'inline-block', marginLeft: '15px'}}>{room.text}</div>
						</div>
					))}
				</div>
			</div>
		);
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
					<button>Login</button>
				</form>
			</div>
		);
	}

	modals() {
		return(
			<Modal show={this.state.showRoomModal} handleClose={this.addRoom}>
      	<label>Enter a room name:
			  <input type="text" onChange={this.updateRoomName} value={this.state.roomName} />
			  </label>
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
				<div>
	        <button onClick={this.showRoomModal}>Create New Room</button>
					{this.roomList()}
					{this.modals()}
				</div>
			);
		}
	}
}

export default withTracker(() => {
  return {
    rooms: Rooms.find({}).fetch(),
  };
})(Lobby);