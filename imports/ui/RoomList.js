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
          <Card.Body style={{padding: '5px', height: 300, overflowY: 'scroll'}}>
            {rooms.map((room) => (
              <Container key={room._id} style={{height: '31px', margin: '7px'}}>
                <Row>
                  <Col xs="auto" style={{paddingLeft: 0, paddingRight: 0}}>
                    <Button style={{marginTop: 'auto', marginBottom: 'auto'}} onClick={this.handleJoinRoom} value={room._id} size="sm">Join</Button>
                  </Col>
                  <Col style={{paddingLeft: 0, marginLeft: 10, marginTop: 5}}>{room.text}</Col>
                </Row>
              </Container>
            ))}
          </Card.Body>
        </Card>
      </React.Fragment>
    );
  }
}

export default withRouter(RoomList);
