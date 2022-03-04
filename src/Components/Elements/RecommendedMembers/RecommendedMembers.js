/* eslint-disable no-return-assign */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import cx from 'classnames';
import { Grid, Icon } from 'semantic-ui-react';
import BuddiesService from '../../../Services/BuddiesService';
import ProfileCard from '../ProfileCard';

import './RecommendedMembers.scss';

class RecommendedMembers extends Component {
  constructor(props) {
    super(props);
    this.state = { recommends: [] };
  }

  UNSAFE_componentWillMount() {
    // TODO: Should not use _mounted. https://reactjs.org/blog/2015/12/16/ismounted-antipattern.html
    this._mounted = true;
  }

  componentDidMount() {
    const that = this;
    BuddiesService.getRecommendedMembers(4)
      .then((data) => {
        // TODO: Should not use _mounted. https://reactjs.org/blog/2015/12/16/ismounted-antipattern.html
        if (that._mounted) {
          that.setState({
            recommends: data.results
              .filter((member) => member.pk !== that.props.exclude)
              .slice(0, 3),
          });
        }
      })
      .catch((data) => {
        console.error(data);
      });
  }

  componentWillUnmount() {
    // TODO: Should not use _mounted. https://reactjs.org/blog/2015/12/16/ismounted-antipattern.html
    this._mounted = false;
  }

  render() {
    const { hasPlan } = this.props;
    const { recommends } = this.state;
    if (recommends.length === 0) return <React.Fragment />;
    return (
      <div className={cx('RecommendedMembers', { disabled: !hasPlan })}>
        <Grid stackable padded={false}>
          {recommends.map((buddy) => (
            <Grid.Column
              key={buddy.pk || buddy.id}
              mobile={16}
              tablet={8}
              computer={5}
            >
              <ProfileCard buddy={buddy} showTooltip={!hasPlan} />
            </Grid.Column>
          ))}
        </Grid>
        <div className="find-more clickable">
          <Link to="/buddies">
            find more
            <Icon name="chevron right" />
          </Link>
        </div>
      </div>
    );
  }
}

RecommendedMembers.propTypes = {
  hasPlan: PropTypes.bool,
};

export default RecommendedMembers;
