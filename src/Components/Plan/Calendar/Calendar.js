/* eslint-disable no-inner-declarations */
/* eslint-disable react/no-array-index-key */
import React, { useState, useEffect, useContext, useCallback } from 'react';
import moment from 'moment';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import groupBy from 'lodash/groupBy';
import BEMHelper from 'react-bem-helper';
import cx from 'classnames';
import get from 'lodash/get';
import Toolbar from '../Toolbar';
import Loading from '../../Loading';
import PlanContext from '../PlanContext';
import { getInitialDates } from '../utils';
import { fillDays, getLabel, getNewDate } from './utils';
import DayMonthEvent from '../DayMonthEvent';
import { getNewPeriod, VIEWS } from '../Toolbar/utils';
import WeekEvent from '../WeekEvent';
import usePrevious from '../../../utils/usePrevious';
import AgendaView from '../AgendaView';
import { getCreatePlanLoading } from '../../../selectors/requests';
import { fetchPlanWindow as fetchPlanWindowAction } from '../../../Actions/actions_plan';
import './Calendar.scss';

export const bem = BEMHelper({ name: 'Calendar', outputIsString: true });

const Calendar = ({
  events,
  user,
  handleNewDates,
  isLoading,
  isLoadingCreate,
  fetchPlanWindow,
}) => {
  const prevIsLoadingCreate = usePrevious(isLoadingCreate);
  const { view, startingDay, onChangeView: onChangeViewContext } = useContext(
    PlanContext
  );
  const [currentDate, changeCurrentDate] = useState(moment());
  const previousStartingDay = usePrevious(startingDay);
  const [weeks, setWeeks] = useState(
    fillDays({ currentDate, startingDay, view })
  );
  const loadingAgenda =
    isLoading && view === VIEWS.agenda && events.length === 0;
  const loadingMW = isLoading && view !== VIEWS.agenda;
  const shouldRenderloading = loadingAgenda || loadingMW;
  const onNavigate = useCallback(
    (action) => {
      const newPeriod = getNewDate({ action, currentDate, view });
      changeCurrentDate(newPeriod);
      const newData = fillDays({ currentDate: newPeriod, startingDay, view });
      setWeeks(newData);
    },
    [changeCurrentDate, setWeeks, currentDate, view, startingDay]
  );
  const onChangeView = useCallback(
    (v) => {
      onChangeViewContext(v);
      if (v !== VIEWS.agenda) {
        const newData = fillDays({ currentDate, startingDay, view: v });
        setWeeks(newData);
        const newDate = getNewPeriod({ view: v, date: currentDate });
        handleNewDates(newDate);
      }
    },
    [onChangeViewContext, currentDate, startingDay, view, setWeeks]
  );

  const onClickToday = useCallback(() => {
    const todayInterval = getInitialDates();
    handleNewDates({ ...todayInterval, toToday: true });
    const newPeriod = getNewDate({ currentDate: moment(), view });
    changeCurrentDate(newPeriod);
    const newData = fillDays({ currentDate: newPeriod, startingDay, view });
    setWeeks(newData);
  }, [handleNewDates, changeCurrentDate, getNewDate, setWeeks]);

  useEffect(() => {
    fetchPlanWindow();
  }, [fetchPlanWindow]);

  useEffect(() => {
    if (prevIsLoadingCreate && !isLoadingCreate) {
      const newDate = getNewPeriod({ view, date: currentDate });
      handleNewDates(newDate);
    }
  }, [prevIsLoadingCreate, isLoadingCreate]);
  useEffect(() => {
    if (
      previousStartingDay !== undefined &&
      startingDay !== previousStartingDay
    ) {
      const newData = fillDays({ currentDate, view });
      setWeeks(newData);
      const newDate = getNewPeriod({
        view,
        date: currentDate.clone().format(),
      });
      handleNewDates(newDate);
    }
  }, [startingDay, previousStartingDay]);

  if (shouldRenderloading) {
    return <Loading />;
  }
  return (
    <div>
      <Toolbar
        label={getLabel({ currentDate, view })}
        date={currentDate.clone().format()}
        onNavigate={onNavigate}
        handleNewDates={handleNewDates}
        onChangeView={onChangeView}
        onClickToday={onClickToday}
        calendarLink={user.ical_feed}
      />
      <div className={cx({ [bem('week-container')]: view === VIEWS.week })}>
        {view !== VIEWS.agenda ? (
          weeks.map((week, index) => (
            <div className={bem(`week-${view}`)} key={`week-${index}`}>
              {week.days.map((day) => {
                const match = events.find(
                  (e) =>
                    moment(e.start).format('DD-MM-YYYY') ===
                    day.clone().format('DD-MM-YYYY')
                );
                switch (view) {
                  case VIEWS.month:
                    return (
                      <div
                        className={bem('month-day')}
                        key={day.clone().format()}
                      >
                        <div
                          className={cx(bem('month-title'), {
                            today: day.isSame(moment(), 'day'),
                          })}
                        >
                          {day.clone().format('D')}
                        </div>
                        {match && <DayMonthEvent event={match} />}
                      </div>
                    );
                  case VIEWS.week:
                    return (
                      <div
                        className={bem('week-day')}
                        key={day.clone().format()}
                      >
                        <div
                          className={cx(bem('week-title'), {
                            today: day.isSame(moment(), 'day'),
                          })}
                        >
                          {day.clone().format('ddd D')}
                        </div>
                        <WeekEvent
                          events={get(match, 'events', [])}
                          userId={user.pk}
                        />
                      </div>
                    );
                  default:
                    return null;
                }
              })}
            </div>
          ))
        ) : (
          <AgendaView
            showWeekTitle={false}
            events={Object.values(
              groupBy(events, (e) => moment(e.start).week())
            )}
          />
        )}
      </div>
    </div>
  );
};

Calendar.propTypes = {
  events: PropTypes.arrayOf(PropTypes.shape()),
  user: PropTypes.shape(),
  isLoadingCreate: PropTypes.bool,
  handleNewDates: PropTypes.func,
  fetchPlanWindow: PropTypes.func,
  isLoading: PropTypes.bool,
};

const mapStateToProps = (state) => ({
  isLoadingCreate: getCreatePlanLoading(state),
});

export default connect(mapStateToProps, {
  fetchPlanWindow: fetchPlanWindowAction,
})(Calendar);
