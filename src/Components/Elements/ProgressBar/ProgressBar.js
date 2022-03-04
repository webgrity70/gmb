import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import Circle from './Circle';
import './Progress.scss';

class ProgressBar extends PureComponent {
  changeStroke = () => {
    const { name } = this.props;
    const [path] = document.getElementsByClassName(name);
    const length = path.getTotalLength();
    const value = parseInt(path.parentNode.getAttribute('data-value'), 10);
    const to = length * ((100 - value) / 100);
    path.getBoundingClientRect();
    path.style.strokeDashoffset = Math.max(0, to);
  };

  componentDidMount = () => {
    this.changeStroke();
  };

  componentDidUpdate = ({ value: prevValue }) => {
    const { value } = this.props;
    if (prevValue !== value) this.changeStroke();
  };

  render() {
    const { name, value, text, ...props } = this.props;
    return (
      <div className="ProgressBar" {...props}>
        <div className="ProgressBar__circle">
          <Circle value={value} name={name} text={text} />
        </div>
      </div>
    );
  }
}
ProgressBar.propTypes = {
  name: PropTypes.string,
  text: PropTypes.string,
  value: PropTypes.number,
};

export default ProgressBar;
