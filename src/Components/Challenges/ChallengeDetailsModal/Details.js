import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment-timezone';
import { Popup } from 'semantic-ui-react';
import { bem } from './utils';
import HowToEarnPoints from '../HowToEarnPoints/HowToEarnPoints';
import ChallengeStatus from '../../Plan/ChallengeStatus';
import parseTimeFormat from '../../../utils/parseTimeFormat';

function CDDetails({
  date,
  loaded,
  onClose,
  duration,
  isJoined,
  userOwner,
  timeFormat,
  isMyChallenge,
  checkInWindowEnd,
  startDateFormatted,
}) {
  const challengeDateIsOnGoing =
    date &&
    moment() > date.clone() &&
    moment() < date.clone().add(duration, 'minutes');
  const userTimezone = userOwner
    ? userOwner.timezone || userOwner.timezoneName
    : null;

  return (
    <div className={bem('details')}>
      <div>
        {date.clone().format('MMM D, ddd').toUpperCase()} |{' '}
        {userOwner && userTimezone && !isMyChallenge ? (
          <Popup
            inverted
            className={bem('popup')}
            trigger={
              <span className={bem('popup-trigger')}>{startDateFormatted}</span>
            }
            content={`Challenge owner's local time: ${date
              .clone()
              .tz(userTimezone)
              .format(parseTimeFormat(timeFormat, date))
              .toUpperCase()} (${moment.tz(userTimezone).zoneName()})`}
          />
        ) : (
          startDateFormatted
        )}{' '}
        |
        {loaded && (
          <span className={bem('status')}>
            {' '}
            <ChallengeStatus
              date={date}
              duration={duration}
              checkInWindowEnd={checkInWindowEnd.format()}
              isOnGoing={challengeDateIsOnGoing}
              isJoined={isJoined}
            />
          </span>
        )}
      </div>
      <HowToEarnPoints trigger={<span>How to earn the most points?</span>} />
    </div>
  );
}

CDDetails.propTypes = {
  loaded: PropTypes.bool,
  date: PropTypes.shape(),
  onClose: PropTypes.func,
  isJoined: PropTypes.bool,
  userOwner: PropTypes.shape(),
  duration: PropTypes.number,
  timeFormat: PropTypes.string,
  isMyChallenge: PropTypes.bool,
  checkInWindowEnd: PropTypes.shape(),
  startDateFormatted: PropTypes.string,
};

export default CDDetails;
