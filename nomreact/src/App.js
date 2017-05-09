import React, { Component } from 'react';
import './App.css';

var Container = require('./components/Container.js');



class App extends Component {
  render() {
    return (
      <div>
        <Container google={window.google}></Container>
      </div>
    );
  }
}

export default App;
