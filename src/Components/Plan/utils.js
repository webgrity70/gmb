/* eslint-disable no-undef */
/* eslint-disable no-else-return */
import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import { Icon } from 'semantic-ui-react';
import Countdown from 'react-countdown';
import truncate from 'truncate-html';
import Counter from '../Dashboard/Counter';
import MarkDown from '../Elements/MarkDown';
import { bem } from './DayMonthEvent';

const TYPES = {
  CATEGORY: 'category',
  BUDDY: 'buddy',
  YOU: 'you',
};

export function getEventIconClass({
  checkIn,
  intention,
  className,
  checkInWindowEnd,
}) {
  let iconClass = `calendar-icon pointer ${className}`;
  const diffDate = moment().diff(checkInWindowEnd, 'minutes');
  const pastUnchecked = !checkIn && diffDate >= 1;
  const emptyCheckIn = checkIn === 0;
  const emptyIntention = intention === 0;
  if (pastUnchecked || emptyCheckIn || emptyIntention) {
    iconClass += ' unchecked';
  } else if (checkIn > 0) {
    iconClass += ' checked';
  } else if (
    parseInt(intention, 10) === 0 ||
    moment() > moment(checkInWindowEnd)
  ) {
    iconClass += ` dull ${parseInt(intention, 10) === 0 ? 'not-ready' : ''}`;
  }
  return iconClass;
}

export const isNotCompleted = ({ checkIn, checkInWindowEnd }) =>
  checkIn === null && moment() > moment(checkInWindowEnd);

export const isActive = ({ checkInWindowEnd, start }) => {
  const momentStart = moment(start);
  const momentEnd = moment(checkInWindowEnd);
  const startDiff = moment().diff(momentStart, 'minutes') > 0;
  return startDiff && moment().diff(momentEnd, 'minutes') < 0;
};

export const isFinished = (start) =>
  moment().diff(moment(start), 'minutes') > 0;

export const getInitialDates = () => ({
  start: moment().startOf('month').startOf('week').format('YYYY-MM-DD'),
  end: moment().endOf('month').endOf('week').format('YYYY-MM-DD'),
});

export function Body({ event, truncateNotesSize }) {
  const showIntention = event.intention !== null;
  const showCheckIn = event.checkIn !== null;
  return (
    <Fragment>
      {/* ukranian code */}
      {(showIntention || showCheckIn) && (
        <div className="notes mb-2">
          {showIntention && (
            <div className="note">
              <b>Confirmation: </b>
              {event.intentionDate
                ? `${moment(event.intentionDate).format('hh:mm a')} | `
                : ''}
              {event.intention === 100 ? 'YES' : 'NO'}
              {event.intentionNote
                ? ` | ${
                    truncateNotesSize
                      ? truncate(event.intentionNote, truncateNotesSize)
                      : event.intentionNote
                  }`
                : ''}
            </div>
          )}
          {showCheckIn && (
            <div className="note">
              <b>Check in: </b>
              {event.checkInDate
                ? `${moment(event.checkInDate).format('hh:mm a')} | `
                : ''}
              {event.checkIn ? `${event.checkIn}%` : '0%'}
              {event.checkInNote
                ? ` | ${
                    truncateNotesSize
                      ? truncate(event.checkInNote, truncateNotesSize)
                      : event.checkInNote
                  }`
                : ''}
            </div>
          )}
        </div>
      )}
      {!!event.specifics && (
        <div className={bem('specifics')}>
          <MarkDown source={event.specifics} truncate />
        </div>
      )}
    </Fragment>
  );
}

const EventPropTypes = {
  event: PropTypes.shape(),
  truncateNotesSize: PropTypes.number,
};

Body.propTypes = EventPropTypes;
Body.defaultProps = {
  truncateNotesSize: 0,
};

export function Status({ event }) {
  const active = isActive(event);
  const finished = isFinished(event.checkInWindowEnd);
  if (finished) {
    return (
      <Fragment>
        <span>Finished </span>
        <Icon name="hourglass end" />
      </Fragment>
    );
  } else if (active) {
    return (
      <Fragment>
        <span>Active: </span>
        <Countdown date={event.checkInWindowEnd} renderer={Counter} />
        <span> left!</span>
        <Icon name="hourglass half" />
      </Fragment>
    );
  }
  return (
    <Fragment>
      <span>Not started yet</span>
      <Icon name="hourglass start" />
    </Fragment>
  );
}

Status.propTypes = EventPropTypes;

export function getFiltered(data, active, myUsername) {
  const dataMapped = data.map((date) => {
    const events = date.events.filter(
      (e) =>
        !active.some((filter) => {
          const [type, value] = filter.split('/');
          switch (type) {
            case TYPES.BUDDY:
              return e.user.name === value;
            case TYPES.CATEGORY:
              return e.category.name === value;
            case TYPES.YOU:
              return (
                e.habit.categorySlug === value && e.user.name === myUsername
              );
            default:
              return false;
          }
        })
    );
    return {
      ...date,
      events,
    };
  });
  const dataFiltered = dataMapped.filter((entry) => entry.events.length > 0);
  return dataFiltered;
}

export const timeFormaTypes = {
  HALF: 'hh:mm a',
  FULL: 'HH:mm',
};

export const shouldRenderCheckIn = ({
  myId,
  user,
  checkIn,
  start,
  checkInWindowEnd,
  intention,
}) =>
  user &&
  intention !== 0 &&
  checkIn === null &&
  moment(start).isBefore(moment(), 'minute') &&
  moment(checkInWindowEnd).isAfter(moment(), 'minute') &&
  user.id === myId;

export const eventDataToChallenge = (data) => ({
  date: data.start,
  duration: data.duration,
  templateID: data.eventTemplateID,
  category: data.habit.category,
  name: data.challengeName || data.challenge_name,
  specifics: data.specifics,
  planId: data.planID,
  milestone: data.milestone,
  milestoneOnTrack: data.milestoneOnTrack,
  milestonePoints: data.milestonePoints,
  habit: data.habit.name,
  participants: data.challengeParticipants || data.participants,
  joinedAt: data.challengeJoinDate,
  prompts: data.prompts,
  place: data.location,
  type: data.challengeType || 'Flash',
  eventId: data.id || data.pk,
  checkInWindowEnd:
    data.challengeType && data.challengeType !== 'Flash'
      ? moment(data.checkInWindowEnd)
      : moment(data.start).add(
          Number(data.duration || data.session_duration) + 60,
          'minutes'
        ),
  challengeManager: data.challengeManager || {
    name: data.challengeCreator,
    id: Number(data.challengeCreatorID),
  },
});
