import React from 'react';

import Map from 'google-maps-react';

import {Marker} from 'google-maps-react';

import {InfoWindow} from 'google-maps-react';

class Container extends React.Component {
  constructor() {
      super();
      this.state = {
        markers: [],
        infos: [],
        selectedPlace: {name: ' '}
      };
        // This binding is necessary to make `this` work in the callback
      this.onMarkerClick = this.onMarkerClick.bind(this);
      this.onMapClicked = this.onMapClicked.bind(this);
    }

  getInitialState() {
    return {
      showingInfoWindow: false,
      activeMarker: {},
      selectedPlace: {name: ' '}
    }
  }
 
  onMarkerClick(props, marker, e) {
    this.setState({
      selectedPlace: props,
      activeMarker: marker,
      showingInfoWindow: true
    });
    // console.log(props);
  }
 
  onMapClicked(props) {
    if (this.state.showingInfoWindow) {
      this.setState({
        showingInfoWindow: false,
        activeMarker: null
      })
    }
  }

    render() {
      return (
            <Map google={this.props.google} onClick={this.onMapClicked} centerAroundCurrentLocation={true} zoom={14}>
             
             {this.state.markers.map((loc,i) => (
              
               <Marker key={i} onClick={this.onMarkerClick} name={loc.truckName} position={{lat: this.state.markers[i].lat, lng: this.state.markers[i].long}} />
               
              
             ))}
              <InfoWindow
                  marker={this.state.activeMarker}
                  visible={this.state.showingInfoWindow}
                  onClose={this.onInfoWindowClose}>
                    <div>
                      <h1>{this.state.selectedPlace.name.charAt(0).toUpperCase() + this.state.selectedPlace.name.slice(1)}</h1>
                    </div>
              </InfoWindow>
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


