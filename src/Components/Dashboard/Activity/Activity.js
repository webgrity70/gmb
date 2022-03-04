import React, { useContext, useState } from 'react';
import PropTypes from 'prop-types';
import { Popup } from 'semantic-ui-react';
import moment from 'moment-timezone';
import { connect } from 'react-redux';
import { touch, change } from 'redux-form';
import { Remarkable } from 'remarkable';
import { linkify } from 'remarkable/linkify';
import _ from 'lodash';
import Avatar from '../../Elements/Avatar';
import NextPlan from '../NextPlan';
import EventCheckIn from '../EventCheckIn';
import * as planActions from '../../../Actions/actions_plan';
import CategoryScore from '../../Elements/CategoryScore';
import CircularProgressBar from '../../Elements/CircularProgressBar';
import AccountabilityScore from '../../Elements/AccountabilityScore';
import EditExistingEvent, { formName } from '../../NewPlan/EditExistingEvent';
import { getInitialValues } from '../../Plan/EventDetailsModal/utils';
import PlanContext from '../../Plan/PlanContext';
import EditChallenge from '../../NewPlan/EditEvent';
import './Activity.scss';
import {
  parseDurationToMinutes,
  getTimeFromMinutes,
} from '../../NewPlan/utils';
import convertMeridiem from '../../../utils/convertMeridiem';
import indexesToPrompts from '../../../utils/indexesToPrompts';
import { challengeLocalDateStringToTemplateTimezone } from '../../../utils/convertTimezone';

const md = new Remarkable({ linkTarget: '_blank' }).use(linkify);
const toMarkdown = require('to-markdown');

function Activity(props) {
  const {
    profile,
    user,
    touchField,
    changeFormValue,
    nextPlan,
    updateEvent,
    onUpdatePlan,
  } = props;
  const [openEditModal, setOpenEditModal] = useState(false);
  const { timeFormat } = useContext(PlanContext);
  const date = nextPlan ? moment(nextPlan.start_date) : null;
  const accountabilityPopupTrigger = (
    <AccountabilityScore
      points={user.levels.global.points}
      className="mt-15"
      levelcolor={_.get(profile, 'levels.global.level.color')}
      levelName={_.get(profile, 'levels.global.level.name')}
    />
  );
  function onCloseEditModal(reload) {
    if (reload) onUpdatePlan();
    setOpenEditModal(false);
  }

  function onReschedule() {
    setOpenEditModal(true);
    if (nextPlan.challenge_id) {
      const [mHours, mMinutes, mFormat] = date
        .clone()
        .format(timeFormat)
        .replace(/\s/, ':')
        .split(/:/);
      const { hours: dHours, minutes: dMinutes } = getTimeFromMinutes(
        nextPlan.session_duration
      );
      changeFormValue(
        'edit-event',
        'disableTime',
        nextPlan.can_change_time === 'no'
      );
      changeFormValue(
        'edit-event',
        'disableDate',
        nextPlan.can_change_time !== 'yes'
      );
      changeFormValue('edit-event', 'time', {
        minutes: mMinutes,
        hours: mHours,
        format: mFormat,
      });
      changeFormValue('edit-event', 'duration', {
        hours: dHours > 0 ? String(dHours) : undefined,
        minutes: dMinutes > 0 ? String(dMinutes) : undefined,
      });
      changeFormValue('edit-event', 'milestone', {
        active: !!nextPlan.milestone,
        description: nextPlan.milestone,
      });
      changeFormValue('edit-event', 'location', nextPlan.location);
      changeFormValue('edit-event', 'customPrompts', {
        active: nextPlan.prompts.length > 0,
        prompts: nextPlan.prompts.length
          ? indexesToPrompts(nextPlan.prompts)
          : [''],
      });
      changeFormValue('edit-event', 'habit', {
        category: nextPlan.habit.category.name,
        habit: nextPlan.habit.name,
        slug: nextPlan.habit.category.slug,
      });
      changeFormValue(
        'edit-event',
        'description',
        md.render(nextPlan.specifics)
      );
      changeFormValue('edit-event', 'date', date);
    } else {
      touchField(formName, 'time', 'date', 'duration', 'location');
    }
  }

  function onSubmitEditRegular(data) {
    setOpenEditModal(false);
    const fullDate = data.date.clone().set({
      hours: convertMeridiem({
        hour: data.time.hours,
        format: data.time.format,
      }),
      minutes: Number(data.time.minutes),
      seconds: 0,
      milliseconds: 0,
    });
    const description = data.habit.description || data.description;
    updateEvent({
      id: nextPlan.pk,
      // TODO: Ensure this isn't an issue
      date: challengeLocalDateStringToTemplateTimezone({
        date: fullDate,
        restriction: nextPlan.challenge_timezone_restriction,
        timezone: nextPlan.challenge_template_timezone,
      }),
      category: data.habit.category,
      habit: data.habit.habit,
      place: data.location,
      createTemplate: false,
      duration: parseDurationToMinutes(
        `${data.duration.hours}h ${data.duration.minutes}m`
      ),
      ...(description && { specifics: toMarkdown(description) }),
      ...(data.milestone.active && { milestone: data.milestone.description }),
      ...(data.customPrompts.active && {
        prompts: data.customPrompts.prompts,
      }),
    });
    onUpdatePlan();
  }
  return (
    <div className="DashboardActivity flex-col md:flex-row">
      <div className="DashboardActivity__progress-col">
        <CircularProgressBar
          sqSize={220}
          points={_.get(profile, 'levels.global.points')}
          maxPoints={_.get(profile, 'levels.global.next_level.xp_requirement')}
          strokeColor={_.get(profile, 'levels.global.level.color')}
          nextLevel={_.get(profile, 'levels.global.next_level.name')}
        >
          <div className="DashboardActivity__avatar">
            <Avatar avatar={user.avatar} />
          </div>
        </CircularProgressBar>
        <Popup trigger={accountabilityPopupTrigger} position="top center">
          <Popup.Content>
            <div className="user-experience">
              <div className="categories">
                {user.levels.categories.map((categoryLevel) => (
                  <CategoryScore
                    categoryLevel={categoryLevel}
                    key={categoryLevel}
                  />
                ))}
              </div>
            </div>
          </Popup.Content>
        </Popup>
      </div>
      <NextPlan plan={nextPlan} onUpdatePlan={onUpdatePlan} {...props} />
      <EventCheckIn
        plan={nextPlan}
        onUpdatePlan={onUpdatePlan}
        onReschedule={onReschedule}
        {...props}
      />
      {nextPlan && openEditModal && (
        <EditExistingEvent
          open={openEditModal && !nextPlan.challenge_id}
          planId={nextPlan.plan_id}
          id={nextPlan.pk}
          onClose={onCloseEditModal}
          initialValues={getInitialValues({ event: nextPlan, timeFormat })}
        />
      )}
      {nextPlan && (
        <EditChallenge
          open={openEditModal && !!nextPlan.challenge_id}
          isRegularChallenge
          canChangeTime={nextPlan.can_change_time !== 'no'}
          onSubmitForm={onSubmitEditRegular}
          disableLocation={!nextPlan.can_change_location}
          disableDuration={!nextPlan.can_change_duration}
          disableSpecifics={!nextPlan.can_change_details}
          onClose={() => setOpenEditModal(false)}
        />
      )}
    </div>
  );
}

Activity.propTypes = {
  nextPlan: PropTypes.shape().isRequired,
  onUpdatePlan: PropTypes.func.isRequired,
  profile: PropTypes.shape().isRequired,
  touchField: PropTypes.func,
  updateEvent: PropTypes.func,
  changeFormValue: PropTypes.func,
  user: PropTypes.shape().isRequired,
};

export default connect(null, {
  touchField: touch,
  changeFormValue: change,
  updateEvent: planActions.updateEvent,
})(Activity);
