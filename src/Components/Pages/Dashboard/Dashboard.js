/* eslint-disable no-fallthrough */
import React, { Component, useState, useContext, useEffect } from 'react';
import { connect } from 'react-redux';
import { initialize, touch } from 'redux-form';
import PropTypes from 'prop-types';
import { toast } from 'react-toastify';
import isEmpty from 'lodash/isEmpty';
import moment from 'moment';
import get from 'lodash/get';
import { Container } from 'semantic-ui-react';
import Activity from '../../Dashboard/Activity';
import NewsFeed from '../../Dashboard/NewsFeed';
import Helpers from '../../Utils/Helpers';
import Avatar from '../../Elements/Avatar';
import Goals from '../../Dashboard/Goals';
import Counter from '../../Dashboard/Counter';
import ProfileService from '../../../Services/ProfileService';
import QuickAdd from '../../Plan/QuickAdd';
import Recommended from '../../NewProfile/Recommended';
import AccountabilityScore from '../../Elements/AccountabilityScore';
import { getEvent } from '../../../selectors/plans';
import {
  fetchEventDetails,
  getPlansForDashboard as getPlansForDashboardAction,
} from '../../../Actions/actions_plan';
import EditExistingEvent, { formName } from '../../NewPlan/EditExistingEvent';
import { getInitialValues } from '../../Plan/EventDetailsModal/utils';
import PlanContext from '../../Plan/PlanContext';
import './Dashboard.scss';

const EditEvent = ({
  event,
  mode,
  id,
  fetchEvent,
  touchField,
  initializeForm,
  onUpdatePlan,
}) => {
  const { timeFormat } = useContext(PlanContext);
  const [openModal, setOpenModal] = useState(false);
  useEffect(() => {
    async function loadData() {
      if (mode === 'edit-event' && isEmpty(event)) {
        try {
          await fetchEvent(id);
        } catch (e) {
          toast.error('Something went wrong');
        }
      }
    }
    loadData();
  }, [mode, id, initialize]);
  useEffect(() => {
    if (event) {
      initializeForm(formName, getInitialValues({ event, timeFormat }));
      touchField(formName, 'time', 'duration', 'location', 'date');
      setOpenModal(true);
    }
  }, [event]);
  function onCloseEditModal(reload) {
    if (reload) onUpdatePlan();
    setOpenModal(false);
  }
  return (
    <EditExistingEvent
      open={openModal}
      onClose={onCloseEditModal}
      skipAction
      {...(event && {
        planId: event.plan,
        id: event.id,
      })}
    />
  );
};

EditEvent.propTypes = {
  event: PropTypes.oneOfType([PropTypes.shape(), PropTypes.oneOf([null])]),
  initializeForm: PropTypes.func,
  touchField: PropTypes.func,
  mode: PropTypes.string,
  onUpdatePlan: PropTypes.func,
  id: PropTypes.number,
  fetchEvent: PropTypes.func,
};

const ConnectedEditEvent = connect(
  (state, { id }) => ({
    event: getEvent(state, { match: { params: { id } } }),
  }),
  {
    fetchEvent: fetchEventDetails,
    touchField: touch,
    initializeForm: initialize,
  }
)(EditEvent);

class Dashboard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      nextPlan: undefined,
      upcomingPlan: undefined,
      events: [],
    };
    this.countdownRendererNoUpdate = this.countdownRendererNoUpdate.bind(this);
  }

  async componentDidMount() {
    const { match, user } = this.props;
    this.updatePlan(parseInt(match.params.id, 10));

    ProfileService.getProfile(user.id)
      .then((profile) => this.setState({ profile }))
      .catch((error) => {
        // TODO: Why is it not using redux?
        console.error(error);
      });
  }

  countdownRendererNoUpdate = (time) => <Counter time={time} />;

  renderOthersTitle = () => (
    <h2 className="dashboard-h2">Other buddies you might like</h2>
  );

  updatePlan = async (id) => {
    const { updateScore, history, getPlansForDashboard } = this.props;
    await updateScore();

    const intentionPlan = (plan) => {
      let canCheckReady = plan.can_check_ready;
      let canCheckIn = plan.can_check_in;

      if (plan && plan.challenge_type === 'Flexible') {
        canCheckIn = moment() >= moment(plan.start_date);
        canCheckReady = moment() >= moment(plan.can_check_ready_from);
      }

      return !canCheckIn && canCheckReady && !plan.intention_date;
    };

    const checkInPlan = (plan) => {
      let canCheckIn = plan.can_check_in;

      if (plan && plan.challenge_type === 'Flexible') {
        canCheckIn = moment() >= moment(plan.start_date);
      }

      return canCheckIn;
    };

    try {
      const data = await getPlansForDashboard(id);
      const sortedData = data
        .filter((e) => {
          //If checked in, filter out
          if (e.check_in_date) return false;

          if (!e.challenge_id) return true;
          //if (!e.challenge_id || e.challenge_type !== 'Flash') return true;

          const checkInWindowEnd = moment(e.start_date).add(
            Number(e.session_duration) + 60 * 24,
            'minutes'
          );
          return checkInWindowEnd.isAfter(moment());
        })
        .sort((a, b) => {
          if (intentionPlan(a) && intentionPlan(b)) {
            return new Date(a.start_date) - new Date(b.start_date);
          }

          if (intentionPlan(a) && !intentionPlan(b)) {
            return -1;
          }

          if (!intentionPlan(a) && intentionPlan(b)) {
            return 1;
          }

          if (checkInPlan(a) && checkInPlan(b)) {
            return new Date(a.start_date) - new Date(b.start_date);
          }

          if (checkInPlan(a) && !checkInPlan(b)) {
            return -1;
          }

          if (!checkInPlan(a) && checkInPlan(b)) {
            return 1;
          }

          return (
            new Date(a.can_check_ready_from) - new Date(b.can_check_ready_from)
          );
        });

      const idIndex = sortedData.findIndex((e) => e.pk === id);

      if (id && sortedData.length > 0 && idIndex === -1) {
        Helpers.createToast({
          status: 'error',
          message: "You can't check-in anymore to that event.",
        });
        history.push('/dashboard');
      } else if (idIndex !== -1) {
        const upComingIndex = sortedData[idIndex + 1] ? idIndex + 1 : 0;
        this.setState({
          events: sortedData,
          nextPlan: idIndex,
          upcomingPlan: upComingIndex,
        });
      }

      if (!id) {
        this.setState({ events: sortedData, nextPlan: 0, upcomingPlan: 1 });

        //This code was so that intentions are placed in front which is now being done by the sorting code

        /*const nextConfirmIndex = sortedData.findIndex((e) => {
          if (e.challenge_type === 'Flexible') {
            const checkInWindowEnd = moment(e.start_date)
              .add(Number(e.session_duration) + 60 * 24, 'minutes')
              .add(10, 'seconds');
            const canCheckIn =
              moment() >= moment(e.start_date) &&
              moment().isBefore(checkInWindowEnd);
            const canCheckReady = moment() >= moment(e.can_check_ready_from);
            return !canCheckIn && canCheckReady;
          }

          return !e.can_check_in && e.can_check_ready;
        });


        const nextConfirmIndex = sortedData.findIndex(
          (e) => !e.can_check_in && e.can_check_ready
        );

        if (!id && nextConfirmIndex >= 0) {
          const upcomingPlan = nextConfirmIndex + 1 || 0;
          this.setState({
            events: sortedData,
            nextPlan: 0,
            upcomingPlan: 1,
          });
        } else {
          this.setState({ events: sortedData, nextPlan: 0, upcomingPlan: 1 });
        }*/
      }
    } catch (e) {
      this.setState({ nextPlan: null, upcomingPlan: null });
      console.error(e);
    }
  };

  onNavigateSlider = (type) => {
    switch (type) {
      case 'prev': {
        this.setState((prevState) => ({
          nextPlan: prevState.nextPlan - 1,
          upcomingPlan: prevState.upcomingPlan - 1,
        }));
        break;
      }
      case 'next': {
        this.setState((prevState) => ({
          nextPlan: prevState.nextPlan + 1,
          upcomingPlan: prevState.upcomingPlan + 1,
        }));
        break;
      }
      default:
        break;
    }
  };

  render() {
    const {
      user,
      match,
      openChatWith,
      closeSidebarFunction,
      event,
    } = this.props;
    const { nextPlan, upcomingPlan, profile, events } = this.state;
    const { mode, id } = match.params;
    return (
      <div id="dashboard" className="bg grey">
        <Container>
          <div className="dashboard__title">
            <h2 className="dashboard-h2">Your Dashboard</h2>
            <div className="flex">
              <div className="avatar-container">
                <Avatar avatar={user.avatar} />
              </div>
              <AccountabilityScore
                points={user.levels.global.points}
                className="mt-15"
                levelcolor={get(profile, 'levels.global.level.color')}
                levelName={get(profile, 'levels.global.level.name')}
              />
            </div>
          </div>
          <Activity
            user={user}
            nextPlan={events[nextPlan]}
            profile={profile}
            onUpdatePlan={this.updatePlan}
            onNavigateSlider={this.onNavigateSlider}
            canNavigatePrev={nextPlan > 0}
            canNavigateNext={nextPlan < events.length - 1}
            {...this.props}
          />
          <div className="dashboard-quick-add">
            <QuickAdd
              user={user}
              formName="dashboard-one-off"
              onCreated={this.updatePlan}
            />
          </div>
          <NewsFeed
            plan={events[upcomingPlan]}
            user={user}
            onUpdatePlan={this.updatePlan}
          />
          <h2 className="dashboard-h2">Your Progress</h2>
          <Goals
            openChatWith={openChatWith}
            closeSidebarFunction={closeSidebarFunction}
            user={user}
          />
          <Recommended hasPlan={user.has_plan} />
        </Container>
        <ConnectedEditEvent
          event={event}
          id={id}
          mode={mode}
          onUpdatePlan={this.updatePlan}
        />
      </div>
    );
  }
}

Dashboard.propTypes = {
  updateScore: PropTypes.func.isRequired,
  user: PropTypes.shape({
    id: PropTypes.string,
    has_plan: PropTypes.bool,
    levels: PropTypes.shape(),
    avatar: PropTypes.shape(),
  }).isRequired,
  getPlansForDashboard: PropTypes.func,
  event: PropTypes.oneOfType([PropTypes.shape(), PropTypes.oneOf([null])]),
  openChatWith: PropTypes.func.isRequired,
  touchField: PropTypes.func,
  closeSidebarFunction: PropTypes.func.isRequired,
  history: PropTypes.shape({
    push: PropTypes.func.isRequired,
  }).isRequired,
  match: PropTypes.shape({
    params: PropTypes.shape({
      id: PropTypes.string.isRequired,
      mode: PropTypes.string,
    }),
  }).isRequired,
};

export default connect(null, {
  getPlansForDashboard: getPlansForDashboardAction,
})(Dashboard);
