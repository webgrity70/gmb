import React, { Component } from 'react';
import './HeadwayWidget.scss';

class HeadwayWidget extends Component {
  componentDidMount = () => {
    const config = {
      selector: '.headway-container',
      account: '7N9OBx',
    };
    window.Headway.init(config);
  };

  componentDidUpdate = () => {
    const config = {
      selector: '.headway-container',
      account: '7N9OBx',
    };
    window.Headway.init(config);
  };

  render() {
    return <div className="headway-container" />;
  }
}

export default HeadwayWidget;
