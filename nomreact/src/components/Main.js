import React from 'react';
import ToggleButton from 'react-toggle-button';

var Container = require('./Container.js');
var Favorites = require('./Favorites.js');

class Main extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
          value: false
      }
      
    }

    componentDidMount() {
        this.setState({value: false});
        console.log(this.state.value);
    }

    render(props,context) {
        return (
        <div className='container'>
            <div className='row'>
                <ToggleButton
                    style={{
                        width: '40%',
                        height: '15%'
                    }}
                    value={ this.state.value || false }
                    onToggle={(value) => {
                        this.setState({
                        value: !value,
                        })
                    }} />
                <Container google={this.props.google}></Container>
            </div>
            <div className='row'>
                <Favorites></Favorites>
            </div>
        </div>


    )}
}

module.exports = Main;