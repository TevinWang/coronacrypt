  
import React, {Component} from 'react';

import {greatPlaceStyle} from './my_great_place_styles.js';

export default class MyGreatPlace extends Component {
  // static propTypes = {
  //   text: PropTypes.string
  // };

  // static defaultProps = {};


  render() {
    return (
       <div style={greatPlaceStyle}>
          Case here.
       </div>
    );
  }
}