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

  // getInitialState() {
  //   return {
  //     selectedTruck: {truckName: ' '}
  //   }
  // }

  render(){
      return (
        <div className="col-md-4">
          <div className="panel panel-default">
            <div className="panel-heading">
              <h3 className="panel-title text-center">Favorites</h3>
            </div>
            <div className="panel-body text-center">
              <ul style={{'listStyleType':'none'}}>  
                {this.state.trucks.map((truck, i) => {
                  return <li key={i}><h3>{truck}</h3></li>;
                })}
              </ul>
            </div>
          </div>
        </div> 
      )
    }

    componentDidMount() {
      fetch('/favorites')
        .then(res => res.json())
        .then(truckres => {
          this.setState({ trucks: truckres.favoriteTrucks });
          console.log(truckres);
        });
    }
}

module.exports = Favorites;