import React from 'react';
import { withRouter } from "react-router-dom";

import Button from 'react-bootstrap/Button';
import Table from 'react-bootstrap/Table';

class RoomList extends React.Component {
  handleJoinRoom = (evt) => {
    const roomId = evt.target.value;
    // we should get real user id username
    const userId = localStorage.getItem('userId');
    const userName = localStorage.getItem('userName');

    Meteor.call('rooms.join', { roomId, userId, userName }, (err) => {
      if (err) {
        console.error(err.reason);
        return;
      }

      this.props.history.push(`/room/${roomId}`);
    });
  }

  render() {
    return(
      <React.Fragment>
        <Table responsive striped hover bordered className="mt-4" style={{ maxHeight: 300, overflowY: 'scroll' }}>
          <thead><tr><td colSpan="2">Open Rooms</td></tr></thead>
          <tbody>
            {this.props.rooms.map((room) => (
              <tr key={room._id}>
                <td width="100px">
                  <Button onClick={this.handleJoinRoom} value={room._id} size="sm">Join</Button>
                </td>
                <td>
                  {room.text}
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </React.Fragment>
    );
  }
}

export default withRouter(RoomList);
