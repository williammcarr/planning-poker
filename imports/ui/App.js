import React from 'react';

import Lobby from './Lobby';
import Login from './Login';
import PokerRoom from './PokerRoom';
import Register from './Register';

import { BrowserRouter as Router, Route, Link } from "react-router-dom";

const App = () => (
  <Router>
    <div>
      <Route path="/" exact component={Lobby}/>
      <Route path="/login" exact component={Login}/>
      <Route path="/register" exact component={Register}/>
      <Route path="/room/:id" component={PokerRoom}/>
    </div>
  </Router>
);

export default App;
