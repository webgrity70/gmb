/* eslint-disable react/destructuring-assignment */
import React, { Component } from 'react';
import isEmpty from 'lodash/isEmpty';
import PropTypes from 'prop-types';
import Goal from '../Goal';
import './Goals.scss';
import ProfileService from '../../../Services/ProfileService';
import { getSlug } from '../../NewPlan/utils';

class Goals extends Component {
  state = {
    'Health & Fitness': {},
    Learn: {},
    Work: {},
    Life: {},
  };

  updateBuddy = (val = false, id = null) => {
    const { openChatWith } = this.props;
    openChatWith(id);
    if (val) this.makeRequest();
  };

  closeSidebarFunction = () => {
    const { closeSidebarFunction } = this.props;
    closeSidebarFunction();
    this.makeRequest();
  };

  makeRequest = async () => {
    const { user } = this.props;
    const requests = [
      ProfileService.getBuddyForCategory(user.pk, 1),
      ProfileService.getBuddyForCategory(user.pk, 2),
      ProfileService.getBuddyForCategory(user.pk, 3),
      ProfileService.getBuddyForCategory(user.pk, 4),
    ];
    try {
      const [healthAndFitness, Learn, Work, Life] = await Promise.all(requests);
      this.setState({
        'Health & Fitness': healthAndFitness,
        Learn,
        Work,
        Life,
      });
    } catch (e) {
      // TODO: Handling the error by showing alert or modifying the UI to be able to try and reload.
      console.error(e);
    }
  };

  renderCategoryBlock = (nameOfCategory) => {
    const { user } = this.props;
    const slug = getSlug(nameOfCategory);
    const category = this.state[nameOfCategory];
    if (isEmpty(user) || isEmpty(category)) return <p>Loading...</p>;
    const { buddy, status } = category;
    const userCategory = user.levels.categories.find(
      (cat) => cat.slug === slug
    );
    const userActivityBreakdown = category.behaviours;
    return (
      <Goal
        updateBuddy={(val, id) => this.updateBuddy(val, id)}
        closeSidebarFunction={this.closeSidebarFunction}
        goalForUser={userCategory}
        buddy={buddy}
        status={status}
        user={user}
        key={slug}
        userActivityBreakdown={userActivityBreakdown}
      />
    );
  };

  componentDidMount = () => {
    this.makeRequest();
  };

  render() {
    return (
      <div className="goals">
        <div className="goals">
          {this.renderCategoryBlock('Health & Fitness')}
          {this.renderCategoryBlock('Learn')}
          {this.renderCategoryBlock('Work')}
          {this.renderCategoryBlock('Life')}
        </div>
      </div>
    );
  }
}

Goals.propTypes = {
  user: PropTypes.shape(),
  closeSidebarFunction: PropTypes.func,
  openChatWith: PropTypes.func,
};

export default Goals;
