import React from 'react';

import Card from 'react-bootstrap/Card';
import InputGroup from 'react-bootstrap/InputGroup';
import Button from 'react-bootstrap/Button';
import FormControl from 'react-bootstrap/FormControl';

import { Messages } from '../api/messages.js';

class ChatBox extends React.Component {
  constructor(props) {
    super(props);
 
    this.state = {
      chatMessage: '',
      userColors: {},
    };
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    if (nextProps.messages !== prevState.messages) {
      return {userColors: ChatBox.setUserColors(nextProps.messages)};
    }

    return null;
  }

  static setUserColors(messages) {
    const userColors = {};

    messages.forEach((message) => {
      if (!userColors[message.userName]) {
        const randInt = Math.floor(Math.random() * 360);
        const colorInt = randInt - (randInt % 10);

        userColors[message.userName] = `hsl(${colorInt},100%,50%)`;
      }
    });

    return(userColors);
  }

  chatSubmit = (e) => {
    e.preventDefault();

    Messages.insert({
      text: this.state.chatMessage,
      location: 'lobby',
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
		return(
      <React.Fragment>
    		<Card className="mt-4">
          <Card.Header>Chat</Card.Header>
          <Card.Body>
            {this.props.messages.map((message) => (
              <Card.Text key={message._id}><span style={{color: this.state.userColors[message.userName]}}>{message.userName}:</span> {message.text}</Card.Text>
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