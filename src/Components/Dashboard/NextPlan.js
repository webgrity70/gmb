/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useState, useContext, useEffect } from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import $clamp from 'clamp-js';
import { Icon, Popup } from 'semantic-ui-react';
import moment from 'moment';
import { EventDetailsModal } from '../Plan';
import MarkDown from '../Elements/MarkDown';
import PlanContext from '../Plan/PlanContext';
import { parseMinutesToTime } from '../NewPlan/utils';
import parseTimeFormat from '../../utils/parseTimeFormat';
import ChallengeDetailsModal from '../Challenges/ChallengeDetailsModal';
import ChallengeStatus from '../Plan/ChallengeStatus';
import { CategoryIcon } from '../Elements/CategoriesIcons';
import Category from '../Utils/CategoryIcon';
import MakeIntoFlashModal from '../Elements/MakeIntoFlashModal';
import MediaModal from '../Elements/MediaModal';

const NextPlan = ({ plan, onUpdatePlan }) => {
  const { timeFormat } = useContext(PlanContext);
  const [openMakeIntoFlash, setOpenMakeIntoFlash] = useState(false);
  const date = plan ? moment(plan.start_date) : null;
  const challengeDateIsOnGoing =
    plan &&
    moment() > date.clone() &&
    moment() < date.clone().add(plan.session_duration, 'minutes');
  const [openModal, toggleModal] = useState(false);
  const partOfChallenge = plan && !!plan.challenge_id;
  const partOfPlan = plan && !!plan.plan_id;

  const [openMediaModal, setOpenMediaModal] = useState(false);
  const [mediaData, setMediaData] = useState('');
  const setMediaModal = (value) => {
    setMediaData(value);
    setOpenMediaModal(true);
  };

  let canCheckIn = false;
  if (plan) {
    if (plan.challenge_type === 'Flexible') {
      const checkInWindowEnd = moment(plan.start_date)
        .add(Number(plan.session_duration) + 60 * 24, 'minutes')
        .add(10, 'seconds');

      canCheckIn =
        moment() >= moment(plan.start_date) &&
        moment().isBefore(checkInWindowEnd);
    } else {
      canCheckIn = plan.can_check_in;
    }
  }
  const canMakeIntoFlash = plan && !canCheckIn && !partOfChallenge;
  useEffect(() => {
    const modl = document.getElementsByClassName('specifics')[0];
    if (modl) $clamp(modl, { clamp: 2 });
  }, [plan]);
  function onCloseModal(reload) {
    if (reload) onUpdatePlan();
    toggleModal(false);
  }
  function onOpenModal() {
    toggleModal(true);
  }
  function onStart() {
    onUpdatePlan();
  }
  function onMakeIntoFlash(e) {
    e.stopPropagation();
    setOpenMakeIntoFlash(true);
  }
  if (!plan) {
    return (
      <div className="next-activity">
        <div
          style={{
            textAlign: 'center',
            lineHeight: '45px',
          }}
          className="schedule"
        >
          <div>
            <span>"Nothing will come of nothing."</span>
            <span>- King Lear</span>
          </div>
        </div>
      </div>
    );
  }
  const activityLocationCx = cx(
    'activity-location mt-2 md:mt-0',
    plan.specifics ? 'mb-6' : 'mb-2'
  );
  const modifier =
    partOfChallenge && plan.challenge_type === 'Flash' ? 60 : 60 * 24;
  const checkInWindowEnd = moment(plan.start_date).add(
    Number(plan.session_duration) + modifier,
    'minutes'
  );
  const pillText = (() => {
    if (partOfChallenge) {
      return `${
        plan.challenge_type === 'Flash'
          ? 'Flash Challenge'
          : plan.challenge_name
      }`;
    }
    return plan.plan_name;
  })();
  const detailsBaseProps = {
    onOpen: onOpenModal,
    onClose: onCloseModal,
    trigger: (
      <div
        className={cx('next-activity pointer', {
          padded: !partOfChallenge && !partOfPlan,
        })}
      >
        {!partOfChallenge && !partOfPlan ? (
          <>
            <div>
              <div
                className={`category mb-0 md:mb-4 ${plan.habit.category.slug}`}
              >
                <div className="icon">
                  {Category.renderColorfulIcon(plan.habit.category.slug, true)}
                </div>
              </div>
              {plan.milestone && (
                <div className="milestone-container my-3">
                  <Icon name="flag" />
                  Milestone:
                  <span>{plan.milestone}</span>
                </div>
              )}
              <div className="date-and-time">
                {date.clone().format('dddd, MMM. D')} at{' '}
                {date.format(parseTimeFormat(timeFormat, plan.start_date))}
              </div>
              <div className="activity">{plan.habit.name}</div>
              <div className={activityLocationCx}>
                for {parseMinutesToTime(plan.session_duration)} at{' '}
                <MarkDown
                  source={plan.location}
                  setMediaModal={setMediaModal}
                />
              </div>
            </div>
            <div className="specifics">
              <a className="pointer">more</a>
            </div>
          </>
        ) : (
          <>
            <div>
              <div className={cx('challenge-header', plan.habit.category.slug)}>
                <div className="w-full flex justify-between items-start md:items-center flex-col md:flex-row">
                  <div className="challenge-time">
                    {date.clone().format('ddd, MMM. D')} at{' '}
                    {date
                      .clone()
                      .format(parseTimeFormat(timeFormat, plan.start_date))}
                  </div>
                  <div
                    className={cx(
                      'mt-2 md:mt-0 event-type',
                      partOfChallenge ? 'challenge' : 'part-plan'
                    )}
                  >
                    {partOfChallenge && plan.challenge_type !== 'Flash' && (
                      <Icon name="hourglass two" />
                    )}
                    {pillText}
                  </div>
                </div>
                <div className="challenge-status">
                  <ChallengeStatus
                    isJoined
                    date={date.clone()}
                    checkInWindowEnd={checkInWindowEnd.clone().format()}
                    duration={plan.session_duration}
                    isOnGoing={challengeDateIsOnGoing}
                    onStart={onStart}
                  />
                </div>
              </div>
              <div className="challenge-divider" />
              <div className={cx('px-6', plan.milestone ? 'mt-6' : 'mt-10')}>
                {plan.milestone && (
                  <div className="milestone-container challenge-milestone">
                    <Icon name="flag" />
                    Milestone:
                    <span>{plan.milestone}</span>
                  </div>
                )}
                <div className="challenge-activity mb-4">
                  <CategoryIcon {...plan.habit.category} active colorNoCircle />
                  {plan.habit.name}
                </div>
                <div className="challenge-desc">
                  for {parseMinutesToTime(plan.session_duration)} at{' '}
                  <MarkDown
                    source={plan.location}
                    setMediaModal={setMediaModal}
                  />
                </div>
                {partOfChallenge && (
                  <div className="challenge-members mt-2 md:mt-0">
                    {plan.number_of_participants} member
                    {plan.number_of_participants !== 1 && 's'}
                  </div>
                )}
              </div>
            </div>
            <div
              className={cx('specifics px-6 pt-4', {
                'pb-4': !canMakeIntoFlash,
              })}
            >
              <MarkDown
                source={plan.specifics}
                truncate
                truncateLength={90}
                setMediaModal={setMediaModal}
              />
            </div>
            <div
              className={cx(
                'px-6 pb-4 flex',
                canMakeIntoFlash ? 'justify-between' : 'justify-end',
                canMakeIntoFlash ? 'mt-1' : '-mt-4'
              )}
            >
              {canMakeIntoFlash && (
                <div className="make-flash">
                  <Icon name="lightning" color="orange" />
                  <a onClick={onMakeIntoFlash}>Make into a challenge</a>
                  <Popup
                    trigger={
                      <i
                        className="far fa-question-circle ml-2"
                        onClick={(e) => e.stopPropagation()}
                      />
                    }
                    on="hover"
                    inverted
                  >
                    Make this event into a challenge
                  </Popup>
                </div>
              )}
              <a className="pointer font-medium">more</a>
            </div>
          </>
        )}
      </div>
    ),
  };
  return (
    <>
      {partOfChallenge ? (
        <ChallengeDetailsModal
          {...detailsBaseProps}
          id={plan.challenge_id}
          open={openModal}
          challenge={{
            date: plan.start_date,
            duration: plan.session_duration,
            templateID: plan.event_template_id,
            planId: plan.plan_id,
            category: plan.habit.category.name,
            name: plan.challenge_name,
            specifics: plan.specifics,
            milestone: plan.milestone,
            habit: plan.habit.name,
            joinedAt: plan.joined_date,
            prompts: plan.prompts,
            participants: plan.number_of_participants,
            type: plan.challenge_type,
            place: plan.location,
            eventId: plan.pk,
            checkInWindowEnd,
            challengeManager: plan.challenge_creator,
          }}
        />
      ) : (
        <EventDetailsModal
          {...detailsBaseProps}
          event={plan}
          openModal={openModal}
          timeFormat={timeFormat}
          onDelete={() => onUpdatePlan()}
        />
      )}
      <MakeIntoFlashModal
        data={plan}
        open={openMakeIntoFlash}
        eventTitle={`${plan.habit.name} for ${parseMinutesToTime(
          plan.session_duration
        )} at ${plan.location}`}
        onClose={() => setOpenMakeIntoFlash(false)}
      />
      <MediaModal
        open={openMediaModal}
        onClose={() => setOpenMediaModal(false)}
        mediaData={mediaData}
      />
    </>
  );
};

NextPlan.propTypes = {
  plan: PropTypes.shape(),
  onUpdatePlan: PropTypes.func,
};

export default NextPlan;
