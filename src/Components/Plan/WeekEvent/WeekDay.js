import React, { useState, useEffect } from 'react';
import moment from 'moment';
import PropTypes from 'prop-types';
import cx from 'classnames';
import truncate from 'truncate-html';
import { Button, Icon } from 'semantic-ui-react';
import Avatar from '../../Elements/Avatar';
import { CategoryIcon } from '../../Elements/CategoriesIcons';
import {
  getSlug,
  getTotalPoints,
  parseMinutesToTimeShort,
} from '../../NewPlan/utils';
import { bem } from './utils';
import PopupDetails from '../PopupDetails';
import { shouldRenderCheckIn, eventDataToChallenge } from '../utils';
import EventDetailsModal from '../EventDetailsModal';
import parseTimeFormat from '../../../utils/parseTimeFormat';
import MarkDown from '../../Elements/MarkDown';
import ChallengeDetailsModal from '../../Challenges/ChallengeDetailsModal';
import history from '../../../history';

const WeekDay = ({ data, isMobile, userId, timeFormat, simple }) => {
  const [open, setOpenPopup] = useState(false);
  const shouldShowCheckIn = data.checkIn !== null && data.checkIn !== undefined;
  const hasInteraction = shouldShowCheckIn || data.intention !== null;
  const [openModal, toggleModal] = useState(false);
  const emptyCheckIn = data.checkIn === 0;
  const emptyIntention = data.intention === 0;
  const flashChallenge =
    data.challengeType !== null && data.challengeType === 'Flash';
  const checkInWindowEnd = (() => {
    if (data.challengeID) {
      const modifierM = flashChallenge ? 60 : 1440;
      return moment(data.start).add(data.duration + modifierM, 'minutes');
    }
    return moment(data.checkInWindowEnd);
  })();
  const isPast =
    data.checkIn === null && moment().diff(checkInWindowEnd, 'minutes') >= 1;
  const shouldShowTotal = hasInteraction || isPast;
  const points = getTotalPoints(data);
  const emptyEvent = isPast || emptyCheckIn || emptyIntention;
  const partOfPlan = data.planID !== null;
  const partOfChallenge = data.challengeID !== null;
  const milestone = data.milestone !== null;
  function onCloseModal() {
    toggleModal(false);
  }
  function onOpenModal() {
    toggleModal(true);
  }
  function onMoveMouse(e) {
    if (open) {
      const popupComp = document.getElementById(`popup-${data.id}`);
      const modalComp = document.getElementById(`details-${data.id}`);
      const challengesComp = document.getElementById(
        `challenge-${data.challengeID}`
      );
      const triggerComp = document.getElementById(`event-week-${data.id}`);
      const outsidePopup =
        triggerComp &&
        popupComp &&
        !triggerComp.contains(e.target) &&
        !popupComp.contains(e.target);
      if (outsidePopup && !modalComp && !challengesComp) {
        setOpenPopup(false);
      }
    }
  }
  useEffect(() => {
    document.addEventListener('mousemove', onMoveMouse);
    document.addEventListener('mouseclick', onMoveMouse);
    return () => {
      document.removeEventListener('mousemove', onMoveMouse);
      document.removeEventListener('mouseclick', onMoveMouse);
    };
  });
  function getPlanCreator() {
    if (data.user.id === userId) return 'You';
    return data.user.name;
  }
  const detailsBaseProps = {
    onOpen: onOpenModal,
    onClose: onCloseModal,
    trigger: (
      <div
        className={bem('container', data.habit.categorySlug)}
        key={data.id}
        id={`event-week-${data.id}`}
      >
        <div className={bem('content')} onMouseEnter={() => setOpenPopup(true)}>
          <PopupDetails
            data={data}
            open={open}
            onClosePopup={() => setOpenPopup(false)}
            position="top center"
            id={`popup-${data.id}`}
            trigger={
              <div className={bem('trigger')}>
                {flashChallenge && (
                  <div
                    className={cx(bem('flash'), { [bem('past')]: emptyEvent })}
                  >
                    <Icon name="lightning" />
                    <span>Flash challenge</span>
                  </div>
                )}
                {data.user && (
                  <div className={cx(bem('user'), { 'mt-6': flashChallenge })}>
                    <div className="flex items-center flex-1">
                      <div className={bem('avatar')}>
                        <Avatar avatar={data.user.avatar} id={data.user.id} />
                      </div>
                      <span>
                        {userId === data.user.id ? 'You' : data.user.name}
                      </span>
                    </div>
                    {shouldShowTotal && (
                      <span className={bem('points', data.habit.categorySlug)}>
                        +{points}
                      </span>
                    )}
                  </div>
                )}
                <div
                  className={cx(bem('category'), {
                    'mt-8 md:mt-0': flashChallenge,
                    [bem('past')]: emptyEvent,
                  })}
                >
                  <div className="flex flex-1 items-center">
                    <CategoryIcon
                      slug={getSlug(data.habit.category)}
                      colorNoCircle
                    />
                    <span>
                      {isMobile
                        ? data.habit.name
                        : truncate(data.habit.name, 3, { byWords: 3 })}{' '}
                      for {parseMinutesToTimeShort(data.duration)}
                    </span>
                  </div>
                  {shouldShowTotal && isMobile && (
                    <span className={bem('points', data.habit.categorySlug)}>
                      +{isPast ? 0 : points}
                    </span>
                  )}
                </div>

                <div
                  className={cx(bem('place'), { [bem('past')]: emptyEvent })}
                >
                  {moment(data.start).format(
                    parseTimeFormat(timeFormat, data.start)
                  )}
                  {data.location && ` - at ${data.location}`}
                </div>

                {partOfPlan && !partOfChallenge && (
                  <div
                    className={cx(bem('plan'), { [bem('past')]: emptyEvent })}
                  >
                    <div className="label">Plan:</div>
                    <div className="plan-name">{data.planName}</div>
                  </div>
                )}
                {partOfPlan && !partOfChallenge && !simple && (
                  <div
                    className={cx(bem('creator'), {
                      [bem('past')]: emptyEvent,
                    })}
                  >
                    Created by: <span>{getPlanCreator()}</span>
                  </div>
                )}
                {partOfChallenge && !flashChallenge && !simple && (
                  <div>
                    <div
                      className={cx(bem('challenge'), {
                        [bem('past')]: emptyEvent,
                      })}
                    >
                      <div className="mr-2">Challenge: </div>
                      <div className={bem('challenge-pill')}>
                        <Icon name="hourglass two" />
                        <span>{data.challengeName}</span>
                      </div>
                    </div>
                    <div
                      className={cx(bem('creator'), {
                        [bem('past')]: emptyEvent,
                      })}
                    >
                      Created by:{' '}
                      <span>
                        {data.challengeCreator == null
                          ? 'You'
                          : data.challengeCreator}
                      </span>
                    </div>
                  </div>
                )}
                {milestone && !simple && (
                  <div
                    className={cx(bem('milestone'), {
                      [bem('past')]: emptyEvent,
                    })}
                  >
                    Milestone: <span>{data.milestone}</span>{' '}
                    <span
                      className={bem('milestoneTrack', {
                        on: data.milestoneOnTrack,
                      })}
                    >
                      {data.milestoneOnTrack
                        ? 'On track'
                        : data.milestonePoints
                        ? 'Off track'
                        : null}
                    </span>
                  </div>
                )}
              </div>
            }
          />
          {!!data.specifics && (
            <div
              className={cx(bem('specifics'), { [bem('past')]: emptyEvent })}
            >
              {isMobile ? (
                <MarkDown source={data.specifics} />
              ) : (
                <MarkDown
                  source={data.specifics}
                  truncate
                  truncateLength={30}
                />
              )}
            </div>
          )}
          {shouldRenderCheckIn({ ...data, checkInWindowEnd, myId: userId }) && (
            <div className={bem('check-in')}>
              <span>You haven't checked-in yet!</span>
              <Button
                size="small"
                color="orange"
                onClick={(e) => [
                  e.stopPropagation(),
                  history.push(`/dashboard/check-in/${data.id}`),
                ]}
              >
                Check-in
              </Button>
            </div>
          )}
        </div>
      </div>
    ),
  };
  if (partOfChallenge) {
    return (
      <ChallengeDetailsModal
        {...detailsBaseProps}
        id={data.challengeID}
        open={openModal}
        challenge={eventDataToChallenge(data)}
      />
    );
  }
  return (
    <EventDetailsModal
      {...detailsBaseProps}
      event={data}
      openModal={openModal}
      timeFormat={timeFormat}
    />
  );
};

WeekDay.propTypes = {
  data: PropTypes.shape(),
  simple: PropTypes.bool,
  isMobile: PropTypes.bool,
  userId: PropTypes.number,
  timeFormat: PropTypes.string,
};

export default WeekDay;
