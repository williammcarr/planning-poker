import React from 'react';
import { withTracker } from 'meteor/react-meteor-data';

import Lobby from './Lobby';
import Login from './Login';
import PokerRoom from './PokerRoom';
import Register from './Register';
import NotFoundPage from './NotFoundPage';
import PageHeader from './PageHeader';

import { Redirect, BrowserRouter as Router, Route, Switch } from "react-router-dom";

const PrivateRoute = (props) => {
  const { loggedIn, location, ...rest } = props;

  if (!loggedIn) return <Redirect to={{ pathname: '/login', state: { from: location } }} />;
  return <Route {...rest} />;
}

class App extends React.Component {
  render() {
    return (
      <Router>
        <div>
          <PageHeader />
          <Switch>
            <Route path="/" exact render={() => <Redirect to="/login" />} />
            <Route path="/login" render={() => (this.props.loggedIn ? <Redirect to="/lobby" /> : <Login/>)}/>
            <Route path="/register" render={() => (this.props.loggedIn ? <Redirect to="/lobby" /> : <Register/>)}/>
            <PrivateRoute loggedIn={this.props.loggedIn} path="/lobby" component={Lobby}/>
            <PrivateRoute loggedIn={this.props.loggedIn} path="/room/:id" component={PokerRoom}/>
            <Route path="*" component={NotFoundPage} />
          </Switch>
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
