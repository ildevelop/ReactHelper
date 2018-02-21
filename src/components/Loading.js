/**
 * Created by ildevelop on 14.10.2017.
 */

import React, { PropTypes, Component } from 'react';
import './ClientComponent/ClientComponent.scss'
export default class Loading extends Component {

  shouldComponentUpdate() {
    return false;
  }

  render() {
    return (
      <div className="clients">
        <div className="loading-container">
          <div className="loading-speeding-wheel"/>
        </div>
      </div>
    );
  }
}
