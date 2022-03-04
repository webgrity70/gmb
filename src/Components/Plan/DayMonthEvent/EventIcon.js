import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import { getEventIconClass } from '../utils';

const EventIcon = ({ data, ...props }) => {
  const isPartOfChallenge = data.challengeID;
  const isFlashChallenge =
    data.challengeType !== null && data.challengeType === 'Flash';
  const checkInWindowEnd = (() => {
    if (isPartOfChallenge) {
      if (isFlashChallenge) {
        return moment(data.start).add(60 + data.duration, 'minutes');
      }
      return moment(data.start).add(1, 'day');
    }
    return moment(data.checkInWindowEnd);
  })();
  return (
    <i
      id={`event-${data.id}`}
      className={getEventIconClass({ ...data, checkInWindowEnd })}
      {...props}
    />
  );
};

EventIcon.propTypes = {
  data: PropTypes.shape(),
};

export default EventIcon;
