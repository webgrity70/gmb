/* eslint-disable react/no-array-index-key */
/* eslint-disable no-return-assign */
/* eslint-disable react/sort-comp */
import React, { Component } from 'react';
import cx from 'classnames';
import { Form, Segment, TextArea } from 'semantic-ui-react';
import _ from 'lodash';

import Category from '../Categories/Category';
import ProfileService from '../../../Services/ProfileService';
import CategoryIcon from '../../Utils/CategoryIcon';
import Helpers from '../../Utils/Helpers';
import BuddiesService from '../../../Services/BuddiesService';
/* import ActiveCategory from '../Categories/ActiveCategory';
import InactiveCategory from '../Categories/InactiveCategory';
import ActivatingCategory from '../Categories/ActivatingCategory';
import SwitchingCategory from '../Categories/SwitchingCategory';
import EditingCategory from '../Categories/EditingCategory';
import DeletingCategory from '../Categories/DeletingCategory';
*/
import { TrackEvent } from '../../../Services/TrackEvent';

import './CategorySection.scss';

// TODO: It will be replaced to real data
const ARRAY_OF_DOTS = [0, 0, 0, 0, 0, 0, 0, 0];

class CategorySection extends Component {
  constructor(props) {
    /** Props data
     * @param props.loggedUser
     */
    super(props);
    this.state = {
      editMode: false,
      editModeWithHabit: false,
      categoryInfo: {},
      goalImportance: '',
      goal: '',
      newHabit: undefined,
      sentRequest: false,
      categoryErrorDetails: {},
    };

    this.edit = this.edit.bind(this);
    this.cancel = this.cancel.bind(this);
    this.save = this.save.bind(this);
    this.onActivatingCategory = this.onActivatingCategory.bind(this);
    this.updateGoalImportance = this.updateGoalImportance.bind(this);
    this.onRemove = this.onRemove.bind(this);
    this.onSwitchingTo = this.onSwitchingTo.bind(this);
    this.onSwitchCancel = this.onSwitchCancel.bind(this);
    this.onSwitchCategory = this.onSwitchCategory.bind(this);
    this.updateCategory = this.updateCategory.bind(this);
    this.sendBuddyRequest = this.sendBuddyRequest.bind(this);
    this.sendBetaInvite = this.sendBetaInvite.bind(this);
    this.cancelBuddyRequest = this.cancelBuddyRequest.bind(this);
    this.handleGoalImportanceChange = this.handleGoalImportanceChange.bind(
      this
    );
  }

  UNSAFE_componentWillMount() {
    document.addEventListener('mousedown', this.handleClick, false);
  }

  handleClick = (e) => {
    const noContains = !this.node.contains(e.target);
    const { activatingCategory, switchingCategory, editMode } = this.state;
    const isActivating = noContains && activatingCategory;
    const isSwitching = noContains && switchingCategory;
    const isEdit = noContains && editMode;
    if (isActivating || isSwitching || isEdit) {
      this.setState({
        activatingCategory: false,
        switchingCategory: false,
        editMode: false,
      });
    }
  };

  componentDidMount() {
    this.updateCategory();

    // TODO: Should not use _mounted. https://reactjs.org/blog/2015/12/16/ismounted-antipattern.html
    this._mounted = true;
  }

  componentWillUnmount() {
    // TODO: Should not use _mounted. https://reactjs.org/blog/2015/12/16/ismounted-antipattern.html
    this._mounted = false;
    document.removeEventListener('mousedown', this.handleClick, false);
  }

  componentDidUpdate = ({ category: prevCategory }) => {
    const { category } = this.props;
    if (!_.isEqual(prevCategory, category)) {
      this.updateCategory();
    }
  };

  onActivatingCategory(activatingCategory) {
    const { activeCategories, user } = this.props;
    if (activeCategories.length >= user.available_categories) {
      this.setState({ activatingCategory });
      return;
    }
    this.setState({ editMode: true });
  }

  onRemove(removing) {
    this.setState({ editMode: false, removing });
  }

  onSwitchingTo(switchingFrom) {
    this.setState({
      switchingCategory: true,
      activatingCategory: false,
      switchingFrom,
    });
  }

  onSwitchCancel() {
    this.setState({ switchingCategory: false });
  }

  onSwitchCategory() {
    const { category, loadCategories } = this.props;
    const { switchingFrom } = this.state;
    this.setState({ processing: true });
    ProfileService.removeCategory(switchingFrom.habit.id)
      .then(() => {
        loadCategories(category);

        TrackEvent('priprofile-category-deactivated', {
          switchingFrom,
          category,
        });

        this.setState({
          switchingCategory: false,
          editMode: true,
          processing: false,
        });
      })
      .catch((e) => {
        console.error(e);
        this.setState({
          processing: false,
        });
      });
  }

  edit() {
    this.updateCategory(false, true);
    this.setState({
      editMode: true,
      categoryErrorDetails: {},
    });
  }

  cancel() {
    this.setState({ editMode: false });
  }

  save(newHabit, goal) {
    const { activeCategories, category, loadCategories } = this.props;
    const { categoryInfo, goalImportance } = this.state;

    const goalImportanceValue = goalImportance;
    this.setState({
      processing: true,
      categoryErrorDetails: {},
    });
    if (!activeCategories.length || !categoryInfo.active) {
      ProfileService.activeCategory(
        newHabit,
        goal,
        goalImportanceValue,
        category.name
      )
        .then(({ data }) => {
          Helpers.createToast(data);
          loadCategories();
          this.setState({ editMode: false });
          TrackEvent('priprofile-category-activated', categoryInfo);
        })
        .catch((data) => {
          if (
            _.get(data, 'response.data.details.habit', false) ||
            _.get(data, 'response.data.details.goal', false) ||
            _.get(data, 'response.data.details.goalImportance', false)
          ) {
            Helpers.createToast({
              status: 'error',
              message: 'Please fill out all highlighted fields',
            });
          }
          this.setState({
            processing: false,
            categoryErrorDetails: _.get(data, 'response.data.details', {}),
          });
        });
      return;
    }
    ProfileService.updateCategory(
      newHabit,
      goal,
      goalImportanceValue,
      category.name
    )
      .then(({ data }) => {
        Helpers.createToast(data);
        loadCategories();
        this.setState({ editMode: false });
        this.updateCategory();
      })
      .catch((data) => {
        if (
          _.get(data, 'response.data.details.habit', false) ||
          _.get(data, 'response.data.details.goal', false) ||
          _.get(data, 'response.data.details.goalImportance', false)
        ) {
          Helpers.createToast({
            status: 'error',
            message: 'Please fill out all highlighted fields',
          });
        }
        this.setState({
          processing: false,
          categoryErrorDetails: _.get(data, 'response.data.details', {}),
        });
      });
  }

  sendBuddyRequest() {
    const { user, category, onSentRequest } = this.props;
    this.setState({ processing: true });
    BuddiesService.sendBuddyRequest(user.pk, category.id)
      .then((data) => {
        Helpers.createToast(data.data);
        this.setState({ sentRequest: true, processing: false });
        onSentRequest(category.id);
        TrackEvent('priprofile-category-buddysearch');
      })
      .catch(({ response }) => {
        Helpers.createToast(response.data);
        this.setState({ processing: false });
      });
  }

  sendBetaInvite() {
    const { user, category, onSentRequest } = this.props;
    this.setState({ processing: true });
    BuddiesService.sendBetaInvite(user.pk, category.id)
      .then((data) => {
        Helpers.createToast(data);
        this.setState({ sentRequest: true, processing: false });
        onSentRequest(category.id);
      })
      .catch(({ response }) => {
        Helpers.createToast(response.data);
        this.setState({ processing: false });
      });
  }

  cancelBuddyRequest() {
    const { user, category, onSentRequest } = this.props;
    this.setState({ processing: true });
    BuddiesService.cancelBuddyRequest(user.pk, category.id)
      .then((data) => {
        Helpers.createToast(data);
        this.setState({ sentRequest: false, processing: false });
        onSentRequest(category.id);
      })
      .catch((data) => {
        if (
          data &&
          data.message === 'You have no buddy requests pending with this buddy.'
        ) {
          this.setState({ sentRequest: false, processing: false });
          onSentRequest(category.id);
        } else {
          Helpers.createToast(data);
          this.setState({ processing: false });
        }
      });
  }

  updateGoalImportance(newHabit, goal, habitId) {
    const { goalImportance } = this.state;
    this.setState({ processing: true });
    ProfileService.updateGoalImportance(habitId, goal, goalImportance, newHabit)
      .then((data) => {
        Helpers.createToast(data);
        this.setState({ editMode: false, processing: false });
        this.updateCategory();
      })
      .catch((data) => {
        Helpers.createToast(data);
        this.setState({ processing: false });
      });
  }

  handleGoalImportanceChange(event) {
    this.setState({ goalImportance: event.target.value });
  }

  updateCategory(open_chat = false, editMode = false) {
    const {
      editingCategory,
      category,
      onSentRequest,
      loggedUser,
      openChatWith,
      user,
    } = this.props;
    this.setState({ processing: true });
    ProfileService.getBuddyForCategory(user.pk, category.id)
      .then((data) => {
        // TODO: Should not use _mounted. https://reactjs.org/blog/2015/12/16/ismounted-antipattern.html
        if (this._mounted) {
          if (data.sent_request) onSentRequest(category.id);
          this.setState({
            categoryInfo: data,
            goalImportance: data.goal_importance || '',
            goal: data.goal,
            sentRequest: data.sent_request,
            editMode:
              editMode ||
              (editingCategory && editingCategory.id === category.id),
            processing: false,
          });
        }
        if (open_chat) openChatWith(data.buddy.pk);
      })
      .catch((_data) => {
        this.setState({ processing: false });
      });
    const hasAccess = _.some(
      loggedUser.category_available,
      (available) => available.active && available.category.pk === category.id
    );

    this.setState({ hasAccess });
  }

  renderDots() {
    const { user, category } = this.props;
    const goalForUser = _.find(_.get(user, 'levels.categories', []), [
      'pk',
      category.id,
    ]);
    const countOfDots = ARRAY_OF_DOTS.map((el, i) => {
      if (_.get(goalForUser, 'level.level', 0) > i) {
        return 1;
      }
      return el;
    });
    return (
      <div className="progress-dots">
        {countOfDots.map((el, index) => (
          <div
            key={`${index}-dot`}
            className={`progress-dot ${el ? 'completed' : ''}`}
          />
        ))}
      </div>
    );
  }

  render() {
    const {
      editMode,
      categoryInfo,
      hasAccess,
      activatingCategory,
      switchingCategory,
      removing,
      sentRequest,
      processing,
      categoryErrorDetails,
      goalImportance,
    } = this.state;
    const {
      canEdit,
      user,
      activeCategories,
      category,
      openChatWith,
      closeSidebarFunction,
      loggedUser,
      currentSentRequest,
    } = this.props;

    const userCategoryInfo = _.find(_.get(user, 'levels.categories', []), [
      'pk',
      category.id,
    ]);
    const activeCategoryState =
      categoryInfo.active ||
      removing ||
      activatingCategory ||
      switchingCategory ||
      editMode;
    const isMyBuddy =
      categoryInfo.buddy && categoryInfo.buddy.id === loggedUser.pk;
    return (
      <div ref={(node) => (this.node = node)}>
        <Segment
          className={`category-section ${
            !activeCategoryState ? 'dull active' : ''
          }`}
          id="category-section"
        >
          <Form>
            <div
              className={cx(`header ${category.slug}`, {
                active: categoryInfo.active,
              })}
            >
              {editMode && (
                <div className="description edit">
                  <span className="private">(private)</span>
                  Why do you want to do it?
                  <Form.Field
                    error={
                      !!_.get(categoryErrorDetails, 'goalImportance', false)
                    }
                  >
                    <TextArea
                      id="goal-importance"
                      value={goalImportance}
                      onChange={this.handleGoalImportanceChange}
                      rows={0}
                    />
                  </Form.Field>
                </div>
              )}
              {!editMode && (
                <div className="split justify-center">
                  <div className="details">
                    <div className="icon-and-level">
                      {CategoryIcon.renderBlackWhiteIcon(category.slug, {})}{' '}
                      <span className="category-points">
                        {_.get(userCategoryInfo, 'points', '')}
                      </span>
                    </div>
                    <div className="progress-dots-bx">{this.renderDots()}</div>
                    <div className="label">{category.name}</div>
                  </div>
                </div>
              )}
            </div>
            <div className={`inner-content d-flex ${category.slug}`}>
              <Category
                data={categoryInfo}
                canAdd={
                  activeCategories.length < loggedUser.available_categories
                }
                hasAccess={hasAccess}
                user={user}
                category={category}
                canEdit={canEdit}
                alreadyBuddy={isMyBuddy}
                sendBuddyRequest={this.sendBuddyRequest}
                sendBetaInvite={this.sendBetaInvite}
                cancelBuddyRequest={this.cancelBuddyRequest}
                sentRequest={sentRequest}
                disabled={processing}
                updateCategory={this.updateCategory}
                openChatWith={openChatWith}
                closeSidebarFunction={closeSidebarFunction}
                categoryId={category.id}
                currentSentRequest={currentSentRequest}
              />
            </div>
          </Form>
        </Segment>
      </div>
    );
  }
}

export default CategorySection;
