import React from 'react';
import { withRouter } from "react-router-dom";

import Button from 'react-bootstrap/Button';
import Table from 'react-bootstrap/Table';

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
        <Table responsive striped hover bordered className="mt-4" style={{ maxHeight: 300, overflowY: 'scroll' }}>
          <thead><tr><td colSpan="2">Open Rooms</td></tr></thead>
          <tbody>
            {rooms.map((room) => (
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
