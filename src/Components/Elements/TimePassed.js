import React from 'react';
import moment from 'moment';

const WAIT_TO_UPDATE_TIME_PASSED = 1 * 60 * 1000;

class TimePassed extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      timePassed: null,
    };
  }

  componentDidMount() {
    this.setState({ timePassed: moment(this.props.time).fromNow() });

    this.interval = setInterval(() => {
      this.setState({ timePassed: moment(this.props.time).fromNow() });
    }, WAIT_TO_UPDATE_TIME_PASSED);
  }

  componentWillUnmount() {
    clearInterval(this.interval);
  }

  render() {
    return <span> {this.state.timePassed} </span>;
  }
}

export default TimePassed;
