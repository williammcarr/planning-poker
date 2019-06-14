import React from 'react';
import { Link } from "react-router-dom";

import Button from 'react-bootstrap/Button';
import Table from 'react-bootstrap/Table';

class RoomList extends React.Component {
  render() {
    return(
      <React.Fragment>
        <Table responsive striped hover bordered className="mt-4" style={{maxHeight: '500px', width: '60%'}}>
          <thead><tr><td colSpan="2">Open Rooms</td></tr></thead>
          <tbody>
            {this.props.rooms.map((room) => (
              <tr key={room._id}>
                <td width="100px">
                  <Link to={`/room/${room._id}`}><Button>Join</Button></Link>
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

export default RoomList;
