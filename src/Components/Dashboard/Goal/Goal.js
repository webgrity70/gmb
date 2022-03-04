/* eslint-disable react/no-array-index-key */
import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import Tooltip from 'rc-tooltip';
import PropTypes from 'prop-types';
import { Icon, Segment } from 'semantic-ui-react';

import * as muted from '../../../Assets/images/muted.png';
import Avatar from '../../Elements/Avatar';
import ColoredDots from '../../Elements/ColoredDots';
import CategoryIcon from '../../Utils/CategoryIcon';

import './Goal.scss';

// TODO: It will be replaced to real data
const ARRAY_OF_DOTS = [0, 0, 0, 0, 0, 0, 0, 0];

class Goal extends Component {
  constructor(props) {
    super(props);

    this.state = {
      progressDetailsOpened: false,
      openedActivity: '',
    };

    this.renderDots = this.renderDots.bind(this);
    this.renderYourProgress = this.renderYourProgress.bind(this);
    this.renderBuddyProgress = this.renderBuddyProgress.bind(this);
    this.renderDetails = this.renderDetails.bind(this);
    this.toggleProgressDetails = this.toggleProgressDetails.bind(this);
  }

  renderBuddy() {
    const { buddy } = this.props;
    if (buddy) {
      return (
        <Link to={`/profile/${buddy.id}`} className="goal__buddy-link">
          <div className="goal__buddy-avatar">
            <Avatar avatar={buddy.avatar} />
          </div>
          <div className="goal__buddy-name">{buddy.name}</div>
        </Link>
      );
    }
    return (
      <div className="goal__buddy-link unmatched">
        <div className="goal__avatar">
          <img className="goal__avatar-img muted" src={muted} alt="muted" />
        </div>
        <div className="goal__buddy-name">UNMATCHED</div>
      </div>
    );
  }

  renderUser = () => {
    const { user } = this.props;
    return (
      <div className="goal__wrapper-user-description">
        <div className="goal__buddy-avatar">
          <Avatar avatar={user.avatar} />
        </div>
        <div className="goal__buddy-name">You</div>
      </div>
    );
  };

  renderDots(obj) {
    const { goalForUser } = this.props;
    const countOfDots = ARRAY_OF_DOTS.map((el, i) => {
      if (obj > i) {
        return 1;
      }
      return el;
    });
    return (
      <div className="goal__progress-dots">
        {countOfDots.map((el, index) => (
          <div
            key={`${el}-${goalForUser.slug}-${index}`}
            className={`goal__progress-dot ${el ? goalForUser.slug : ''}`}
          />
        ))}
      </div>
    );
  }

  renderDetails(activityBreakdown) {
    return (
      <div className="goal__progress-details-wrapper">
        <div className="goal__progress-details-title">Activities</div>
        {activityBreakdown.map((activity, i) => (
          <div
            key={`activity-${activity}-${i}`}
            className="goal__progress-details-info"
          >
            <div className="goal__progress-details-info-top">
              <div className="goal__progress-details-info-title">
                {activity}
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  toggleProgressDetails() {
    this.setState((prevState) => ({
      progressDetailsOpened: !prevState.progressDetailsOpened,
    }));
  }

  renderYourProgress() {
    const { goalForUser, user, userActivityBreakdown } = this.props;
    const { progressDetailsOpened = false } = this.state;
    const text = goalForUser.next_level ? (
      <div>
        <p>
          {' '}
          Next Level: <b> {goalForUser.next_level.name} </b>
        </p>
        <p>
          {' '}
          {goalForUser.points}/<b>{goalForUser.next_level.xp_requirement}</b>
        </p>
      </div>
    ) : null;
    return (
      <div className="goal__main-your-progress">
        <Tooltip
          placement="topRight"
          overlay={text}
          overlayClassName="goal__next-level-tooltip"
        >
          <div>
            <div className="goal__progress-top">
              {this.renderUser()}
              <div className="goal__progress-status ">
                {this.renderDots(goalForUser.level.level)}
                <p className={`goal__progress-text ${goalForUser.slug}-text`}>
                  {goalForUser.level.name}
                </p>
              </div>
            </div>

            <div className="goal__progress-mid your">
              <div className="goal__progressbar-bar">
                <div
                  style={{
                    width: `${
                      goalForUser.next_level
                        ? (goalForUser.points * 100) /
                          goalForUser.next_level.xp_requirement
                        : 0
                    }%`,
                  }}
                  className={`goal__progressbar-filled ${goalForUser.slug}`}
                />
              </div>
            </div>
          </div>
        </Tooltip>
        {!!userActivityBreakdown.length && (
          <>
            <div className="goal__progress-bottom your">
              <div
                className={`goal__progressbar-goal ${
                  goalForUser.slug && 'disabled'
                }`}
              >
                <div
                  className={`goal__progressbar-aim ${
                    !user.goal && 'opacity-04'
                  }`}
                >
                  Click the Arrow for Activities
                </div>
              </div>
            </div>
            <div className="goal__progress-details">
              {!!progressDetailsOpened &&
                this.renderDetails(userActivityBreakdown)}
            </div>
          </>
        )}
      </div>
    );
  }

  renderBuddyProgress() {
    const { buddy } = this.props;
    return (
      <div className={`goal__main-buddy-progress ${!buddy && 'unmatched'}`}>
        <div className="goal__progress-top buddy">{this.renderBuddy()}</div>
        <div className="goal__progress-bottom buddy">
          {buddy ? null : <div className="goal__progressbar-goal" />}
        </div>
      </div>
    );
  }

  render() {
    const {
      goalForUser,
      buddy,
      updateBuddy,
      closeSidebarFunction,
      userActivityBreakdown,
      status,
    } = this.props;
    const statusses = {
      match: "IT'S GOING GREAT",
      dangered: 'WE NEED TO TALK',
    };
    return (
      <Segment className="goal__container" id="goal__container">
        <div className="goal ">
          <div className="goal__header">
            <div className="goal__header-top">
              <div className={`goal__header-icon ${goalForUser.slug}`}>
                {CategoryIcon.renderBlackWhiteIcon(goalForUser.slug)}
                <span className="goal__header-score">{goalForUser.points}</span>
              </div>
              <p className="goal__header-title">{goalForUser.name}</p>
            </div>

            {buddy ? (
              <div className="goal__header-bottom">
                <div className="goal__header-status-title">
                  <p>Buddy Status</p>
                  <p
                    className={`goal__header-status-text ${statusses[status]}`}
                  >
                    {statusses[status]}
                  </p>
                </div>
                <div className="goal__header-status-string">
                  <div className="goal__buddy-link status">
                    <div className="goal__buddy-avatar">
                      <Avatar avatar={buddy.avatar} id={buddy.pk} />
                    </div>
                  </div>
                  <div className="goal__header-status-separator" />
                  <ColoredDots
                    status={status}
                    buddy={buddy}
                    categoryId={goalForUser.pk}
                    updateCallback={(val) => updateBuddy(val, buddy.id)}
                    closeSidebarFunction={closeSidebarFunction}
                  />
                </div>
              </div>
            ) : (
              <div className="goal__header-bottom">
                <p className="goal__header-text">
                  Create an
                  {
                    <Link to="/plan/new?section=event">
                      <span className="goal__header-create-event">Event</span>
                    </Link>
                  }
                  to earn points in this category.
                </p>
              </div>
            )}
          </div>

          <div className="goal__vertical-separator" />

          <div className="goal__main-wrapper">
            <div className="goal__main">
              {this.renderYourProgress()}
              {this.renderBuddyProgress()}
            </div>
          </div>
          {!!userActivityBreakdown.length && (
            <div
              onClick={this.toggleProgressDetails}
              className="show-more clickable"
            >
              <Icon
                name={`chevron ${
                  this.state.progressDetailsOpened ? 'up' : 'down'
                }`}
              />
            </div>
          )}
        </div>
      </Segment>
    );
  }
}

Goal.propTypes = {
  goal: PropTypes.shape({
    buddy: PropTypes.object,
    category: PropTypes.object,
    progress: PropTypes.number,
  }).isRequired,
};

export default Goal;
