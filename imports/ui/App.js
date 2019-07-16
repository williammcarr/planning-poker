import React from 'react';
import { withTracker } from 'meteor/react-meteor-data';

import Lobby from './Lobby';
import Login from './Login';
import PokerRoom from './PokerRoom';
import Register from './Register';

import { BrowserRouter as Router, Route, Link } from "react-router-dom";

class App extends React.Component {
  render() {
    const { loggedIn } = this.props;

    if (loggedIn) {
      return (
        <Router>
          <div>
            <Route path="/" exact component={Lobby}/>
            <Route path="/room/:id" component={PokerRoom}/>
          </div>
        </Router>
      );
    }

    return (
      <Router>
        <div>
          <Route path="/" exact component={Login}/>
          <Route path="/login" exact component={Login}/>
          <Route path="/register" exact component={Register}/>
        </div>
      </Router>
    );
  }
}

export default withTracker(() => {
  return {
    loggedIn: Meteor.loggingIn() || Meteor.userId() != null,
  }
})(App);
