import React from 'react';

class OnlineUsers extends React.Component {
  statusPill = (user) => {
    let statusClass = "";

    if (user.status && user.status.online) {
      statusClass = "#5cb85c";
    } else if (user.status && user.status.idle) {
      statusClass = "#f0ad4e";
    }

    return (
      <span key={user._id} style={{ backgroundColor: statusClass,  fontWeight: 'normal', marginLeft: 2, marginRight: 2 }} className={`badge`}>{user.username}</span>
    );
  }

  render() {
    return (
      <div>
        <p>OnlineUsers</p>
        <p>
          {this.props.users.map((a) => (this.statusPill(a)))}
        </p>
      </div>
    );
  }
}

export default OnlineUsers;
