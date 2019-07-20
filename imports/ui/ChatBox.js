import React, { useEffect, useRef } from 'react';

import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import Form from 'react-bootstrap/Form';
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

    this.setUserColors(this.props.messages);
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    if (prevProps.messages.length !== this.props.messages.length) {
      this.setUserColors(this.props.messages);
    }

    this.scrollToBottom();
  }

  setUserColors(messages) {
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

    if (this.state.chatMessage === '') return;

    let props = {
      text: this.state.chatMessage,
      location: this.props.location,
      userId: Meteor.user()._id,
      username: Meteor.user().username,
    }

    Meteor.call('messages.insert', props, (err) => {
      if (err) {
        console.error(err.reason);
        return;
      }

      this.setState({
        chatMessage: '',
      });
    });
  }

  updateChat = (e) => {
    this.setState({
      chatMessage: e.target.value,
    });
  }

  scrollToBottom() {
    const scrollHeight = this.messageList.scrollHeight;
    const height = this.messageList.clientHeight;
    const maxScrollTop = scrollHeight - height;
    this.messageList.scrollTop = maxScrollTop > 0 ? maxScrollTop : 0;
  }

  render() {
    const userColors = JSON.parse(localStorage.getItem('userColors'));

    return(
      <React.Fragment>
        <Card className="mt-2">
          <Card.Header>Chat</Card.Header>
          <Card.Body name="MessageList" ref={(div) => {this.messageList = div;}} style={{ height: 300, overflowY: 'scroll' }}>
            {this.props.messages.map((message) => (
              <Card.Text key={message._id}><span style={{color: `${userColors[message.userId]}`}}>{message.username}:</span> {message.text}</Card.Text>
            ))}
          </Card.Body>
        </Card>
        <Form onSubmit={this.chatSubmit}>
          <InputGroup className="mb-3">
            <InputGroup.Prepend>
              <Button type="submit" variant="outline-secondary">Send</Button>
            </InputGroup.Prepend>
            <FormControl aria-describedby="basic-addon1" onChange={this.updateChat} value={this.state.chatMessage}/>
          </InputGroup>
        </Form>
      </React.Fragment>
    );
  }
}

export default ChatBox;
