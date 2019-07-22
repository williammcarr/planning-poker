import React from 'react';
import { withRouter } from "react-router-dom";

import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import Col from 'react-bootstrap/Col';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';

class RoomList extends React.Component {
  handleJoinRoom = (e) => {
    const roomId = e.target.value;

    Meteor.call('rooms.join', { roomId }, (err) => {
      if (err) {
        console.error(err.reason);
        return;
      }

      this.props.history.push(`/room/${roomId}`);
    });
  }

  render() {
    const { rooms } = this.props;

    if (!rooms) return null;

    return(
      <React.Fragment>
        <Card className="mt-2">
          <Card.Header>Rooms</Card.Header>
          <Card.Body style={{ padding: '0.5rem', height: '15rem', overflowY: 'scroll' }}>
            {rooms.map((room) => (
              <p style={{ marginBottom: '0.5rem' }}>
                <Button onClick={this.handleJoinRoom} value={room._id} size="sm">Join</Button>
                {' '}
                {room.text}
              </p>
            ))}
          </Card.Body>
        </Card>
      </React.Fragment>
    );
  }
}

export default withRouter(RoomList);
