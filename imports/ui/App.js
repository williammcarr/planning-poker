import React from 'react';

import Lobby from './Lobby';
import PokerRoom from './PokerRoom';

import { BrowserRouter as Router, Route, Link } from "react-router-dom";

const App = () => (
  <Router>
    <div>
      <Route path="/" exact component={Lobby} />
      <Route path="/room/:id" component={PokerRoom} />
    </div>
  </Router>
);

export default App;
