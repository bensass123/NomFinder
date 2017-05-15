import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import List from './components/List.js';

class App extends Component {
  constructor(props){
    super(props);
    this.state = {
      trucks: ['bob','red','bubba']
    }
  }

  render() {
    return (
          <List trucks = {this.state.trucks} />
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
