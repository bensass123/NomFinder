import React from 'react';

import Map from 'google-maps-react';

import {Marker} from 'google-maps-react';

import axios from 'axios';


import InfoWindow from 'google-maps-react';





// 35.0901008,-80.7685823


class Container extends React.Component {
    constructor() {
      super();
      this.state ={
        markers: [],
        infos: []
      };
      
    }

    render() {
      return (
            <Map google={this.props.google} centerAroundCurrentLocation={true} zoom={14}>
             
             {this.state.markers.map((loc,i) => (
               <Marker key={i} name={'test'} position={{lat: this.state.markers[i].lat, lng: this.state.markers[i].long}} />
             ))}
            </Map> 

      )
    }

    componentDidMount() {
      fetch('/alltrucks')
      .then(res => res.json())
      .then(markers => this.setState({ markers }));
    }
}

module.exports = Container;


