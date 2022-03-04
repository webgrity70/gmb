/* eslint-disable no-underscore-dangle */
import React, { Fragment, useRef, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { Button } from 'semantic-ui-react';
import { connect } from 'react-redux';
import moment from 'moment';
import InfiniteScroll from 'react-infinite-scroller';
import { bem } from '../Calendar';
import AgendaDay from './AgendaDay';
import { fetchCalendarList as fetchCalendarListAction } from '../../../Actions/actions_plan';
import { fetchCalendarPlan as fetchChallengeCalendarListAction } from '../../../Actions/actions_challenges';
import * as plansSelectors from '../../../selectors/plans';
import { getChallengePlanLoading } from '../../../selectors/requests';
import * as challengesSelectors from '../../../selectors/challenges';

const DIRECTIONS = {
  TOP: 'top',
  BOTTOM: 'bottom',
};

const AgendaView = ({
  fetchPlanCalendarList,
  fetchChallengeCalendarList,
  events: weeks,
  isLoading,
  id,
  type,
  showWeekTitle,
  hasMorePrevious,
  hasMore,
  simple,
  hideIntentions,
}) => {
  const agendaScroll = document.getElementById('agenda-scroll') || {};
  const showPaginationButtons =
    agendaScroll && agendaScroll.scrollHeight <= agendaScroll.clientHeight;
  const lastScrollTop = useRef(0);
  const [lastBaseDate, setLastBaseDate] = useState(null);
  const [scrollDirection, setScrollDirection] = useState(DIRECTIONS.BOTTOM);
  const baseHasMoreCond = !isLoading && (weeks.length > 0 || !!lastBaseDate);
  const hasMoreBottom = hasMore && baseHasMoreCond;
  const hasMoreBottomScroll =
    hasMoreBottom &&
    scrollDirection === DIRECTIONS.BOTTOM &&
    !showPaginationButtons;
  const hasMoreTop = hasMorePrevious && baseHasMoreCond;
  const hasMoreTopScroll =
    hasMoreTop && scrollDirection === DIRECTIONS.TOP && !showPaginationButtons;
  const hasMoreTopCond = hasMoreTopScroll && !isLoading;
  const hasMoreBottomCond = hasMoreBottomScroll && !isLoading;
  const hasMoreCond = hasMoreTopCond || hasMoreBottomCond;
  function onScrollMove(e) {
    const st = e.target.scrollTop;
    if (st > lastScrollTop.current) {
      if (scrollDirection !== DIRECTIONS.BOTTOM) {
        setScrollDirection(DIRECTIONS.BOTTOM);
        if (lastBaseDate) setLastBaseDate(null);
      }
    } else if (scrollDirection !== DIRECTIONS.TOP) {
      setScrollDirection(DIRECTIONS.TOP);
      if (lastBaseDate) setLastBaseDate(null);
    }
    lastScrollTop.current = st <= 0 ? 0 : st;
  }
  async function loadMoreBottom() {
    const lastEl = weeks[weeks.length - 1];
    const startDate = lastBaseDate || moment(lastEl[lastEl.length - 1].start);
    const startInterval = startDate.format('YYYY-MM-DD');
    const endInterval = startDate.clone().add('20', 'days');
    const interval = {
      start: startInterval,
      end: endInterval.format('YYYY-MM-DD'),
    };
    if (type === 'profile') {
      fetchChallengeCalendarList(id, interval.start, interval.end);
    } else {
      fetchPlanCalendarList(interval.start, interval.end);
    }
    /* if (!showPaginationButtons) {
      agendaScroll.scrollTo(0, agendaScroll.scrollHeight - 1300);
    } */
    setLastBaseDate(endInterval);
  }
  async function loadMoreTop() {
    const startDate = lastBaseDate || moment(weeks[0][0].start);
    const startInterval = startDate.clone().subtract('20', 'days');
    const endInterval = startDate.format('YYYY-MM-DD');
    const interval = {
      start: startInterval.format('YYYY-MM-DD'),
      end: endInterval,
    };
    if (type === 'profile') {
      fetchChallengeCalendarList(id, interval.start, interval.end);
    } else {
      fetchPlanCalendarList(interval.start, interval.end);
    }
    /* if (!showPaginationButtons) {
      agendaScroll.scrollTo(0, 500);
    } */
    setLastBaseDate(startInterval);
  }
  function loadMore() {
    if (scrollDirection === DIRECTIONS.BOTTOM) {
      loadMoreBottom();
    } else {
      loadMoreTop();
    }
  }
  useEffect(() => {
    const _agendaScroll = document.getElementById('agenda-scroll');
    const todayEl = document.getElementById('agenda-today');
    const agendaScrollHalf = _agendaScroll
      ? _agendaScroll.scrollHeight / 2.5
      : 400;
    const moveTo = todayEl ? todayEl.offsetTop : agendaScrollHalf;
    if (_agendaScroll) {
      _agendaScroll.scrollTo(0, moveTo);
      _agendaScroll.addEventListener('scroll', onScrollMove);
    }
    return () => {
      if (_agendaScroll)
        _agendaScroll.removeEventListener('scroll', onScrollMove);
    };
  }, []);
  return (
    <div>
      {showPaginationButtons && hasMoreTop && (
        <div className="flex justify-center my-4">
          <Button
            color="orange"
            disabled={!hasMoreTop}
            onClick={loadMoreTop}
            className={bem('load-btn')}
          >
            Load Previous
          </Button>
        </div>
      )}
      <InfiniteScroll
        hasMore={hasMoreCond}
        pageStart={0}
        useWindow={false}
        id="agenda-scroll"
        className={bem('agenda-view')}
        loadMore={loadMore}
        isReverse={scrollDirection === DIRECTIONS.TOP}
        getScrollParent={() =>
          document.getElementById('agenda-scroll') || undefined
        }
      >
        {weeks.map((week, index) => (
          <Fragment key={`agenda-view-week-${index + 1}`}>
            {showWeekTitle && (
              <div className={bem('week')}>
                {`WEEK ${index + 1}:
                ${moment(week[0].start).startOf('week').format('MMM DD')} -
                ${moment(week[0].start).endOf('week').format('MMM DD')}`}
              </div>
            )}
            {week.map((event) => (
              <AgendaDay
                {...event}
                key={event.start}
                simple={simple}
                hideIntentions={hideIntentions}
              />
            ))}
          </Fragment>
        ))}
      </InfiniteScroll>
      {showPaginationButtons && hasMoreBottom && (
        <div className="flex justify-center my-8">
          <Button
            color="orange"
            disabled={!hasMoreBottom}
            onClick={loadMoreBottom}
            className={bem('load-btn')}
          >
            Load Next
          </Button>
        </div>
      )}
    </div>
  );
};

AgendaView.propTypes = {
  events: PropTypes.arrayOf(PropTypes.arrayOf(PropTypes.shape())),
  type: PropTypes.string,
  fetchPlanCalendarList: PropTypes.func,
  id: PropTypes.number,
  fetchChallengeCalendarList: PropTypes.func,
  isLoading: PropTypes.bool,
  simple: PropTypes.bool,
  showWeekTitle: PropTypes.bool,
  hideIntentions: PropTypes.bool,
  hasMorePrevious: PropTypes.bool,
  hasMore: PropTypes.bool,
};

const mapDispatchToProps = {
  fetchPlanCalendarList: fetchCalendarListAction,
  fetchChallengeCalendarList: fetchChallengeCalendarListAction,
};

const mapStateToProps = (state, { type, ...props }) => ({
  isLoading:
    type === 'profile'
      ? getChallengePlanLoading(state)
      : plansSelectors.getPlanLoading(state),
  hasMorePrevious:
    type === 'profile'
      ? challengesSelectors.getHasMorePrevious(state, props)
      : plansSelectors.getHasMorePrevious(state),
  hasMore:
    type === 'profile'
      ? challengesSelectors.getHasMore(state, props)
      : plansSelectors.getHasMore(state),
});

const ConnectedAgenda = connect(
  mapStateToProps,
  mapDispatchToProps
)(AgendaView);

export default React.memo(ConnectedAgenda);
