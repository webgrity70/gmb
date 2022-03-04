import React, {
  useEffect,
  useMemo,
  useContext,
  useCallback,
  useState,
} from 'react';
import omit from 'lodash/omit';
import { compose } from 'redux';
import cx from 'classnames';
import isEmpty from 'lodash/isEmpty';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Popup, Tab, Menu } from 'semantic-ui-react';
import BEMHelper from 'react-bem-helper';
import { Calendar, EventDetailsModal } from '../../Plan';
import { fetchCalendarList as fetchCalendarListAction } from '../../../Actions/actions_plan';
import {
  getCalendarList,
  plansToCalendarList,
  getPlanLoading,
} from '../../../selectors/plans';
import CalendarCacheService from '../../../Services/CalendarCacheService';
import {
  getInitialDates,
  getFiltered,
  eventDataToChallenge,
} from '../../Plan/utils';
import PlanContext from '../../Plan/PlanContext';
import './Plans.scss';
import { VIEWS } from '../../Plan/Toolbar/utils';
import { getUserCategories } from '../../../selectors/profile';
import usePrevious from '../../../utils/usePrevious';
import GlobalTemplates from '../../Plan/GlobalTemplates/GlobalTemplates';
import QuickAdd from '../../Plan/QuickAdd';
import Helpers from '../../Utils/Helpers';
import ChallengeDetailsModal from '../../Challenges/ChallengeDetailsModal';

const bem = BEMHelper({ name: 'PlansPage', outputIsString: true });

const Plans = ({
  calendarList,
  computedMatch,
  userCategories,
  fetchCalendarList,
  user,
  isLoading,
}) => {
  const [useCached, setUseCached] = useState(true);
  const [openDetailsModal, setOpenDetailsModal] = useState(false);
  const [eventDetail, setEventDetail] = useState(null);
  const [challengeDetail, setChallengeDetail] = useState(null);
  const [openChallengeModal, setOpenChallengeModal] = useState(false);
  const prevIsLoading = usePrevious(isLoading);
  const { inactiveCategories, view } = useContext(PlanContext);
  const { timeFormat } = useContext(PlanContext);

  const onCloseDetailsModal = () => {
    setOpenDetailsModal(false);
  };

  const onCloseChallengeModal = () => {
    setOpenChallengeModal(false);
  };

  if (useCached) {
    const plans = CalendarCacheService.getPlans();
    if (plans) {
      calendarList = plansToCalendarList(plans);
      isLoading = calendarList.length ? false : isLoading;
    }
  }

  useEffect(() => {
    if (computedMatch.params.type === 'event' && eventDetail) {
      setOpenDetailsModal(true);
    }
  }, [computedMatch.params, eventDetail]);

  useEffect(() => {
    if (computedMatch.params.type === 'event') {
      if (!isLoading && calendarList) {
        let event = null;
        setEventDetail(null);
        setChallengeDetail(null);
        for (let i = 0; i < calendarList.length; i++) {
          const d = calendarList[i];
          const e = d.events.find(
            (e) => e.id === Number(computedMatch.params.id)
          );
          if (e) {
            if (e.challengeID) {
              setChallengeDetail(e);
            } else {
              setEventDetail(e);
            }
            event = e;
            break;
          }
        }

        if (event) {
          if (event.challengeID) {
            setOpenChallengeModal(true);
          } else {
            setOpenDetailsModal(true);
          }
        } else {
          if (!isLoading) {
            const { start, end } = getInitialDates();
            fetchCalendarList(start, end);
          }
          console.log('Not accessible!');
          // Helpers.createToast({
          //   status: 'warning',
          //   message: '[DEBUG] You do not share this event',
          // });
        }
      }
    } else if (computedMatch.params.type === 'challenge') {
      if (!isLoading && calendarList) {
        let challengeFound = false;
        setEventDetail(null);
        setChallengeDetail(null);
        let eventDate = new Date();
        if (computedMatch.params.eventdate) {
          eventDate = new Date(Number(computedMatch.params.eventdate));
        }
        eventDate.setHours(0, 0, 0, 0);

        const today = calendarList.find(
          (c) => Date.parse(c.start) === eventDate.getTime()
        );

        if (today) {
          const e = today.events.find(
            (e) => e.challengeID === Number(computedMatch.params.id)
          );
          if (e) {
            setChallengeDetail(e);
            challengeFound = true;
          }
        }

        if (challengeFound) {
          setOpenChallengeModal(true);
        } else {
          if (!isLoading) {
            const { start, end } = getInitialDates();
            fetchCalendarList(start, end);
          }
          console.log('Not accessible!');
          // Helpers.createToast({
          //   status: 'warning',
          //   message: '[DEBUG] You do not share this event',
          // });
        }
      }
    }
  }, [computedMatch.params, isLoading, calendarList]);

  useEffect(() => {
    const { start, end } = getInitialDates();
    fetchCalendarList(start, end);
  }, []);

  useEffect(() => {
    if (prevIsLoading && !isLoading && useCached) {
      setUseCached(false);
    }
  }, [useCached, isLoading, prevIsLoading]);

  const handleNewDates = useCallback(
    async ({ start, end, toToday }) => {
      if (!isLoading) {
        await fetchCalendarList(start, end);
        if (toToday) {
          const agendaScroll = document.getElementById('agenda-scroll');
          const todayEl = document.getElementById('agenda-today');
          if (todayEl && agendaScroll) {
            agendaScroll.scrollTo(0, todayEl.offsetTop);
          }
        }
      }
    },
    [fetchCalendarList, isLoading]
  );

  const events = useMemo(
    () => getFiltered(calendarList, inactiveCategories, user.name),
    [calendarList, inactiveCategories, user.name]
  );

  const tabPanes = [
    {
      menuItem: (
        <Menu.Item key="calendar" className={bem('tab-calendar')}>
          Calendar
        </Menu.Item>
      ),
      render: () => (
        <Tab.Pane attached={false}>
          <div className={bem('calendar')}>
            <Calendar
              events={events}
              handleNewDates={handleNewDates}
              user={user}
              isLoading={isLoading}
            />
          </div>
          {view === VIEWS.month && (
            <div className={bem('legends')}>
              <div className="flex">
                <Popup
                  trigger={<i className="ml-2 far fa-question-circle mb-2" />}
                  on="click"
                  hoverable
                  inverted
                >
                  When you have a Buddy, the Symbol will light up and their name
                  will appear.
                  <a
                    className="more-popup"
                    href="http://help.getmotivatedbuddies.com/en/articles/3205171-what-are-the-symbols-on-the-calendar"
                    rel="noopener noreferrer"
                    target="_blank"
                  >
                    more
                  </a>
                </Popup>
                <i className="calendar-icon f-circle" />
                <span>You</span>
              </div>
              {userCategories.map((cat) => (
                <div
                  className={cx('flex ml-6', { inactive: !isEmpty(cat.buddy) })}
                  key={cat.slug}
                >
                  <i className={`calendar-icon f-${cat.slug}`} />
                  <span>Your {cat.name} Buddy</span>
                </div>
              ))}
            </div>
          )}
        </Tab.Pane>
      ),
    },
    {
      menuItem: (
        <Menu.Item key="myplans" className={bem('tab-myplans')}>
          My Plans
        </Menu.Item>
      ),
      render: () => (
        <Tab.Pane attached={false} className={bem('tab-comingsoon')}>
          Coming soon
        </Tab.Pane>
      ),
    },
  ];

  return (
    <div className={bem()}>
      <div className={bem('container')}>
        <GlobalTemplates />
        <QuickAdd user={user} formName="one-off" />
        <Tab panes={tabPanes} className={bem('tabs')} />
        {eventDetail ? (
          <EventDetailsModal
            openModal={openDetailsModal}
            onClose={onCloseDetailsModal}
            event={eventDetail}
            timeFormat={timeFormat}
          />
        ) : challengeDetail ? (
          <ChallengeDetailsModal
            id={challengeDetail.challengeID}
            open={openChallengeModal}
            onClose={onCloseChallengeModal}
            challenge={eventDataToChallenge(challengeDetail)}
          />
        ) : null}
      </div>
    </div>
  );
};

Plans.propTypes = {
  fetchCalendarList: PropTypes.func,
  user: PropTypes.shape(),
  calendarList: PropTypes.arrayOf(PropTypes.shape()),
  userCategories: PropTypes.arrayOf(PropTypes.shape()),
  isLoading: PropTypes.bool,
};

const mapStateToProps = (state, { user }) => {
  const calendarList = getCalendarList(state);
  const isLoading = getPlanLoading(state);
  return {
    calendarList,
    userCategories: getUserCategories(state, { profileId: user.pk }) || [],
    isLoading,
  };
};

export default compose(
  connect(mapStateToProps, {
    fetchCalendarList: fetchCalendarListAction,
  })
)(Plans);
