import React, { Component } from 'react';
import alpha_gmb_logo from '../../Assets/images/Combined Shape.png';
import alpha_gmb_logo2x from '../../Assets/images/Combined Shape@2x.png';

class AccountabilityScore extends Component {
  constructor(props) {
    super(props);
    this.state = {};

    this.onMouseEnter = this.onMouseEnter.bind(this);
    this.onMouseLeave = this.onMouseLeave.bind(this);
  }

  onMouseLeave() {
    this.setState({ color: null });
  }

  onMouseEnter() {
    this.setState({ color: this.props.levelcolor });
  }

  render() {
    /**
     * @param this.props.nonbeta
     */
    const { className, points, nonbeta, levelName, ...rest } = this.props;
    const { color } = this.state;
    return (
      <div
        {...rest}
        className={`accountability-score ${nonbeta ? 'non-beta' : ''} ${
          className ? className : ''
        }`}
        style={{ backgroundColor: color }}
        onMouseEnter={this.onMouseEnter}
        onMouseLeave={this.onMouseLeave}
      >
        <img
          src={alpha_gmb_logo}
          srcSet={`${alpha_gmb_logo} 1x, ${alpha_gmb_logo2x} 2x`}
          alt="GMB Logo"
        />
        {!color && (
          <span className={'score'}>
            {nonbeta ? 'INVITE' : points === 0 ? 33 : points}
          </span>
        )}
        {color && <span className="level-name"> {levelName} </span>}
      </div>
    );
  }
}

export default AccountabilityScore;
