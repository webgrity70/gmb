/* eslint-disable react/sort-comp */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import isEmpty from 'lodash/isEmpty';
import Intercom from 'react-intercom';
import { Route, Switch, withRouter, Redirect } from 'react-router-dom';
import LogRocket from 'logrocket';
import { ToastContainer } from 'react-toastify';
import moment from 'moment';
import { library } from '@fortawesome/fontawesome-svg-core';
import { faMapMarkerAlt } from '@fortawesome/free-solid-svg-icons';
import { connect } from 'react-redux';
import MobileBanner from './Components/MobileBanner';
import NavBar from './Components/Elements/NavBar';
import Login from './Components/Pages/Login';
import Pricing from './Components/Pages/Pricing';
import Plans from './Components/Pages/Plans';
import Error404 from './Components/Pages/Error404';
import NewProfile from './Components/Pages/NewProfile';
import Group from './Components/Pages/Group';
import Buddies from './Components/Pages/Buddies';
import ProfileService from './Services/ProfileService';
import LoginService from './Services/LoginService';
import Dashboard from './Components/Pages/Dashboard';
import SideBar from './Components/Pages/SideBar';
import { INTERCOM_API_KEY, CHARGEBEE_SITE_KEY } from './settings';
import PrivateRoute from './Components/Utils/PrivateRoute';
import { TrackEvent } from './Services/TrackEvent';
import Verify from './Components/Pages/Verify';
import ResetPassword from './Components/Pages/ResetPassword';
import MaintenancePage from './Components/Pages/MaintenancePage';
import ChallengePage from './Components/Pages/Challenge';
import DiscoverPage from './Components/Pages/Discover';
import BetaInvitation from './Components/Pages/BetaInvitation';
import NewGroup from './Components/Pages/NewGroup';
import { Settings } from './Components/Pages';
import Loading from './Components/Loading';
import { populateFormInfo } from './Actions';
import * as userActions from './Actions/actions_user';
import * as profileActions from './Actions/actions_profile';
import ScheduleChallengePage from './Components/Pages/ScheduleChallengePage';
import RegisterPage from './Components/Pages/RegisterPage';
import ChallengesPage from './Components/Pages/Challenges';
import EditChallengePage from './Components/Pages/EditChallengePage';
import GroupsPage from './Components/Pages/Groups';
import NewChallengePage from './Components/Pages/NewChallengePage';
import { getMyProfileId } from './selectors/profile';
import { BUDDIES_FILTER_STATE } from './constants';
import {
  getUserSubscription,
  isPlanCancelled,
} from './reducers/session/selectors';
import hasExpired from './utils/hasExpired';
import ExpiredUser from './Components/ExpiredUser';
import NewPlan from './Components/Pages/NewPlan';
import { Provider as PlanContextProvider } from './Components/Plan/PlanContext';
import EditPlan from './Components/Pages/EditPlan/EditPlan';
// import Event from './Components/Pages/Event';
// import Plan from './Components/Pages/PlanV2';

library.add(faMapMarkerAlt);

class GMB extends Component {
  static propTypes = {
    fetchUserSubscription: PropTypes.func.isRequired,
    fetchUserData: PropTypes.func.isRequired,
    logoutUser: PropTypes.func.isRequired,
  };

  constructor(props) {
    super(props);
    this.state = {
      user: false,
      loaded: false,
      sidebarClose: false,
      navbar: true,
      openBuddyChat: undefined,
      maintenance: undefined,
      showExpired: false,
    };
  }

  UNSAFE_componentWillMount() {
    this.updateUser(null);
    this.isAlive();
  }

  toggleExpired = () =>
    this.setState((state) => ({
      showExpired: !state.showExpired,
    }));

  componentDidMount() {
    if (window.Chargebee) {
      window.Chargebee.init({
        site: CHARGEBEE_SITE_KEY,
      });
    }
    window.addEventListener('beforeunload', () => {
      TrackEvent('last-page-viewed', { location: window.location.pathname });
      sessionStorage.removeItem(BUDDIES_FILTER_STATE);
    });
    LogRocket.init(
      `s5hqle/gmb-${
        process.env.REACT_APP_GMB_ENV === 'beta' ? 'production' : 'testing'
      }`
    );
  }

  refreshUser = async () => {
    /* const rememberChecked = !!localStorage.getItem('remember-me');
    if (rememberChecked) { */
    try {
      const tokenData = await LoginService.refreshToken();
      localStorage.setItem('access_token', tokenData.access_token);
      localStorage.setItem('refresh_token', tokenData.refresh_token);
      localStorage.setItem(
        'expires',
        moment().add(tokenData.expires_in, 'seconds').format()
      );
      this.updateUser(null, true);
    } catch {
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
      this.setState({ loaded: true });
    } /*
    } else {
      this.setState({ loaded: true });
    } */
  };

  async getCurrentUser(forced) {
    const {
      fetchUserSubscription,
      fetchUserData,
      fetchUserInformation,
      fetchUserPreferences,
      fetchUserCategories,
      fetchUserAbout,
    } = this.props;
    try {
      const userData = await fetchUserData();
      if (userData.pk) {
        fetchUserSubscription(userData.pk);
        await Promise.all([
          fetchUserPreferences(userData.pk),
          fetchUserAbout(userData.pk),
          fetchUserCategories(userData.pk),
        ]);
        await fetchUserInformation(userData.pk);
        if (forced) {
          userData.timestamp = new Date();
        }
        this.updateUser(userData);
      } else this.refreshUser();
    } catch (e) {
      this.refreshUser();
    }
  }

  isAlive = () => {
    LoginService.isAlive()
      .then(() => {
        this.setState({ maintenance: false });
      })
      .catch(() => {
        this.setState({ maintenance: true });
      });
  };

  updateScore = () =>
    new Promise((resolve) => {
      ProfileService.getScore()
        .then((data) => {
          const { user } = this.state;
          const before = user.levels;
          const after = data.levels;
          if (JSON.stringify(after) !== JSON.stringify(before)) {
            this.setState({ user: { ...user, levels: after } });
          }
          resolve(data);
        })
        .catch(() => resolve());
    });

  updateUser = (newUser = null, forced = false, omit = false) => {
    const { fetchUserData } = this.props;
    if (newUser === null) {
      this.getCurrentUser(forced);
    } else {
      if (omit) fetchUserData();
      this.setState({ user: newUser, loaded: true });
    }
  };

  logout = () => {
    const { logoutUser } = this.props;
    logoutUser();
  };

  openChatWith = (buddyPk) => {
    this.setState({ openBuddyChat: buddyPk });
  };

  closeSidebar = (closed = false) => {
    this.setState({ sidebarClose: !closed, openBuddyChat: null });
  };

  componentDidUpdate = (prevProps) => {
    const { shouldHideSide, userId } = this.props;
    if (!prevProps.shouldHideSide && shouldHideSide) {
      this.setState({ showExpired: true });
    }

    if (prevProps.userId && !userId) {
      this.setState({ user: false });
    }
  };

  render() {
    const {
      loaded,
      showExpired,
      openBuddyChat,
      navbar,
      user,
      maintenance,
      sidebarClose,
    } = this.state;
    if (maintenance) return <MaintenancePage />;
    if (loaded === false || maintenance === undefined) {
      return <Loading />;
    }
    if (maintenance) return <MaintenancePage />;
    const userName = user ? `${user.first_name} ${user.last_name}` : '';
    const customUser = user
      ? {
          name: !isEmpty(userName.trim()) ? userName : user.name,
          email: user.email,
          user_id: user.pk,
          created_at: new Date(user.created_at).getTime() / 1000,
        }
      : { name: 'Guest' };
    const { showNav, history, shouldHideSide } = this.props;
    return (
      <React.Fragment>
        <Intercom appID={INTERCOM_API_KEY} {...customUser} />
        <ToastContainer />
        <div className="container-fluid">
          {showNav && (
            <NavBar
              pathName={history.location.pathname}
              navbar={navbar}
              user={user}
              logoutMethod={this.logout}
            />
          )}
          {/* <Portal slug="gmb-beta-prod" /> */}
          <PlanContextProvider>
            <Switch>
              <Route
                exact
                path="/"
                render={(props) => (
                  <Login
                    updateUser={this.updateUser}
                    history={history}
                    user={user}
                    {...props}
                  />
                )}
              />
              <Route
                exact
                path="/login"
                render={(props) => (
                  <Login
                    updateUser={this.updateUser}
                    history={history}
                    user={user}
                    {...props}
                  />
                )}
              />
              <Route
                exact
                path="/reset-password/:hash/"
                render={(props) => (
                  <ResetPassword history={history} {...props} />
                )}
              />
              <Route
                exact
                path="/beta/invitation/:hash/"
                render={(props) => (
                  <BetaInvitation
                    history={history}
                    updateUser={this.updateUser}
                    {...props}
                    user={user}
                  />
                )}
              />
              <PrivateRoute
                path="/groups/:id/post/:postid"
                component={Group}
                user={user}
              />
              <PrivateRoute path="/groups/:id" component={Group} user={user} />
              <PrivateRoute
                path="/new-group/"
                component={NewGroup}
                user={user}
              />
              <Route
                path="/register"
                render={(props) => <RegisterPage user={user} {...props} />}
              />
              <PrivateRoute
                path={'/discover'}
                component={DiscoverPage}
                user={user}
              />
              <PrivateRoute
                path="/challenges/new"
                component={NewChallengePage}
                user={user}
              />
              <PrivateRoute
                path="/challenges/:type/:id"
                component={ChallengesPage}
                user={user}
              />
              <PrivateRoute
                path="/challenges/:id"
                component={ChallengePage}
                user={user}
              />
              <PrivateRoute
                path="/challenges"
                component={ChallengesPage}
                user={user}
              />
              <PrivateRoute
                path="/edit-challenge/:id"
                component={EditChallengePage}
                user={user}
              />
              <PrivateRoute
                path="/schedule-challenge/:id"
                component={ScheduleChallengePage}
                user={user}
              />
              <PrivateRoute path="/groups" component={GroupsPage} user={user} />
              <Route
                path="/verify/:type/:hash"
                render={(props) => (
                  <Verify updateUser={this.updateUser} {...props} />
                )}
              />
              <Route
                path="/verify/:hash"
                render={(props) => (
                  <Verify updateUser={this.updateUser} {...props} />
                )}
              />
              <PrivateRoute
                exact
                path="/settings/:page?"
                component={Settings}
                updateUser={this.updateUser}
                user={user}
              />
              <PrivateRoute path="/plan/new" component={NewPlan} />
              <PrivateRoute
                path="/edit-plan/:id"
                component={EditPlan}
                user={user}
              />
              {/* <PrivateRoute path="/event/:id" component={Event} user={user} /> */}
              <PrivateRoute
                path="/plan/:type/:id/:eventdate?"
                component={Plans}
                user={user}
              />
              <PrivateRoute path="/plan/" component={Plans} user={user} />
              <PrivateRoute
                path="/dashboard/:mode?/:id?/:progress?"
                component={Dashboard}
                user={user}
                history={history}
                openChatWith={this.openChatWith}
                closeSidebarFunction={this.closeSidebar}
                updateScore={this.updateScore}
              />
              <Redirect from="/profile" to={`/profile/${user.pk}`} exact />
              <PrivateRoute
                path="/profile/:id"
                component={NewProfile}
                user={user}
                updateUser={this.updateUser}
                openChatWith={this.openChatWith}
                closeSidebarFunction={this.closeSidebar}
              />
              <PrivateRoute
                exact
                path="/buddies"
                component={Buddies}
                user={user}
                history={history}
              />
              <Route
                exact
                path="/pricing"
                render={(props) => <Pricing {...props} user={user} />}
              />
              <Route component={Error404} />
            </Switch>
          </PlanContextProvider>
          {!isEmpty(user) && !shouldHideSide && (
            <SideBar
              user={user}
              openBuddyChat={openBuddyChat}
              closeSidebar={sidebarClose}
              closeSidebarFunction={this.closeSidebar}
              openChatWith={this.openChatWith}
              updateUser={this.updateUser}
            />
          )}
        </div>
        <MobileBanner />
        <ExpiredUser show={showExpired} toggle={this.toggleExpired} />
      </React.Fragment>
    );
  }
}

GMB.propTypes = {
  showNav: PropTypes.bool,
  history: PropTypes.shape({}),
  fetchUserInformation: PropTypes.func,
  fetchUserAbout: PropTypes.func,
  fetchUserPreferences: PropTypes.func,
  fetchUserCategories: PropTypes.func,
  shouldHideSide: PropTypes.bool,
  userId: PropTypes.oneOfType([PropTypes.number, PropTypes.oneOf([null])]),
};

const mapStateToProps = (state) => {
  const subscription = getUserSubscription(state);
  const expired = hasExpired(subscription);
  const cancelled = isPlanCancelled(state);
  return {
    shouldHideSide: expired || cancelled,
    showNav: state.signup.showForm,
    userId: getMyProfileId(state),
  };
};
export default withRouter(
  connect(mapStateToProps, {
    populateFormInfo,
    fetchUserSubscription: userActions.fetchUserSubscription,
    fetchUserData: userActions.fetchUserData,
    logoutUser: userActions.logout,
    fetchUserInformation: profileActions.fetchUserInformation,
    fetchUserAbout: profileActions.fetchUserAbout,
    fetchUserPreferences: profileActions.fetchUserPreferences,
    fetchUserCategories: profileActions.fetchUserCategories,
  })(GMB)
);
