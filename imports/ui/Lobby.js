import React from 'react';
import { withTracker } from 'meteor/react-meteor-data';

import { Tickets } from '../api/tickets.js';

class Lobby extends React.Component {
	constructor(props) {
    super(props);
 
    this.state = {
      ticketName: '',
    };
  }

  updateTicketName = (e) => {
  	this.setState({
  		ticketName: e.target.value,
  	});
  }

	addTicket = (e) => {
		e.preventDefault();
 
    Tickets.insert({
    	text: this.state.ticketName,
    });
 
    this.setState({
  		ticketName: '',
  	});
	}
	
	addTicketForm() {
		return(
			<div>
				<h3>Tickets to Point</h3>

				<form className="new-ticket" onSubmit={this.addTicket}>
				  <input type="text" placeholder="Type to add new ticket" onChange={this.updateTicketName} value={this.state.ticketName} />
				</form>
			</div>
		);
	}

	ticketList() {
		return(
			<div>
				{this.addTicketForm()}
				<ul>
					{this.props.tickets.map((ticket) => (<li key={ticket._id}>{ticket.text}</li>))}
				</ul>
			</div>
		);
	}

	login() {
		return(
			<div>
				<h1>Planning Poker!</h1>
				<form>
					<label>
						Enter your name:
						<input/>
					</label>
					<button>Login</button>
				</form>
			</div>
		);
	}

	render() {
		const loggedIn = true;

		if (!loggedIn) {
			return(
				this.login()
			);
		} else {
			return(
				this.ticketList()
			);
		}
	}
}

export default withTracker(() => {
  return {
    tickets: Tickets.find({}).fetch(),
  };
})(Lobby);