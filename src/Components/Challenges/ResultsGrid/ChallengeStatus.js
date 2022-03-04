import React, { useState } from 'react';
import moment from 'moment-timezone';
import Countdown from 'react-countdown';
import PropTypes from 'prop-types';

import Counter from '../../Dashboard/Counter';

export default function ChallengeStatus({ challenge }) {
  const startDate = moment(challenge.start);
  const endDate = moment(challenge.finish);

  const challengeDateIsOnGoing = moment() > startDate && moment() < endDate;
  const [isOnGoing, setIsOnGoing] = useState(challengeDateIsOnGoing);

  if (isOnGoing) {
    return (
      <>
        <span>{`Ending in: `}</span>
        <br />
        <Countdown date={endDate.clone().format()} renderer={Counter} />
      </>
    );
  }
  if (moment() < startDate) {
    return (
      <>
        <span>
          {`Starts ${startDate.diff(moment(), 'hours') < 6 ? 'soon' : ''} in: `}
        </span>
        <br />
        <Countdown
          date={startDate.clone().format()}
          renderer={Counter}
          onComplete={() => setIsOnGoing(true)}
        />
      </>
    );
  }
  return null;
}

ChallengeStatus.propTypes = {
  challenge: PropTypes.shape(),
};
