import React from 'react';

class Favorites extends React.Component {
  constructor() {
      super();
      this.state = {
        trucks: [],
        selectedTruck: {truckName: " "},
      };
        // This binding is necessary to make `this` work in the callback
      // this.onTruckClick = this.onTruckClick.bind(this);
    }

  getInitialState() {
    return {
      selectedTruck: {truckName: ' '}
    }
  }

  render(){
      return (
        <div className="col-md-6">
          <div className="panel panel-default">
            <div className="panel-heading">
              <h3 className="panel-title text-center">Favorites</h3>
            </div>
            <div className="panel-body text-center">
              <h2>{this.state.trucks.truckName}</h2>
            </div>
          </div>
        </div> 
      )
    }

    componentDidMount() {
      fetch('/alltrucks')
      .then(res => res.json())
      .then(trucks => this.setState({ trucks }));

    }
}

module.exports = Favorites;
