/* eslint-disable no-restricted-globals */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import React, { useState } from 'react';
import cx from 'classnames';
import moment from 'moment-timezone';
import { Link } from 'react-router-dom';
import BEMHelper from 'react-bem-helper';
import Countdown from 'react-countdown';
import truncate from 'truncate-html';
import { Button, Icon, Popup } from 'semantic-ui-react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGhost, faCrown } from '@fortawesome/free-solid-svg-icons';
import PropTypes from 'prop-types';
import { getSlug } from '../../NewPlan/utils';
import parseTimeFormat from '../../../utils/parseTimeFormat';
import Notes from './Notes';
import './Intentions.scss';
import Counter from '../../Dashboard/Counter';
import MarkDown from '../../Elements/MarkDown';

const bem = BEMHelper({ name: 'Intentions', outputIsString: true });

function Intentions({
  type,
  myUser,
  category,
  onCheckIn,
  isStarted,
  intentions,
  timeFormat,
  isFinished,
  usersWinners,
  isFlashChallenge,
  checkInWindowEnd,
  checkinWindowEndFinished,
}) {
  const [filterValue, setFiltereValue] = useState('all');
  const userHasInteracted = intentions.some((e) => e.value !== null);
  // const myUserHasInteracted = intentions.find(e => e.userID === myUser.pk && e.value !== null);
  const isFinishedCond = (() => {
    if (isFlashChallenge) return isFinished;
    if (type === 'confirmation') return isStarted;
    return checkinWindowEndFinished;
  })();
  const successCount = intentions.filter((e) => e.value > 0).length;
  const missedCount = intentions.filter((intention) => intention.value === 0)
    .length;
  const waitingCount = intentions.filter((intention) => {
    const baseCond = intention.value === null && !isFinishedCond;
    if (type === 'confirmation') return baseCond && !isStarted;
    return baseCond;
  }).length;
  function getIsCheckinGhost(value) {
    return type === 'checkin' && isFinishedCond && value === null;
  }

  function getIsConfirmationGhost(value) {
    return type === 'confirmation' && isStarted && value === null;
  }

  const ghostCount = intentions.filter((intention) => {
    const isConfirmationGhost = getIsConfirmationGhost(intention.value);
    const isCheckinGhost = getIsCheckinGhost(intention.value);
    return isConfirmationGhost || isCheckinGhost;
  }).length;

  let intentionsFiltered = intentions.filter((e) => {
    switch (filterValue) {
      case 'ghost': {
        const isConfirmationGhost = getIsConfirmationGhost(e.value);
        const isCheckinGhost = getIsCheckinGhost(e.value);
        return isConfirmationGhost || isCheckinGhost;
      }
      case 'success':
        return e.value > 0;
      case 'missed':
        return e.value === 0;
      case 'waiting':
        return e.value === null && !isFinishedCond;
      default:
        return true;
    }
  });

  // split into 2 groups, one with time sorted by time
  let intentionsWithTime = intentions
    .filter((intention) => !!intention.date)
    .sort((a, b) => moment(a.date).unix() - moment(b.date).unix());
  //intentionsWithTime.map( intent => console.log( intent.date.unix(), intent.date.format(), intent.userName ) );

  // one without time, sorted by name
  let intentionsWithoutTime = intentions
    .filter((intention) => !intention.date)
    .sort((a, b) => a.userName.localeCompare(b.userName));
  //intentionsWithoutTime.map( intent => console.log( intent.userName ) );

  // recombine, timed first
  intentionsFiltered = intentionsWithTime.concat(intentionsWithoutTime);

  function setActive(newVal) {
    if (newVal !== filterValue) setFiltereValue(newVal);
  }

  if (!isStarted && !userHasInteracted) {
    return <div className={bem('not-started')}>Event hasn't started</div>;
  }

  return (
    <div className={cx('flex-col mb-6', bem())}>
      <div className={bem('header')}>
        <div
          className={cx(bem('header-label'), { active: filterValue === 'all' })}
          onClick={() => setActive('all')}
        >
          All
        </div>

        <div
          className={cx(bem('header-label'), {
            active: filterValue === 'success',
          })}
          onClick={() => setActive('success')}
        >
          <Icon name="check circle" size="small" />
          {successCount}
        </div>

        <div
          className={cx(bem('header-label'), {
            active: filterValue === 'missed',
          })}
          onClick={() => setActive('missed')}
        >
          <Icon name="minus circle" size="small" />
          {missedCount}
        </div>

        <div
          className={cx(bem('header-label'), {
            active: filterValue === 'ghost',
          })}
          onClick={() => setActive('ghost')}
        >
          <i className="icon ghost">
            <FontAwesomeIcon icon={faGhost} />
          </i>
          {ghostCount}
        </div>

        {waitingCount > 0 && (
          <div
            className={cx(bem('header-label'), {
              active: filterValue === 'waiting',
            })}
            onClick={() => setActive('waiting')}
          >
            <div className="hourglass-container">
              <Icon name="hourglass half" />
            </div>
            {waitingCount}
          </div>
        )}
      </div>

      <div className={bem('body')}>
        {intentionsFiltered.map((intention, intentionIndex) => {
          const isUserWinner = usersWinners.includes(intention.userID);
          const isSuccess = intention.value > 0;
          const isFailed = intention.value === 0;
          const isConfirmationGhost = getIsConfirmationGhost(intention.value);
          const isCheckinGhost = getIsCheckinGhost(intention.value);
          const isGhost = isConfirmationGhost || isCheckinGhost;
          const baseWaitingCond = intention.value === null && !isFinishedCond;
          const confirmationWaitingCond =
            type === 'confirmation' && baseWaitingCond && !isStarted;
          const showCheckInButton =
            isStarted &&
            intention.value === null &&
            intention.userID === myUser.pk &&
            !checkinWindowEndFinished &&
            type === 'checkin';
          const isWaiting = baseWaitingCond || confirmationWaitingCond;
          const userName =
            intention.userID === myUser.pk
              ? 'You'
              : intention.userName.substring(0, intention.userName.length - 1);

          const dateLabel = (() => {
            if (intention.date) {
              return moment(intention.date).format(
                parseTimeFormat(timeFormat, moment(intention.date))
              );
            }
            if (isFailed) return null;
            return '–';
          })();

          if (showCheckInButton) {
            return (
              <div
                className="flex items-center flex-wrap"
                key={`intention-no-checked-${intentionIndex + 1}`}
              >
                <span className={bem('ontime')}>
                  You haven't checked-in yet (
                  <Countdown
                    date={moment(checkInWindowEnd).clone().format()}
                    renderer={Counter}
                  />
                  {' left'} )
                </span>
                <Button
                  onClick={onCheckIn}
                  color="orange"
                  className={bem('check-in')}
                >
                  Check-in
                </Button>
              </div>
            );
          }

          return (
            <div
              className={cx('flex w-full flex-wrap items-baseline', {
                [bem('off')]:
                  !intention.value && intention.userID !== myUser.pk,
                'mb-1': intention < intentions.length - 1,
              })}
              key={`intention-${intentionIndex + 1}`}
            >
              {isWaiting && !isGhost && <Icon name="hourglass half" />}
              {isSuccess && <Icon name="check" />}
              {isFailed && <Icon name="minus" />}
              {isGhost && (
                <div className="ghost">
                  <FontAwesomeIcon icon={faGhost} />
                </div>
              )}

              <div
                className={bem('confirmation-time', {
                  local: intention.date && intention.userID !== myUser.pk,
                })}
              >
                {intention.date && intention.userID !== myUser.pk ? (
                  <Popup
                    inverted
                    className={bem('popup')}
                    trigger={<span>{dateLabel}</span>}
                    content={`User's local time: ${moment(intention.date)
                      .tz(intention.timezoneName)
                      .format(
                        parseTimeFormat(timeFormat, moment(intention.date))
                      )
                      .toUpperCase()} (${moment
                      .tz(intention.timezoneName)
                      .zoneName()})`}
                  />
                ) : (
                  <span>{dateLabel}</span>
                )}
              </div>

              {isFinishedCond && isUserWinner && (
                <FontAwesomeIcon icon={faCrown} className={bem('crown')} />
              )}

              {isFinishedCond && !isUserWinner && (
                <div className={bem('no-winner ')} />
              )}

              <div className={bem('checkin')}>
                <div className={bem('name')}>
                  <Link to={`/profile/${intention.userID}`} target="_blank">
                    {truncate(userName, 10)}
                  </Link>
                  :
                </div>

                {!isWaiting && (
                  <div className={bem('checkin-percentage')}>
                    {type === 'checkin' && `${intention.value || 0}%`}
                    {type === 'confirmation' &&
                      intention.value !== null &&
                      `${intention.value ? 'Yes' : 'No'}`}
                  </div>
                )}
              </div>

              {!isWaiting && !isNaN(intention.xp) && (
                <>
                  <div className={bem('points', [getSlug(category)])}>
                    +{intention.xp || 0}
                  </div>
                  {intention.prompts ? (
                    <div className={bem('notes')}>
                      <Notes
                        notes={[
                          ...intention.prompts,
                          { prompt: 'Note', promptValue: intention.note },
                        ]}
                      />
                    </div>
                  ) : (
                    <div className={cx('ml-2', bem('note'))}>
                      {<MarkDown source={intention.note} />}
                    </div>
                  )}
                </>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

Intentions.propTypes = {
  myUser: PropTypes.shape(),
  intentions: PropTypes.arrayOf(PropTypes.shape()),
  category: PropTypes.string,
  onCheckIn: PropTypes.func,
  timeFormat: PropTypes.string,
  checkinWindowEndFinished: PropTypes.bool,
  isStarted: PropTypes.bool,
  isFinished: PropTypes.bool,
  isFlashChallenge: PropTypes.bool,
  checkInWindowEnd: PropTypes.string,
  usersWinners: PropTypes.arrayOf(PropTypes.number),
  type: PropTypes.oneOf(['confirmation', 'checkin']),
};

export default Intentions;
