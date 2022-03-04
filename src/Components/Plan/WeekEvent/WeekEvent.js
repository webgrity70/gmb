import React, { useContext } from 'react';
import withSizes from 'react-sizes';
import PropTypes from 'prop-types';
import PlanContext from '../PlanContext';
import WeekDay from './WeekDay';
import { bem } from './utils';

import './WeekEvent.scss';

const WeekEvent = ({ events, isMobile, userId, simple }) => {
  const { timeFormat } = useContext(PlanContext);
  return (
    <div className={bem()}>
      {events.map((e) => (
        <WeekDay
          data={e}
          key={e.id}
          simple={simple}
          userId={userId}
          isMobile={isMobile}
          timeFormat={timeFormat}
        />
      ))}
    </div>
  );
};

WeekEvent.propTypes = {
  userId: PropTypes.number,
  simple: PropTypes.bool,
  isMobile: PropTypes.bool,
  events: PropTypes.arrayOf(PropTypes.shape()),
};

export default withSizes(({ width }) => ({
  isMobile: width < 768,
}))(WeekEvent);
