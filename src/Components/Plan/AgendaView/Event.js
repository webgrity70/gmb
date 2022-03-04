/* eslint-disable camelcase */
import React, { useContext, useState } from 'react';
import { connect } from 'react-redux';
import moment from 'moment';
import { withRouter } from 'react-router-dom';
import { compose } from 'redux';
import withSizes from 'react-sizes';
import { Button, Icon } from 'semantic-ui-react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import truncate from 'truncate-html';
import EventDetailsModal from '../EventDetailsModal';
import PlanContext from '../PlanContext';
import { CategoryIcon } from '../../Elements/CategoriesIcons';
import {
  getSlug,
  getTotalPoints,
  parseMinutesToTimeShort,
} from '../../NewPlan/utils';
import parseTimeFormat from '../../../utils/parseTimeFormat';
import { bem } from './utils';
import { shouldRenderCheckIn, eventDataToChallenge } from '../utils';
import { getMyProfileId } from '../../../selectors/profile';
import Avatar from '../../Elements/Avatar';
import MarkDown from '../../Elements/MarkDown';
import ChallengeDetailsModal from '../../Challenges/ChallengeDetailsModal';
import { Fragment } from 'react';

const Event = ({
  id,
  checkIn,
  intention,
  eventLocation,
  checkInWindowEnd,
  checkInPoints,
  hideIntentions,
  check_in_points,
  challengeID,
  challengeCreator,
  intention_points,
  intentionPoints,
  challengeJoinDate,
  intentionDate,
  simple,
  intentionNote,
  checkInDate,
  checkInNote,
  specifics,
  habit,
  user,
  start,
  myId,
  history,
  planName,
  planID,
  planCreator,
  challengeName,
  eventTemplateID,
  challengeType,
  prompts,
  date,
  duration,
  milestone,
  milestoneOnTrack,
  milestonePoints,
}) => {
  const eventBaseProps = {
    intention,
    checkIn,
    intentionDate,
    intentionNote,
    planID,
    checkInDate,
    checkInNote,
    prompts,
    milestone,
    milestoneOnTrack,
    milestonePoints,
  };
  const detailsModalProps = {
    ...eventBaseProps,
    eventLocation,
    checkInWindowEnd,
    challengeJoinDate,
    checkInPoints,
    check_in_points,
    intention_points,
    intentionPoints,
    id,
    specifics,
    habit,
    user,
    start,
    planName,
    challengeName,
    date,
    location: eventLocation,
    challengeType,
    eventTemplateID,
    challengeCreator,
    duration,
  };
  const { timeFormat } = useContext(PlanContext);
  const [openModal, toggleModal] = useState(false);
  const shouldShowCheckIn = checkIn !== null && checkIn !== undefined;
  const hasInteraction = shouldShowCheckIn || intention !== null;
  const emptyCheckIn = checkIn === 0;
  const emptyIntention = intention === 0;
  const partOfPlan = planName !== null;
  const partOfChallenge = challengeName !== null;
  const flashChallenge = challengeType !== null && challengeType === 'Flash';
  const eventCheckInWindowEnd = (() => {
    if (partOfChallenge) {
      if (flashChallenge) {
        return moment(start)
          .add(60 + duration, 'minutes')
          .format();
      }
      return moment(start).add(1, 'day').format();
    }
    return checkInWindowEnd;
  })();
  const isPast =
    checkIn === null &&
    moment().diff(moment(eventCheckInWindowEnd), 'minutes') >= 1;
  const shouldShowTotal = hasInteraction || isPast;
  const points = getTotalPoints({
    check_in_points,
    checkInPoints,
    intention_points,
    intentionPoints,
  });
  const emptyEvent = isPast || emptyCheckIn || emptyIntention;
  const hasMilestone = milestone !== null;

  const canRenderCheckIn = shouldRenderCheckIn({
    myId,
    user,
    checkIn,
    start,
    checkInWindowEnd: eventCheckInWindowEnd,
  });

  function onCloseModal() {
    toggleModal(false);
  }
  function onOpenModal() {
    toggleModal(true);
  }
  const detailsBaseProps = {
    onOpen: onOpenModal,
    onClose: onCloseModal,
    trigger: (
      <div className={bem('event')}>
        {flashChallenge && (
          <div className={bem('flash')}>
            <Icon name="lightning" />
            <span>Flash challenge: {challengeName}</span>
          </div>
        )}
        <div
          className={cx(bem('appointment', habit.categorySlug), {
            'py-2': flashChallenge,
            [bem('past')]: emptyEvent,
          })}
        >
          {user && user.id !== myId && (
            <div className={bem('buddy')}>
              <div className={bem('avatar-container')}>
                <Avatar avatar={user.avatar} />
              </div>
              <span>{user.name}</span>
            </div>
          )}
          {moment(start).format(parseTimeFormat(timeFormat, start))}
          <span>at {eventLocation}</span>
          {hasMilestone && (
            <div className={bem('milestone')}>
              <Icon name="flag" />
              <span>Milestone</span>
              <div className="milestone-name">
                {milestone}{' '}
                <span
                  className={bem('milestoneTrack', { on: milestoneOnTrack })}
                >
                  {milestoneOnTrack
                    ? 'On track'
                    : milestonePoints
                    ? 'Off track'
                    : null}
                </span>
              </div>
            </div>
          )}
        </div>
        <div className={cx(bem('details'), { [bem('past')]: emptyEvent })}>
          <div
            className={cx('flex justify-between w-full', {
              'pt-1': flashChallenge,
            })}
          >
            <div className={bem('category')}>
              <CategoryIcon slug={getSlug(habit.category)} colorNoCircle />
              <div>
                <span>
                  {habit.name} for {parseMinutesToTimeShort(duration)}
                </span>
              </div>
            </div>
            {shouldShowTotal && (
              <div>
                <span className={bem('points', !isPast && habit.categorySlug)}>
                  +{isPast && !points ? 0 : points}
                </span>
              </div>
            )}
          </div>
          {!simple && (
            <div>
              {partOfPlan && !partOfChallenge && (
                <div className={bem('plan')}>
                  Plan: <span>{truncate(planName, 6, { byWords: 6 })}</span> |
                  Created by:{' '}
                  <strong>{planCreator == null ? 'You' : planCreator}</strong>
                </div>
              )}
              {partOfChallenge && !flashChallenge && (
                <div className={bem('challenge')}>
                  Challenge:{' '}
                  <span>
                    <Icon name="hourglass two" />
                    {truncate(challengeName, 6, { byWords: 6 })}
                  </span>{' '}
                  | Created by:{' '}
                  <strong>
                    {challengeCreator == null ? 'You' : challengeCreator}
                  </strong>{' '}
                  {'  '}| Joined on{' '}
                  {moment(challengeJoinDate).format('MMM D, YYYY')}
                </div>
              )}
              {partOfChallenge && flashChallenge && (
                <div className={bem('plan')}>
                  Created by:{' '}
                  <strong>
                    {challengeCreator == null ? 'You' : challengeCreator}
                  </strong>
                  {' | '}
                  Joined on {moment(challengeJoinDate).format('MMM D, YYYY')}
                </div>
              )}
            </div>
          )}
          <div className={bem('description')}>
            <MarkDown source={specifics} />
          </div>
          {!hideIntentions && (
            <Fragment>
              <div className={bem('confirmed')}>
                <div className="label">
                  Confirmed: {intention ? 'YES' : '--'}
                </div>
                <div className="note">
                  {intentionNote
                    ? truncate(intentionNote, 6, { byWords: 6 })
                    : ''}
                  {intentionDate
                    ? ` - ${moment(intentionDate).format('hh:mm a')}`
                    : ''}
                  <span
                    className={bem('points', !isPast && habit.categorySlug)}
                  >
                    {intentionPoints ? `+${intentionPoints}` : ''}
                  </span>
                </div>
              </div>
              <div className={bem('checkedin')}>
                <div className="label">
                  Check-in: {checkIn ? `${checkIn}%` : '--'}
                </div>
                <div className="note">
                  {checkInNote ? truncate(checkInNote, 6, { byWords: 6 }) : ''}
                  {checkInDate
                    ? ` - ${moment(checkInDate).format('hh:mm a')}`
                    : ''}
                  <span
                    className={bem('points', !isPast && habit.categorySlug)}
                  >
                    {checkInPoints ? `+${checkInPoints}` : ''}
                  </span>
                  {checkIn ? (
                    <Icon
                      name="check circle"
                      className={bem('checkmark', habit.categorySlug)}
                    />
                  ) : (
                    ''
                  )}
                </div>
              </div>
            </Fragment>
          )}
          {(hasInteraction || canRenderCheckIn) && !hideIntentions && (
            <div className={bem('notes')}>
              {canRenderCheckIn && (
                <div className={bem('checkin-container')}>
                  <Button
                    color="orange"
                    className={bem('checkin')}
                    onClick={(e) => [
                      e.stopPropagation(),
                      history.push(`/dashboard/check-in/${id}`),
                    ]}
                  >
                    Check-in
                  </Button>
                </div>
              )}
            </div>
          )}
        </div>
        {/*<span>{`EventId: ${id}_`}</span>*/}
      </div>
    ),
  };
  if (partOfChallenge) {
    return (
      <ChallengeDetailsModal
        {...detailsBaseProps}
        id={challengeID}
        open={openModal}
        challenge={eventDataToChallenge(detailsModalProps)}
      />
    );
  }
  return (
    <EventDetailsModal
      {...detailsBaseProps}
      event={detailsModalProps}
      openModal={openModal}
      timeFormat={timeFormat}
    />
  );
};

Event.propTypes = {
  checkIn: PropTypes.oneOfType([PropTypes.number, PropTypes.oneOf([null])]),
  intention: PropTypes.oneOfType([PropTypes.number, PropTypes.oneOf([null])]),
  checkInPoints: PropTypes.oneOfType([
    PropTypes.number,
    PropTypes.oneOf([null]),
  ]),
  check_in_points: PropTypes.oneOfType([
    PropTypes.number,
    PropTypes.oneOf([null]),
  ]),
  intention_points: PropTypes.oneOfType([
    PropTypes.number,
    PropTypes.oneOf([null]),
  ]),
  intentionPoints: PropTypes.oneOfType([
    PropTypes.number,
    PropTypes.oneOf([null]),
  ]),
  intentionNote: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.oneOf([null]),
  ]),
  checkInNote: PropTypes.oneOfType([PropTypes.string, PropTypes.oneOf([null])]),
  history: PropTypes.shape(),
  checkInWindowEnd: PropTypes.string,
  intentionDate: PropTypes.string,
  challengeCreator: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.oneOf([null]),
  ]),
  checkInDate: PropTypes.string,
  start: PropTypes.string,
  eventLocation: PropTypes.string,
  habit: PropTypes.shape(),
  id: PropTypes.number,
  challengeJoinDate: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.oneOf([null]),
  ]),
  planName: PropTypes.oneOfType([PropTypes.string, PropTypes.oneOf([null])]),
  planCreator: PropTypes.oneOfType([PropTypes.string, PropTypes.oneOf([null])]),
  challengeName: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.oneOf([null]),
  ]),
  planID: PropTypes.oneOfType([PropTypes.number, PropTypes.oneOf([null])]),
  challengeType: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.oneOf([null]),
  ]),
  date: PropTypes.string,
  duration: PropTypes.number,
  user: PropTypes.shape(),
  myId: PropTypes.number,
  eventTemplateID: PropTypes.number,
  specifics: PropTypes.string,
  challengeID: PropTypes.number,
  simple: PropTypes.bool,
  prompts: PropTypes.arrayOf(PropTypes.shape()),
  hideIntentions: PropTypes.bool,
  milestone: PropTypes.string,
  milestoneOnTrack: PropTypes.bool,
  milestonePoints: PropTypes.number,
};

const mapStateToProps = (state) => ({
  myId: getMyProfileId(state),
});

const ComposedComp = compose(
  connect(mapStateToProps),
  withSizes(({ width }) => ({
    isMobile: width < 768,
    isTablet: width >= 768 && width <= 991,
  })),
  withRouter
)(Event);

export default React.memo(ComposedComp);
