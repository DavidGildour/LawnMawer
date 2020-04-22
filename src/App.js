import React from 'react';
import './App.css';

import Header from './comp/header';
import Control from './comp/control';
import Game from './comp/game';

import Config from './gameLogic/config';

function App() {
  const LawnCfg = new Config([113, 100]);

  return (
    <div className="App">
      <Header />
      <Control />
      <Game config={LawnCfg} />
    </div>
  );
}

export default App;
