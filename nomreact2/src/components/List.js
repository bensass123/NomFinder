import React from 'react';

class List extends React.Component {
  constructor(props){
    super(props);

  }

  render() {
    var i = 1;
    var list = this.props.trucks.map( (truck) => {
      return <li className='List' key={i++}>{truck.truckName}</li>;
    });
    return <div>
                <ul>

                {list}
                </ul>
            </div>;
  }
}

module.exports = List;





