import React, { useContext } from 'react';
import cx from 'classnames';
import PropTypes from 'prop-types';
import BEMHelper from 'react-bem-helper';
import { CategoryIcon } from '../CategoriesIcons';
import parseTimeFormat from '../../../utils/parseTimeFormat';
import PlanContext from '../../Plan/PlanContext';
import './WeeksEventsPlan.scss';
import { capitalize } from 'lodash';

const bem = BEMHelper({ name: 'WeeksEventsPlan', outputIsString: true });

function WeeksEventsPlan({ weekDays, index }) {
  const { timeFormat } = useContext(PlanContext);
  return (
    <div className={cx(bem())}>
      <div key={`weeks-events-${index + 1}`}>
        <div className={bem('title')}>WEEK {index + 1}: </div>
        <div className="px-8 py-3">
          {weekDays.map((dayEvents, daysIndex) => {
            return (
              <div
                key={`weeks-events-days-${daysIndex + 1}`}
                className={cx(
                  'flex flex-wrap md:flex-no-wrap justify-center md:justify-start',
                  { 'mt-4': daysIndex > 0 }
                )}
              >
                <div className={bem('date')}>{capitalize(dayEvents.day)}</div>
                <div>
                  {dayEvents.events.map((event, eventIndex) => (
                    <div
                      className={cx('flex items-center', {
                        'mt-4': eventIndex > 0,
                      })}
                      key={`weeks-events-events-${eventIndex + 1}`}
                    >
                      <CategoryIcon
                        slug={event.habit.slug}
                        active
                        colorNoCircle
                      />
                      <span className={bem('content')}>
                        {event.habit.text} for {event.sessionDuration} at{' '}
                        {event.time
                          .clone()
                          .format(
                            parseTimeFormat(
                              timeFormat,
                              event.time.clone().format()
                            )
                          )}{' '}
                        at
                        {` ${event.place}`}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
WeeksEventsPlan.propTypes = {
  className: PropTypes.string,
  weekDays: PropTypes.arrayOf(PropTypes.shape()),
  index: PropTypes.any,
};

export default WeeksEventsPlan;
