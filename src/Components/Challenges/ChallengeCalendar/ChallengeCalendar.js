import React, { useState, useEffect, useContext, useCallback } from 'react';
import moment from 'moment';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import BEMHelper from 'react-bem-helper';
import groupBy from 'lodash/groupBy';
import cx from 'classnames';
import get from 'lodash/get';
import Loading from '../../Loading';
import * as challengeActions from '../../../Actions/actions_challenges';
import { getInitialDates } from '../../Plan/utils';
import { fillDays, getLabel, getNewDate } from '../../Plan/Calendar/utils';
import DayMonthEvent from '../../Plan/DayMonthEvent';
import { getNewPeriod, VIEWS } from '../../Plan/Toolbar/utils';
import WeekEvent from '../../Plan/WeekEvent';
import usePrevious from '../../../utils/usePrevious';
import AgendaView from '../../Plan/AgendaView';
import { Toolbar } from '../../Plan';
import PlanContext from '../../Plan/PlanContext';
import { getCalendarList } from '../../../selectors/challenges';
import { getChallengePlanLoading } from '../../../selectors/requests';
import './ChallengeCalendar.scss';

export const bem = BEMHelper({
  name: 'ChallengeCalendar',
  outputIsString: true,
});

function ChallengeCalendar({
  id,
  user,
  events,
  isLoading,
  fetchCalendarWindow,
  fetchCalendarPlan,
}) {
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
  useEffect(() => {
    const { start, end } = getInitialDates();
    fetchCalendarPlan(id, start, end);
  }, []);

  const handleNewDates = useCallback(
    async ({ start, end, toToday }) => {
      if (!isLoading) {
        await fetchCalendarPlan(id, start, end);
        if (toToday) {
          const agendaScroll = document.getElementById('agenda-scroll');
          const todayEl = document.getElementById('agenda-today');
          if (todayEl && agendaScroll) {
            agendaScroll.scrollTo(0, todayEl.offsetTop);
          }
        }
      }
    },
    [fetchCalendarPlan, isLoading]
  );
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
      }
      const newDate = getNewPeriod({ view: v, date: currentDate });
      handleNewDates(newDate);
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
  }, [changeCurrentDate, getNewDate, setWeeks]);

  useEffect(() => {
    fetchCalendarWindow(id);
  }, [fetchCalendarWindow, id]);

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
    <div className={bem()}>
      <Toolbar
        label={getLabel({ currentDate, view })}
        date={currentDate.clone().format()}
        onNavigate={onNavigate}
        handleNewDates={handleNewDates}
        onChangeView={onChangeView}
        onClickToday={onClickToday}
        hideSettings
        calendarLink={user.ical_feed}
      />
      <div className={cx({ [bem('week-container')]: view === VIEWS.week })}>
        {view !== VIEWS.agenda ? (
          weeks.map((week, index) => (
            <div className={bem(`week-${view}`)} key={`week-${index + 1}`}>
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
                        {match ? (
                          <DayMonthEvent event={match} />
                        ) : (
                          <div className={bem('month-empty')} />
                        )}
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
                          simple
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
            simple
            events={Object.values(
              groupBy(events, (e) => moment(e.start).week())
            )}
            type="profile"
            showWeekTitle
            id={id}
            isLoading={isLoading}
            hideIntentions
          />
        )}
      </div>
    </div>
  );
}

ChallengeCalendar.propTypes = {
  id: PropTypes.number,
  user: PropTypes.shape(),
  isLoading: PropTypes.bool,
  fetchCalendarWindow: PropTypes.func,
  fetchCalendarPlan: PropTypes.func,
  events: PropTypes.arrayOf(PropTypes.shape()),
};

const mapStateToProps = (state, { id }) => ({
  events: getCalendarList(state, { id }),
  isLoading: getChallengePlanLoading(state),
});

export default connect(mapStateToProps, {
  fetchCalendarWindow: challengeActions.fetchCalendarWindow,
  fetchCalendarPlan: challengeActions.fetchCalendarPlan,
})(ChallengeCalendar);
