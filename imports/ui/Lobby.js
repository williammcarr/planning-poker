import React from 'react';
import { withTracker } from 'meteor/react-meteor-data';
import { Random } from 'meteor/random';

import { Rooms } from '../api/rooms.js';
import { Link } from "react-router-dom";

class Lobby extends React.Component {
	constructor(props) {
    super(props);
 
    this.state = {
    	roomName: '',
    	userName: '',
    };
  }

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
  	});
	}
	
	roomForm() {
		return(
			<div>
				<form className="new-room" onSubmit={this.addRoom}>
				  <input type="text" placeholder="Type to add new room" onChange={this.updateRoomName} value={this.state.roomName} />
				</form>
			</div>
		);
	}

	roomList() {
		return(
			<div style={{border: 'solid black 1px'}}>
				<h3>Rooms:</h3>
				{this.roomForm()}
				<ul>
					{this.props.rooms.map((room) => (<li key={room._id}><Link to={`/room/${room._id}`}>{room.text}</Link></li>))}
				</ul>
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

	render() {
		const loggedIn = localStorage.getItem('userId') !== null;

		if (!loggedIn) {
			return(
				this.login()
			);
		} else {
			return(
				this.roomList()
			);
		}
	}
}

export default withTracker(() => {
  return {
    rooms: Rooms.find({}).fetch(),
  };
})(Lobby);