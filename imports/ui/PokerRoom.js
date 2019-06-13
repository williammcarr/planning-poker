import React from 'react';
import { withTracker } from 'meteor/react-meteor-data';

import { Tickets } from '../api/tickets.js';
import { Rooms } from '../api/rooms.js';

import { Link } from "react-router-dom";

class PokerRoom extends React.Component {
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
      roomId: this.props.room._id
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
        <h3 style={{textAlign: 'center'}}>{this.props.room.text}</h3>
        {this.addTicketForm()}
        <ul>
          {this.props.tickets.map((ticket) => (<li key={ticket._id}>{ticket.text}</li>))}
        </ul>
      </div>
    );
  }

  render() {
    if(this.props.room == null || this.props.tickets == null) {
      return (
        <p>Loading...</p>
      );
    }

    return(
      <div>
        <Link to="/"><button>Return to Lobby</button></Link>
        <div>
          {this.ticketList()}
        </div>
      </div>
    );
  }
}

export default withTracker((route) => {
  const roomId = route.match.params.id;

  return {
    tickets: Tickets.find({roomId}).fetch(),
    room: Rooms.findOne({_id: roomId}),
  };
})(PokerRoom);