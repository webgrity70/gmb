import React from 'react';
import moment from 'moment';
import cx from 'classnames';
import omit from 'lodash/omit';
import PropTypes from 'prop-types';
import Event from './Event';
import { bem } from './utils';
import './AgendaDay.scss';

const AgendaDay = ({ start, events, simple, hideIntentions }) => {
  const day = moment(start);
  const isToday = day.isSame(moment(), 'day');
  return (
    <div
      className={cx(bem(), { today: isToday })}
      {...(isToday && { id: 'agenda-today' })}
    >
      <div className={bem('title')}>
        <span>{day.format('MMM D')}</span>
        <span>{day.format('ddd')}</span>
      </div>
      <div className={bem('container')}>
        {events.map((event) => (
          <Event
            {...omit(event, 'location')}
            key={event.id}
            eventLocation={event.location}
            simple={simple}
            hideIntentions={hideIntentions}
          />
        ))}
      </div>
    </div>
  );
};

AgendaDay.propTypes = {
  start: PropTypes.string,
  simple: PropTypes.bool,
  hideIntentions: PropTypes.bool,
  events: PropTypes.arrayOf(PropTypes.shape()),
};

export default AgendaDay;
