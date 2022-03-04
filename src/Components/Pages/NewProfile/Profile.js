import React, { useCallback, useMemo } from 'react';
import PropTypes from 'prop-types';
import { compose, mapProps } from 'recompose';
import { Container } from 'semantic-ui-react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import BEMHelper from 'react-bem-helper';
import ProfileHeader from '../../NewProfile/Header';
import ProfileStatsBar from '../../NewProfile/StatsBar';
import Loading from '../../Loading';
import ProfilePageInformation from '../../NewProfile/Information';
import ProfileCategoriesSection from '../../NewProfile/CategoriesSection';
import ProfilePageContext from '../../NewProfile/ProfilePageContext';
import * as profileSelectors from '../../../selectors/profile';
import * as profileActions from '../../../Actions/actions_profile';
import useActionOnCondition from '../../../hooks/use-action-on-condition';
import IncompleteProfile from '../../IncompleteProfile';
import Recommended from '../../NewProfile/Recommended';
import './Profile.scss';

const bem = BEMHelper({ name: 'ProfilePage', outputIsString: true });

function Profile(props) {
  const {
    profileId,
    user,
    isSelf,
    isLoading,
    pageError,
    fetchAbout,
    isAboutLoaded,
    fetchProfile,
    isProfileLoaded,
    fetchApps,
    areAppsLoaded,
    fetchBehaviours,
    areBehavioursLoaded,
    fetchGroups,
    areGroupsLoaded,
    fetchPreferences,
    arePreferencesLoaded,
    fetchPsychology,
    isPsychologyLoaded,
    fetchScore,
    fetchCategories,
    isScoreLoaded,
    isCategoriesLoaded,
    fetchInfo,
    isInfoLoaded,
    openChatWith,
    closeSidebarFunction,
  } = props;

  const fetchInfoCb = useCallback(() => fetchInfo(profileId), [
    fetchInfo,
    profileId,
  ]);
  useActionOnCondition(fetchInfoCb, !isInfoLoaded);

  const fetchAboutCb = useCallback(() => fetchAbout(profileId), [
    fetchAbout,
    profileId,
  ]);
  useActionOnCondition(fetchAboutCb, !isAboutLoaded);

  const fetchAppsCb = useCallback(() => fetchApps(profileId), [
    fetchApps,
    profileId,
  ]);
  useActionOnCondition(fetchAppsCb, !areAppsLoaded);

  const fetchBehavioursCb = useCallback(() => fetchBehaviours(profileId), [
    fetchBehaviours,
    profileId,
  ]);
  useActionOnCondition(fetchBehavioursCb, !areBehavioursLoaded);

  const fetchGroupsCb = useCallback(
    () =>
      fetchGroups({
        userId: profileId,
        usePagination: false,
      }),
    [fetchGroups, profileId]
  );
  useActionOnCondition(fetchGroupsCb, !areGroupsLoaded);

  const fetchPreferencesCb = useCallback(() => fetchPreferences(profileId), [
    fetchPreferences,
    profileId,
  ]);
  useActionOnCondition(fetchPreferencesCb, !arePreferencesLoaded);

  const fetchPsychologyCb = useCallback(() => fetchPsychology(profileId), [
    fetchPsychology,
    profileId,
  ]);
  useActionOnCondition(fetchPsychologyCb, !isPsychologyLoaded);

  const fetchScoreCb = useCallback(() => fetchScore(profileId), [
    fetchScore,
    profileId,
  ]);
  useActionOnCondition(fetchScoreCb, !isScoreLoaded);

  // eslint-disable-next-line max-len
  const fetchCategoriesCb = useCallback(() => fetchCategories(profileId), [
    fetchCategories,
    profileId,
  ]);
  useActionOnCondition(fetchCategoriesCb, !isCategoriesLoaded);

  // eslint-disable-next-line max-len
  const fetchProfileCb = useCallback(
    () => fetchProfile(isSelf ? null : profileId),
    [fetchProfile, profileId]
  );
  useActionOnCondition(fetchProfileCb, !isProfileLoaded);

  function getPageContent() {
    // TODO: Refactor this to show real components
    if (isLoading) {
      return <Loading />;
    }
    if (!isInfoLoaded) {
      if (!pageError) {
        return <div />;
      }
      if (pageError.status === 404) {
        return <h1>404</h1>;
      }
      return <h1>There was an error loading this page</h1>;
    }
    return (
      <>
        <ProfileHeader
          key={`header-${profileId}`}
          profileId={profileId}
          user={user}
        />
        <ProfileStatsBar
          key={`stats-${profileId}`}
          className="mt-2"
          profileId={profileId}
        />
        <ProfilePageInformation
          key={`info-${profileId}`}
          className="mt-2"
          profileId={profileId}
        />
        <ProfileCategoriesSection
          key={`categories-${profileId}`}
          className="mt-2"
          profileId={profileId}
          user={user}
          openChatWith={openChatWith}
          closeSidebarFunction={closeSidebarFunction}
        />
        <Container className="RecommendedInProfile">
          <Recommended hasPlan={user.has_plan} />
        </Container>
        <IncompleteProfile />
      </>
    );
  }
  const contextValue = useMemo(() => ({ profileId }), [profileId]);
  return (
    <ProfilePageContext.Provider value={contextValue}>
      <div className={bem()}>{getPageContent()}</div>
    </ProfilePageContext.Provider>
  );
}

Profile.propTypes = {
  profileId: PropTypes.string.isRequired,
  user: PropTypes.shape().isRequired,
  isSelf: PropTypes.bool.isRequired,
  fetchAbout: PropTypes.func.isRequired,
  isAboutLoaded: PropTypes.bool.isRequired,
  fetchProfile: PropTypes.func.isRequired,
  isProfileLoaded: PropTypes.bool.isRequired,
  fetchApps: PropTypes.func.isRequired,
  areAppsLoaded: PropTypes.bool.isRequired,
  fetchBehaviours: PropTypes.func.isRequired,
  areBehavioursLoaded: PropTypes.bool.isRequired,
  fetchGroups: PropTypes.func.isRequired,
  areGroupsLoaded: PropTypes.bool.isRequired,
  fetchPreferences: PropTypes.func.isRequired,
  arePreferencesLoaded: PropTypes.bool.isRequired,
  fetchPsychology: PropTypes.func.isRequired,
  isPsychologyLoaded: PropTypes.bool.isRequired,
  fetchScore: PropTypes.func.isRequired,
  fetchCategories: PropTypes.func.isRequired,
  isScoreLoaded: PropTypes.bool.isRequired,
  isCategoriesLoaded: PropTypes.bool.isRequired,
  fetchInfo: PropTypes.func.isRequired,
  isInfoLoaded: PropTypes.bool.isRequired,
  isLoading: PropTypes.bool.isRequired,
  pageError: PropTypes.shape({}),
  closeSidebarFunction: PropTypes.func.isRequired,
  openChatWith: PropTypes.func.isRequired,
};

const mapStateToProps = (state, props) => ({
  isAboutLoaded: profileSelectors.getIsUserAboutLoaded(state, props),
  isProfileLoaded: profileSelectors.getIsUserProfileLoaded(state, props),
  areAppsLoaded: profileSelectors.getAreUserAppsLoaded(state, props),
  areBehavioursLoaded: profileSelectors.getAreUserBehavioursLoaded(
    state,
    props
  ),
  areGroupsLoaded: profileSelectors.getAreUserGroupsLoaded(state, props),
  arePreferencesLoaded: profileSelectors.getAreUserPreferencesLoaded(
    state,
    props
  ),
  isPsychologyLoaded: profileSelectors.getIsUserPsychologyLoaded(state, props),
  isScoreLoaded: profileSelectors.getIsUserScoreLoaded(state, props),
  isCategoriesLoaded: profileSelectors.getIsUserCategoriesLoaded(state, props),
  isInfoLoaded: profileSelectors.getIsUserInfoLoaded(state, props),
  pageError: profileSelectors.getProfilePageError(state, props),
  isLoading: profileSelectors.getIsProfilePageLoading(state, props),
  isSelf: profileSelectors.getIsSelf(state, props),
});

const ConnectedProfilePage = compose(
  withRouter,
  mapProps((props) => ({
    profileId: props.match.params.id,
    user: props.user,
    openChatWith: props.openChatWith,
    closeSidebarFunction: props.closeSidebarFunction,
  })),
  connect(mapStateToProps, {
    fetchAbout: profileActions.fetchUserAbout,
    fetchProfile: profileActions.fetchUserProfile,
    fetchApps: profileActions.fetchUserApps,
    fetchBehaviours: profileActions.fetchUserBehaviours,
    fetchGroups: profileActions.fetchUserGroups,
    fetchPreferences: profileActions.fetchUserPreferences,
    fetchPsychology: profileActions.fetchUserPsychology,
    fetchScore: profileActions.fetchUserScore,
    fetchCategories: profileActions.fetchUserCategories,
    fetchInfo: profileActions.fetchUserInformation,
  })
)(Profile);

export default ConnectedProfilePage;
