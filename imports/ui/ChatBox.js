import React from 'react';

import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import FormControl from 'react-bootstrap/FormControl';
import InputGroup from 'react-bootstrap/InputGroup';

import get from 'lodash/get';

import { Messages } from '../api/messages.js';

class ChatBox extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      chatMessage: '',
    };

    ChatBox.setUserColors(props.messages);
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    if (prevProps.messages.length !== this.props.messages.length) {
      ChatBox.setUserColors(this.props.messages);
    }
  }

  static setUserColors(messages) {
    let userColors = {};

    if (localStorage.getItem('userColors')) {
      userColors = JSON.parse(localStorage.getItem('userColors'));
    }

    messages.forEach((message) => {
      let colorString = get(userColors, message.userId, false);

      if (!colorString) {
        const randInt = Math.floor(Math.random() * 360);
        const colorInt = randInt - (randInt % 10);

        userColors[message.userId] = `hsl(${colorInt},100%,50%)`;
      }
    });

    localStorage.setItem('userColors', JSON.stringify(userColors));
  }

  chatSubmit = (e) => {
    e.preventDefault();

    Messages.insert({
      text: this.state.chatMessage,
      location: this.props.location,
      userId: localStorage.getItem('userId'),
      userName: localStorage.getItem('userName'),
    });

    this.setState({
      chatMessage: '',
    });
  }

  updateChat = (e) => {
    this.setState({
      chatMessage: e.target.value,
    });
  }

  render() {
    const userColors = JSON.parse(localStorage.getItem('userColors'));

    return(
      <React.Fragment>
        <Card className="mt-4">
          <Card.Header>Chat</Card.Header>
          <Card.Body style={{ maxHeight: 300, overflowY: 'scroll' }}>
            {this.props.messages.map((message) => (
              <Card.Text key={message._id}><span style={{color: `${userColors[message.userId]}`}}>{message.userName}:</span> {message.text}</Card.Text>
            ))}
          </Card.Body>
        </Card>
        <form onSubmit={this.chatSubmit}>
          <InputGroup className="mb-3">
            <InputGroup.Prepend>
              <Button type="submit" variant="outline-secondary">Send</Button>
            </InputGroup.Prepend>
            <FormControl aria-describedby="basic-addon1" onChange={this.updateChat} value={this.state.chatMessage}/>
          </InputGroup>
        </form>
      </React.Fragment>
    );
  }
}

export default ChatBox;
