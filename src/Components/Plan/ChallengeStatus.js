/* eslint-disable no-underscore-dangle */
import React, { useState } from 'react';
import PropTypes from 'prop-types';
import moment from 'moment-timezone';
import Countdown from 'react-countdown';
import Counter from '../Dashboard/Counter';

function ChallengeStatus({
  date,
  joined,
  isOnGoing,
  onStart,
  checkInWindowEnd,
  duration,
  onComplete,
}) {
  // Seconds set to 0 to sync perfectly with system time
  const _date = date.clone().set('second', 0);
  const [_isOnGoing, _setIsOnGoing] = useState(isOnGoing);
  const _checkInWindowEnd = moment(checkInWindowEnd).set('second', 0);
  const [canCheckIn, setCanCheckIn] = useState(
    moment().isBefore(_checkInWindowEnd)
  );
  const isNotStarted = moment().isBefore(_date.clone());
  function onFinishChallenge() {
    setCanCheckIn(false);
    if (onComplete) onComplete();
  }
  if (isNotStarted && joined) {
    return (
      <span>
        Starts in:{' '}
        <Countdown
          date={_date.clone().format()}
          renderer={Counter}
          onComplete={() => _setIsOnGoing(true)}
          key="starts-in"
        />
      </span>
    );
  }
  if (isNotStarted) {
    return (
      <span>
        Not started yet:{' '}
        <Countdown
          date={_date.clone().format()}
          renderer={Counter}
          onComplete={() => {
            _setIsOnGoing(true);
            if (onStart) onStart();
          }}
          key="not-started"
        />
      </span>
    );
  }
  if (_isOnGoing) {
    return (
      <span>
        EVENT ENDS:{' '}
        <Countdown
          date={_date.clone().add(duration, 'minutes').format()}
          renderer={Counter}
          onComplete={() => [_setIsOnGoing(false), setCanCheckIn(true)]}
          key="event-ends"
        />
      </span>
    );
  }
  if (canCheckIn) {
    return (
      <span>
        FINISHED. CHECK-IN:
        <Countdown
          date={_checkInWindowEnd.clone().format()}
          renderer={Counter}
          onComplete={onFinishChallenge}
          key="finished"
        />{' '}
        LEFT
      </span>
    );
  }
  return <span>Finished</span>;
}

ChallengeStatus.propTypes = {
  checkInWindowEnd: PropTypes.string,
  onComplete: PropTypes.func,
  duration: PropTypes.number,
  date: PropTypes.shape(),
  isOnGoing: PropTypes.bool,
  onStart: PropTypes.oneOfType([PropTypes.func, PropTypes.oneOf([null])]),
  joined: PropTypes.bool,
};

export default ChallengeStatus;
