/* eslint-disable no-inner-declarations */
/* eslint-disable react/no-array-index-key */
import React, { useState, useEffect } from 'react';
import moment from 'moment';
import cx from 'classnames';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { change, reset, touch } from 'redux-form';
import PropTypes from 'prop-types';
import BEMHelper from 'react-bem-helper';
import { Container, Grid, Dropdown } from 'semantic-ui-react';

import Avatar from '../../Elements/Avatar';
import CategoryIcon from '../../Elements/CategoriesIcons/CategoryIcon';
import BehaviorModal from '../../NewPlan/BehaviorModal';
import { getTimeFromMinutes } from '../../NewPlan/utils';
import {
  getRecentBehaviorsList,
  getRecentEventTemplatesList,
} from '../../../selectors/profile';
import {
  fetchRecentBehaviorsAction,
  fetchRecentEventTemplatesAction,
} from '../../../Actions/actions_user';
import PlanService from '../../../Services/PlanService';
import './QuickAdd.scss';
import { withCategories } from '../../HoCs';
import { getHabitsLoading } from '../../../selectors/requests';
import indexesToPrompts from '../../../utils/indexesToPrompts';

export const bem = BEMHelper({ name: 'QuickAdd', outputIsString: true });

const QuickAdd = ({
  user,
  changeFormValue,
  recentBehaviors,
  formName,
  recentEventTemplates,
  onCreated,
  fetchRecentBehaviors,
  habits,
  fetchRecentEventTemplates,
  resetForm,
  touchField,
}) => {
  const startDate = moment();
  const endDate = moment().add(12, 'weeks');
  const intervalDate = { startDate, endDate };

  const [quickAddValue, setQuickAddValue] = useState('');
  const [quickAddOptions, setQuickAddOptions] = useState([]);
  const [quickAddContent, setQuickAddContent] = useState([]);

  const [openBehaviorModal, setOpenBehaviorModal] = useState(false);

  const [isNewEvent, setIsNewEvent] = useState(false);
  const [newEventName, setNewEventName] = useState(null);

  useEffect(() => {
    fetchRecentBehaviors(user.pk);
    fetchRecentEventTemplates(user.pk);
  }, [user]);

  function drawQuickAdd(criteria) {
    console.log(`drawQuickAdd : criteria = ${criteria}`);
    if (criteria === '') {
      setQuickAddContent(drawRecentContent());
      setQuickAddOptions([]);
    } else {
      setQuickAddOptions(getAllBehaviours(criteria));
      setQuickAddContent([]);
    }
  }

  function quickAddFocus(e, data) {
    setQuickAddValue(data.value);
    console.log(`quickAddFocus : ${data.value} : ${quickAddValue}`);
    drawQuickAdd(data.value);
  }

  function quickAddChange(e, data) {
    setQuickAddValue(data.searchQuery);
    console.log(`quickAddChange : ${data.searchQuery} : ${quickAddValue}`);
    drawQuickAdd(data.searchQuery);
  }

  function drawRecentContent() {
    console.log('drawRecentOptions');
    // fetchRecentBehaviors(user.pk);
    // fetchRecentEventTemplates(user.pk);
    const behavioursDrawn = drawRecentBehaviors();
    const eventsDrawn = drawRecentEventTemplates();
    return (
      <Dropdown.Menu>
        <Dropdown.Header content="Recent behaviours" />
        {behavioursDrawn}
        {!behavioursDrawn.length && (
          <Dropdown.Header
            content="No recently used behaviours."
            className={bem('noresults')}
          />
        )}
        <Dropdown.Header content="Most used templates" />
        {eventsDrawn}
        {!eventsDrawn.length && (
          <Dropdown.Header
            content="No recently used templates."
            className={bem('noresults')}
          />
        )}
        <Dropdown.Divider />
        <Dropdown.Item
          value="new"
          text="Create New Event"
          style={{ color: '#fd8f25' }}
          onClick={handleOpenNew}
        />
      </Dropdown.Menu>
    );
  }

  function drawRecentBehaviors() {
    return recentBehaviors
      ? recentBehaviors.map((behavior) => (
          <Dropdown.Item
            key={`recent-behavior-${behavior.id}`}
            value={behavior.id}
            onClick={() => handleOpenBehavior(behavior)}
          >
            <CategoryIcon
              fullColor
              slug={behavior.category.slug}
              customClassName={bem('categoryicon')}
            />
            {behavior.name}
          </Dropdown.Item>
        ))
      : [];
  }

  function drawRecentEventTemplates() {
    return recentEventTemplates
      ? recentEventTemplates.map((template) => (
          <Dropdown.Item
            key={`recent-template-${template.id}`}
            value={template.id}
            icon="file"
            text={template.name}
            onClick={() => handleOpenEventTemplate(template)}
          />
        ))
      : [];
  }

  function getAllBehaviours(criteria) {
    const allBehaviours = habits
      .filter(
        (behavior) =>
          behavior.name.toUpperCase().includes(criteria.toUpperCase()) ||
          criteria === ''
      )
      .map((behavior) => ({
        key: behavior.id,
        text: behavior.name,
        value: behavior.id,
        content: (
          <>
            <CategoryIcon
              fullColor
              slug={behavior.category.slug}
              customClassName={bem('categoryicon')}
            />
            {behavior.name}
          </>
        ),
      }));
    if (allBehaviours.length === 0) {
      allBehaviours.unshift({
        key: 'new',
        text: `Add New ${criteria}`,
        value: `new-${criteria}`,
        content: <div className={bem('addnew')}>Add New {criteria}</div>,
      });
    }

    return allBehaviours;
  }

  function setSingleEventDefaults() {
    changeFormValue(formName, 'type', 'single');
    const [timeHours, timeMinutes, timeFormat] = moment()
      .add(2, 'minute')
      .format('hh:mm:a')
      .split(':');
    changeFormValue(formName, 'time', {
      hours: timeHours,
      minutes: timeMinutes,
      format: timeFormat,
    });
    changeFormValue(formName, 'date', moment());
    touchField(formName, 'time', 'date', 'duration', 'location');
  }

  function handleOpenNew() {
    resetForm(formName);
    setSingleEventDefaults();
    setIsNewEvent(false);
    setOpenBehaviorModal(true);
  }

  function handleOpenBehavior(behavior) {
    resetForm(formName);
    setSingleEventDefaults();
    changeFormValue(formName, 'habit', {
      category: behavior.category.name,
      habit: behavior.name,
      slug: behavior.category.slug,
      value: behavior.id,
    });
    setIsNewEvent(false);
    setOpenBehaviorModal(true);
  }

  function handleOpenStandardBehavior(e, data) {
    console.log(`handleOpenStandardBehavior : ${data.value}`);
    resetForm(formName);
    if (data.value && isNaN(data.value) && data.value.startsWith('new-')) {
      setIsNewEvent(true);
      setNewEventName(data.value.substring(4));
    } else {
      const behavior = habits.filter((b) => b.id === data.value)[0];
      // console.log('handleOpenStandardBehavior : behavior = '+behavior.name);
      changeFormValue(formName, 'habit', {
        category: behavior.category.name,
        habit: behavior.name,
        slug: behavior.category.slug,
        value: behavior.id,
      });
      setIsNewEvent(false);
    }
    setSingleEventDefaults();
    setOpenBehaviorModal(true);
  }

  function handleOpenEventTemplate(eventTemplate) {
    resetForm(formName);
    setSingleEventDefaults();
    setIsNewEvent(false);
    setOpenBehaviorModal(true);
    PlanService.getTemplate(eventTemplate.id)
      .then((data) => {
        const category = eventTemplate.categories[0];
        const event = data.events[0];
        changeFormValue(formName, 'habit', {
          category: category.name,
          habit: event.habit,
          slug: category.slug,
          value: event.habitId,
        });
        const { hours, minutes } = getTimeFromMinutes(event.duration);
        changeFormValue(formName, 'duration', { hours, minutes });
        changeFormValue(formName, 'location', event.place);
        /*
        const [timeHours, timeMinutes, timeFormat] = moment(event.date)
          .format('hh:mm:a')
          .split(':');
        changeFormValue(formName, 'time', {
          hours: timeHours,
          minutes: timeMinutes,
          format: timeFormat,
        });
        */
        changeFormValue(formName, 'customPrompts', {
          active: event.prompts.length > 0,
          prompts:
            event.prompts.length > 0 ? indexesToPrompts(event.prompts) : [''],
        });
      })
      .catch((error) => {
        console.error(error);
      });
  }

  function onCloseBehaviorModal(created) {
    if (created && onCreated) {
      onCreated();
    }
    setOpenBehaviorModal(false);
    resetForm(formName);
    setQuickAddValue('');
    setQuickAddOptions([]);
  }

  return (
    <Container className={bem()}>
      <Grid>
        <Grid.Row>
          <Grid.Column width={2} className={bem('avatar-container')}>
            <div className="avatar">
              <Avatar avatar={user.avatar} />
            </div>
          </Grid.Column>
          <Grid.Column width={14} className={bem('input-container')}>
            <Dropdown
              placeholder="What do you want to do today?"
              noResultsMessage="No matching results found."
              value={quickAddValue}
              options={quickAddOptions}
              selection
              selectOnNavigation={false}
              floating
              openOnFocus
              closeOnBlur
              fluid
              search
              scrolling={false}
              className={cx(bem('input-dropdown'), 'selection')}
              onFocus={quickAddFocus}
              onSearchChange={quickAddChange}
              onChange={handleOpenStandardBehavior}
            >
              {quickAddContent}
            </Dropdown>
          </Grid.Column>
        </Grid.Row>
      </Grid>
      <BehaviorModal
        open={openBehaviorModal}
        onClose={onCloseBehaviorModal}
        planEndDate={endDate}
        type="single"
        form={formName}
        currentIntervalDate={intervalDate}
        isNewEvent={isNewEvent}
        newEventName={newEventName}
        isSingleEvent
        profile={user}
        hideOptions
      />
    </Container>
  );
};

QuickAdd.propTypes = {
  user: PropTypes.shape(),
  changeFormValue: PropTypes.func,
  recentBehaviors: PropTypes.arrayOf(PropTypes.shape()),
  fetchRecentBehaviors: PropTypes.func,
  recentEventTemplates: PropTypes.arrayOf(PropTypes.shape()),
  fetchRecentEventTemplates: PropTypes.func,
  resetForm: PropTypes.func,
  formName: PropTypes.string,
  onCreated: PropTypes.func,
  touchField: PropTypes.func,
  habits: PropTypes.arrayOf(PropTypes.shape()),
};

const mapStateToProps = (state, { user, categories }) => {
  const recentBehaviors = getRecentBehaviorsList(state, user);
  const recentEventTemplates = getRecentEventTemplatesList(state, user);
  return {
    recentBehaviors: recentBehaviors || [],
    recentEventTemplates,
    habits: categories.reduce(
      (prev, current) => [
        ...prev,
        ...current.options.map((e) => ({
          name: e.label,
          id: e.value,
          category: { pk: current.pk, name: current.name, slug: current.slug },
        })),
      ],
      []
    ),
  };
};

export default compose(
  withCategories({
    paramsSelector: () => true,
    fetchingSelector: getHabitsLoading,
  }),
  connect(mapStateToProps, {
    changeFormValue: change,
    fetchRecentBehaviors: fetchRecentBehaviorsAction,
    fetchRecentEventTemplates: fetchRecentEventTemplatesAction,
    resetForm: reset,
    touchField: touch,
  })
)(QuickAdd);
