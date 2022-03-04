import React, { useContext } from 'react';
import cx from 'classnames';
import moment from 'moment-timezone';
import PropTypes from 'prop-types';
import groupBy from 'lodash/groupBy';
import BEMHelper from 'react-bem-helper';
import { CategoryIcon } from '../CategoriesIcons';
import { getSlug, parseMinutesToDuration } from '../../NewPlan/utils';
import parseTimeFormat from '../../../utils/parseTimeFormat';
import PlanContext from '../../Plan/PlanContext';
import './WeeksEvents.scss';

const bem = BEMHelper({ name: 'WeeksEvents', outputIsString: true });

function WeeksEvents({
  events,
  timezone,
  className,
  showTime,
  timezoneRestriction,
}) {
  const { timeFormat } = useContext(PlanContext);
  const weeks = Object.values(groupBy(events, (e) => moment(e.date).week()));
  return (
    <div className={cx(bem(), className)}>
      {weeks.map((week, index) => {
        const days = Object.values(
          groupBy(week, (e) => moment(e.date).day())
        ).sort((a, b) => new Date(a[0].date) - new Date(b[0].date));
        const startMomentDate = moment(week[0].date);
        return (
          <div key={`weeks-events-${index + 1}`}>
            <div className={bem('title')}>
              WEEK {index + 1}:{' '}
              {startMomentDate.clone().startOf('week').format('MMM DD')} -{' '}
              {startMomentDate.clone().endOf('week').format('MMM DD')}
            </div>
            <div className="px-8 py-3">
              {days.map((dayEvents, daysIndex) => {
                const date = moment(dayEvents[0].date);
                return (
                  <div
                    key={`weeks-events-days-${daysIndex + 1}`}
                    className={cx(
                      'flex flex-wrap md:flex-no-wrap justify-center md:justify-start',
                      { 'mt-4': daysIndex > 0 }
                    )}
                  >
                    <div
                      className={bem('date', {
                        past: date.clone().endOf('day').isBefore(moment()),
                      })}
                    >
                      {date.clone().format('ddd, MMM DD')}
                    </div>
                    <div>
                      {dayEvents.map((event, eventIndex) => (
                        <div
                          className={cx('flex items-center', {
                            'mt-4': eventIndex > 0,
                          })}
                          key={`weeks-events-events-${eventIndex + 1}`}
                        >
                          <CategoryIcon
                            slug={getSlug(event.category)}
                            active
                            colorNoCircle
                          />
                          <span
                            className={bem('content', {
                              past: date
                                .clone()
                                .endOf('day')
                                .isBefore(moment()),
                            })}
                          >
                            {event.habit} for{' '}
                            {parseMinutesToDuration(event.duration)}{' '}
                            {showTime
                              ? `at ${moment(event.date)
                                  .clone()
                                  .format(
                                    parseTimeFormat(timeFormat, event.date)
                                  )}`
                              : ''}{' '}
                            at {event.place}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}
WeeksEvents.propTypes = {
  className: PropTypes.string,
  timezone: PropTypes.string,
  showTime: PropTypes.bool,
  timezoneRestriction: PropTypes.string,
  events: PropTypes.arrayOf(PropTypes.shape()),
};

WeeksEvents.defaultProps = {
  showTime: true,
};

export default WeeksEvents;
