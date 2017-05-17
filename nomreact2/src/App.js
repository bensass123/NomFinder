import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import List from './components/List.js';
import Favorites from './components/Favorites.js';

class App extends Component {
  constructor(props){
    super(props);
  }

  render() {
    return (
          <Favorites />
          // <List trucks = {this.state.trucks} />   /   
    );
  }

  componentDidMount() {
      // this will be changed to favorites
      fetch('/alltrucks', {credentials: 'include'})
        .then(res => res.json())
        .then(trucks => this.setState({ trucks }));
    }
}

export default App;
