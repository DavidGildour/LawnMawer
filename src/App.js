import React from 'react';
import './App.css';

import Header from './comp/header';
import Control from './comp/control';
import Game from './comp/game';

function App() {
  return (
    <div className="App">
      <Header />
      <Control />
      <Game />
    </div>
  );
}

export default App;
