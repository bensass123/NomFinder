import React from 'react';

class List extends React.Component {
  constructor(props){
    super(props);

  }

  render() {
    var i = 1;
    var list = this.props.trucks.map( (truck) => {
      return <div key={i++}>{truck.truckName}</div>;
    });
    return <div>{list}</div>;
  }
}

module.exports = List;





