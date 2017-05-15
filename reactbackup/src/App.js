import React, { Component } from 'react';
import './App.css';

var Main = require('./components/Main.js');



class App extends Component {
  render() {
    return (
      <div className='mapContainer'>
        <Main google = {window.google}/>
      </div>
    );
  }
}

export default App;
