import React from 'react';
import { withTracker } from 'meteor/react-meteor-data';

import Card from 'react-bootstrap/Card';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';

class OnlineUsersList extends React.Component {
  render() {
    const { rooms, users } = this.props;
    const title = this.props.title != null ? this.props.title : "Users Online"


    return(
      <React.Fragment>
        <Card className="mt-2" style={{marginLeft: 0, marginRight: 0}}>
          <Card.Header>{title}</Card.Header>
          <Card.Body style={{ padding: '0.5rem', minHeight: '5rem', maxHeight: '15rem', overflowY: 'scroll' }}>
            <dl>
              {users.map((user, index) => {
                return (user.status && user.status.online && 
                        <Row key={index} style={{padding: 2}}>
                          <Col xs={4}>
                            <dt style={{padding: 5}}>{user.username}</dt>
                          </Col>
                        </Row>
                );
              })}
            </dl>
          </Card.Body>
        </Card>
      </React.Fragment>
    );
  }
}

export default withTracker(() => {
  const usersHandle = Meteor.subscribe('users');
  const loading = !usersHandle.ready();

  let users = [];

  if (!loading) {
    users = Meteor.users.find().fetch();
  }

  return {
    users,
  };
})(OnlineUsersList);