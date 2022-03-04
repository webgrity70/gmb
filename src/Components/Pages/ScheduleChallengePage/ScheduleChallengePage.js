import React, { useState, useEffect, useContext, useCallback } from 'react';
import PropTypes from 'prop-types';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { Button } from 'semantic-ui-react';
import { toast } from 'react-toastify';
import isEmpty from 'lodash/isEmpty';
import { reduxForm, change } from 'redux-form';
import BEMHelper from 'react-bem-helper';
import moment from 'moment-timezone';
import { Remarkable } from 'remarkable';
import { linkify } from 'remarkable/linkify';
import {
  getTimeFromMinutes,
  getSlug,
  parseDurationToMinutes,
} from '../../NewPlan/utils';
import convertMeridiem from '../../../utils/convertMeridiem';
import PlanContext from '../../Plan/PlanContext';
import * as challengeActions from '../../../Actions/actions_challenges';
import { getChallengeDetails } from '../../../selectors/challenges';
import useActionOnCondition from '../../../hooks/use-action-on-condition';
import ScheduleCalendar from '../../Challenges/ScheduleCalendar';
import NotificationsModal from '../../NotificationsModal';
import history from '../../../history';
import { getLoadingJoinRegularChallenge } from '../../../selectors/requests';
import './ScheduleChallengePage.scss';
import indexesToPrompts from '../../../utils/indexesToPrompts';
import {
  challengeDateStringToLocalTimezone,
  challengeLocalDateStringToTemplateTimezone,
} from '../../../utils/convertTimezone';

const toMarkdown = require('to-markdown');

const bem = BEMHelper({ name: 'ScheduleChallengePage', outputIsString: true });
const md = new Remarkable({ linkTarget: '_blank' }).use(linkify);
const formName = 'schedule-challenge';

function ScheduleChallenge({
  submit,
  loading,
  challenge,
  fetchChallenge,
  changeFormValue,
  match: {
    params: { id },
  },
}) {
  const [openNotificationsModal, setOpenNotificationsModal] = useState(false);
  const { timeFormat } = useContext(PlanContext);
  const fetchChallengeCb = useCallback(() => fetchChallenge(id, true), [
    id,
    fetchChallenge,
  ]);
  useActionOnCondition(fetchChallengeCb, !challenge || !challenge.events);
  useEffect(() => {
    if (challenge && challenge.events) {
      const canSchedule =
        challenge.canChangeTime === '24h' ||
        challenge.canChangeDetails ||
        challenge.canChangeDuration ||
        challenge.canChangeLocation;
      const startMomentDate = moment(challenge.startDate);
      const endMomentDate = moment(challenge.endDate);
      const hasStarted = startMomentDate.clone().isBefore(moment());
      const hasFinished = endMomentDate.clone().isBefore(moment());
      const joinBeforeStartCond = hasStarted && challenge.mustJoinBeforeStart;
      const canJoin =
        !hasFinished && !joinBeforeStartCond && !challenge.chatJoined;
      if (canSchedule && canJoin) {
        const events = challenge.events.sort(
          (a, b) => new Date(a.date) - new Date(b.date)
        );
        const eventsObj = events.reduce((prev, event) => {
          const date = moment(new Date(event.date));
          if (date.isAfter(moment())) {
            const [mHours, mMinutes, mFormat] = date
              .clone()
              .format(timeFormat)
              .replace(/\s/, ':')
              .split(/:/);
            const { hours: dHours, minutes: dMinutes } = getTimeFromMinutes(
              event.duration
            );
            const eventData = {
              habit: {
                category: event.category,
                habit: event.habit,
                slug: getSlug(event.category),
                value: event.habitID,
                description: md.render(event.specifics),
              },
              templateID: event.templateID,
              time: { minutes: mMinutes, hours: mHours, format: mFormat },
              duration: {
                hours: dHours > 0 ? String(dHours) : undefined,
                minutes: dMinutes > 0 ? String(dMinutes) : undefined,
              },
              customPrompts: {
                active: event.prompts.length > 0,
                prompts: event.prompts.length
                  ? indexesToPrompts(event.prompts)
                  : [''],
              },
              location: event.place,
              milestone: {
                active: !!event.milestone,
                description: event.milestone || '',
              },
              date,
            };
            const dayUnix = date
              .clone()
              .set({
                minutes: mMinutes,
                hours: convertMeridiem({ hour: mHours, format: mFormat }),
                seconds: 0,
                milliseconds: 0,
              })
              .format('X');
            const key = `${event.habitID}/${dayUnix}`;
            return {
              ...prev,
              [key]: eventData,
            };
          }
          return prev;
        }, {});
        changeFormValue(formName, 'events', eventsObj);
      } else {
        toast.error("You can't schedule this challenge");
        history.push('/challenges');
      }
    }
  }, [challenge]);
  if (!challenge) return null;

  function onCloseNotifications(shouldSubmit) {
    if (shouldSubmit) {
      submit();
    }
    setOpenNotificationsModal(false);
  }
  return (
    <div className={bem()}>
      <h2>Schedule your challenge</h2>
      <h4>&quot;{challenge.name}&quot;</h4>
      <ScheduleCalendar
        formName={formName}
        canChangeTime={challenge.canChangeTime}
        canChangeDetails={challenge.canChangeDetails}
        canChangeDuration={challenge.canChangeDuration}
        canChangeLocation={challenge.canChangeLocation}
        isConsecutive={challenge.intervalType === 'Consecutive'}
      />
      <div className="flex justify-end mt-10 mx-8 md:mx-0">
        <Button
          basic
          color="orange"
          disabled={loading}
          onClick={() => history.push(`/challenges/${id}`)}
        >
          Cancel
        </Button>
        <Button
          color="orange"
          loading={loading}
          disabled={loading}
          onClick={() => setOpenNotificationsModal(true)}
        >
          Save Challenge
        </Button>
      </div>
      <NotificationsModal
        type="challenge"
        showToast={false}
        open={openNotificationsModal}
        onClose={onCloseNotifications}
      />
    </div>
  );
}

ScheduleChallenge.propTypes = {
  submit: PropTypes.func,
  loading: PropTypes.bool,
  match: PropTypes.shape(),
  challenge: PropTypes.shape(),
  fetchChallenge: PropTypes.func,
  changeFormValue: PropTypes.func,
};

const mapStateToProps = (state, props) => ({
  challenge: getChallengeDetails(state, props),
  loading: getLoadingJoinRegularChallenge(state),
});

export default compose(
  connect(mapStateToProps, {
    changeFormValue: change,
    fetchChallenge: challengeActions.fetchChallengeDetails,
  }),
  reduxForm({
    form: formName,
    onSubmit: async ({ events }, dispatch, { challenge, user }) => {
      const data = {
        id: challenge.id,
        name: challenge.name,
        timezone: challenge.timezone || challenge.templateTimezone,
        startDate: challenge.startDate,
        templateID: challenge.templateID,
        timezoneRestriction: challenge.timezoneRestriction,
        events: Object.values(events)
          .filter((event) => {
            if (!event) return false;
            const fullDate = moment(new Date(event.date)).set({
              hours: convertMeridiem({
                hour: event.time.hours,
                format: event.time.format,
              }),
              minutes: event.time.minutes,
            });
            return fullDate.isAfter(moment());
          })
          .map((event) => {
            const fullDate = moment(new Date(event.date)).set({
              hours: convertMeridiem({
                hour: event.time.hours,
                format: event.time.format,
              }),
              minutes: event.time.minutes,
            });
            return {
              date: fullDate.toISOString(),
              templateID: event.templateID,
              category: event.habit.category,
              habit: event.habit.habit,
              place: event.location,
              ...(!isEmpty(event.habit.description) && {
                specifics: toMarkdown(event.habit.description),
              }),
              duration: parseDurationToMinutes(
                `${event.duration.hours}h ${event.duration.minutes}m`
              ),
              ...(event.milestone.active && {
                milestone: event.milestone.description,
              }),
              ...(event.customPrompts.active && {
                prompts: event.customPrompts.prompts,
              }),
            };
          }),
      };
      const {
        location: { search },
      } = window;
      const skipJoin = search.includes('invitation');
      await dispatch(
        challengeActions.createPlanJoinRegularChallenge(data, user.pk, skipJoin)
      );
    },
  })
)(ScheduleChallenge);
