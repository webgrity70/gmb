import { createSelector } from 'redux-starter-kit';
import get from 'lodash/get';
import find from 'lodash/find';
import { GROUP_STAFF } from '../constants';
import { getCurrentUserId } from '../reducers/session/selectors';

const getGroupsInvitesPagination = (state) => state.pagination.groupsInvites;
const getChallengesInvitesPagination = (state) =>
  state.pagination.challengesInvites;

const getMyGroups = (state) => state.session.groups;
const getMyGroupsPagination = (state) => state.pagination.myGroups;

export const getIsProfilePageLoading = (state) => state.profile.loading;
export const getProfilePageError = (state) => state.profile.error;
export const getAvailableLanguages = (state) => state.entities.languages;
export const getAreLanguagesLoaded = createSelector(
  [getAvailableLanguages],
  (languages) => Object.keys(languages).length > 0
);

export const getGroupsInvites = (state) => state.session.groupsInvites;
export const getChallengesInvites = (state) => state.session.challengesInvites;

const getUserIdFromProps = (state, props) => props.profileId;
const getUserIdFromUser = (state, user) => user.pk;
const getCategoryIdFromProps = (state, props) => props.category.id;

/**
 * User about
 */
const getUsersAbout = (state) => state.entities.users.about;

export const getMyProfileId = createSelector(['session.user.pk'], (id) => id);

export const getMyProfile = createSelector(['session.user'], (user) => user);

export const getUserAboutData = createSelector(
  [getUsersAbout, getUserIdFromProps],
  (usersAbout, userId) => usersAbout[userId]
);

export const getIsUserAboutLoaded = createSelector(
  [getUserAboutData],
  (about) => !!about
);

export const getIsOccupationPrivate = createSelector(
  [getUserAboutData],
  (about = {}) => !about.occupationPrivacy
);

export const getUserOccupations = createSelector(
  [getUserAboutData],
  (about = {}) => about.occupation || undefined
);

/**
 * User profile
 */
const getUsersProfile = (state) => state.entities.users.profile;

export const getUserProfileData = createSelector(
  [getUsersProfile, getUserIdFromProps],
  (usersProfile, userId) => usersProfile[userId]
);

export const getUserCategoriesSlot = createSelector(
  [getUserProfileData],
  (userData) => userData.available_categories
);

export const getIsUserProfileLoaded = createSelector(
  [getUserProfileData],
  (profile) => !!profile
);

/**
 * User apps
 */

const getUsersApps = (state) => state.entities.users.apps;

const getUserApps = createSelector(
  [getUsersApps, getUserIdFromProps],
  (usersApps, userId) => usersApps[userId]
);

export const getUserAppsData = createSelector([getUserApps], (userApps) =>
  get(userApps, 'results', [])
);

export const getAreUserAppsLoaded = createSelector(
  [getUserApps],
  (apps) => !!apps
);

/**
 * User behaviours
 */

const getUsersBehaviours = (state) => state.entities.users.behaviours;

const getUserBehavioursData = createSelector(
  [getUsersBehaviours, getUserIdFromProps],
  (usersBehaviours, userId) => usersBehaviours[userId]
);

export const getAreUserBehavioursLoaded = createSelector(
  [getUserBehavioursData],
  (behavioursData) => !!behavioursData
);

export const getAreBehavioursPrivate = createSelector(
  [getUserBehavioursData],
  (behavioursData = {}) => !behavioursData.behaviourPrivacy
);

export const getUserBehaviours = createSelector(
  [getUserBehavioursData],
  (behavioursData = {}) => behavioursData.behaviours
);

/**
 * User groups
 */

const getUsersGroups = (state) => state.entities.users.groups;

const getUserGroups = createSelector(
  [getUsersGroups, getUserIdFromProps],
  (usersGroups, userId) => usersGroups[userId]
);

export const getAreUserGroupsLoaded = createSelector(
  [getUserGroups],
  (groups) => !!groups
);

export const getAreGroupsPrivate = createSelector(
  [getUserGroups],
  (groups = {}) => !groups.groupsPrivacy
);

export const getUserGroupsData = createSelector([getUserGroups], (userGroups) =>
  get(userGroups, 'results', [])
);

/**
 * User preferences
 */

const getUsersPreferences = (state) => state.entities.users.preferences;

export const getUserPreferences = createSelector(
  [getUsersPreferences, getUserIdFromProps],
  (usersPreferences, userId) => usersPreferences[userId]
);

export const getAreUserPreferencesLoaded = createSelector(
  [getUserPreferences],
  (preferences) => !!preferences
);

export const getArePreferencesPrivate = createSelector(
  [getUserPreferences],
  (preferences = {}) => !preferences.preferencesPrivacy
);

/**
 * User psychology
 */

const getUsersPsychology = (state) => state.entities.users.psychology;

const getUserPsychology = createSelector(
  [getUsersPsychology, getUserIdFromProps],
  (usersPsychology, userId) => usersPsychology[userId]
);

export const getIsUserPsychologyLoaded = createSelector(
  [getUserPsychology],
  (psychology) => !!psychology
);

export const getUserPsychologyData = createSelector(
  [getUserPsychology],
  (userPsychology) => get(userPsychology, 'results', [])
);

export const getIsPsychologyPrivate = createSelector(
  [getUserPsychology],
  (psychology = {}) => !psychology.psychologyPrivacy
);

/**
 * User score
 */

const getUsersScore = (state) => state.entities.users.score;

const getUserScore = createSelector(
  [getUsersScore, getUserIdFromProps],
  (usersScore, userId) => usersScore[userId]
);

export const getIsUserScoreLoaded = createSelector(
  [getUserScore],
  (score) => !!score
);

export const getUserScorePoints = createSelector([getUserScore], (score) =>
  get(score, 'levels.globalScore.points')
);

export const getUserNextLevel = createSelector([getUserScore], (score) =>
  get(score, 'levels.globalScore.nextLevel')
);

export const getUserCurrentLevel = createSelector([getUserScore], (score) =>
  get(score, 'levels.globalScore.level')
);

export const getUserCategoriesScore = createSelector([getUserScore], (score) =>
  get(score, 'levels.categories')
);

export const getUserCategoryScore = createSelector(
  [getUserCategoriesScore, getCategoryIdFromProps],
  (usersCategoriesScore, categoryId) =>
    find(usersCategoriesScore, ['pk', categoryId])
);

/**
 * User information
 */
const getUsersInfo = (state) => state.entities.users.info;

export const getUserInfo = createSelector(
  [getUsersInfo, getUserIdFromProps],
  (usersInfo, userId) => usersInfo[userId]
);

export const getIsUserInfoLoaded = createSelector(
  [getUserInfo],
  (info) => !!info
);

export const getIsSelf = createSelector(
  [getCurrentUserId, getUserIdFromProps],
  (currentUserId, profileUserId) => currentUserId === profileUserId
);

export const getUserAvatar = createSelector(
  [getUserInfo],
  (info = {}) => info.avatar
);

export const getUserLanguages = createSelector(
  [getUserInfo],
  (info = {}) => info.languages
);

export const getUserLocationId = createSelector(
  [getUserInfo],
  (info = {}) => info.location_id
);

export const getIsOccupationHidden = createSelector(
  [getIsSelf, getIsOccupationPrivate],
  (isSelf, isPrivate) => isPrivate && !isSelf
);

export const getUserMeasurementUnit = createSelector(
  [getUserInfo],
  (info = {}) => info.measurement_unit
);

/**
 * User categories
 */

const getUsersCategories = (state) => state.entities.users.categories;

export const getUserCategories = createSelector(
  [getUsersCategories, getUserIdFromProps],
  (usersCategories, userId) => usersCategories[userId]
);

export const getUserHabits = createSelector([getUserCategories], (categories) =>
  categories
    ? categories.filter((cat) => cat.habit).map(({ habit }) => habit)
    : []
);
export const getIsUserCategoriesLoaded = createSelector(
  [getUserCategories],
  (categories) => !!categories
);

export const isLocationCompleted = createSelector([getUserInfo], (info) => {
  if (!info) return true;
  return !!info.location;
});

export const areLanguagesCompleted = createSelector([getUserInfo], (info) => {
  if (!info) return true; // not loaded TO DO: selector for that
  return info.languages && info.languages.length > 0;
});

export const areGenderCompleted = createSelector([getUserInfo], (info) => {
  if (!info) return true; // not loaded TO DO: selector for that
  return !!info.gender;
});

export const isNameCompleted = createSelector([getUserInfo], (info) => {
  if (!info) return true; // not loaded TO DO: selector for that
  return !!info.name;
});

export const isOccupationCompleted = createSelector(
  [getUserAboutData],
  (about) => {
    if (!about) return true; // not loaded TO DO: selector for that
    return !!about.occupation;
  }
);

export const isAboutCompleted = createSelector([getUserAboutData], (about) => {
  if (!about) return true; // not loaded TO DO: selector for that
  return about.about && about.about.length >= 30;
});

export const isWeaknessCompleted = createSelector(
  [getUserAboutData],
  (about) => {
    if (!about) return true; // not loaded TO DO: selector for that
    return !!about.weakness;
  }
);

export const areStrengthCompleted = createSelector(
  [getUserAboutData],
  (about) => {
    if (!about) return true; // not loaded TO DO: selector for that
    return !!about.strength;
  }
);

export const isFoodCompleted = createSelector([getUserAboutData], (about) => {
  if (!about) return true; // not loaded TO DO: selector for that
  return !!about.favoriteFood;
});

export const isMeetingPreferenceCompleted = createSelector(
  [getUserPreferences],
  (preferences) => {
    if (!preferences) return true; // not loaded TO DO: selector for that
    return !!preferences.meetingPreference;
  }
);

export const isBirthdayCompleted = createSelector(
  [getUserProfileData],
  (profile) => {
    if (!profile) return true; // not loaded TO DO: selector for that
    return !!profile.date_of_birth;
  }
);

export const atLeastOneCategory = createSelector(
  [getUserCategories, getIsUserCategoriesLoaded],
  (categories, loaded) => {
    if (!loaded) return true; // not loaded TO DO: selector for that
    return categories.filter((e) => e.active).length > 0;
  }
);

export const getProfilePercentage = createSelector(
  [
    isAboutCompleted,
    isFoodCompleted,
    isLocationCompleted,
    isMeetingPreferenceCompleted,
    isOccupationCompleted,
    isWeaknessCompleted,
    areLanguagesCompleted,
    areStrengthCompleted,
    isBirthdayCompleted,
    isNameCompleted,
  ],
  (...fields) => {
    const completed = fields.filter((e) => e);
    return ((completed.length / fields.length) * 100).toFixed(2);
  }
);

export const getFieldPercentage = createSelector(
  [
    isAboutCompleted,
    isFoodCompleted,
    isLocationCompleted,
    isMeetingPreferenceCompleted,
    isOccupationCompleted,
    isWeaknessCompleted,
    areLanguagesCompleted,
    areStrengthCompleted,
    isBirthdayCompleted,
    isNameCompleted,
  ],
  (...fields) => (1 / fields.length) * 100
);

export const isAboutModuleComplete = createSelector(
  [
    isAboutCompleted,
    isFoodCompleted,
    isOccupationCompleted,
    isWeaknessCompleted,
    areStrengthCompleted,
  ],
  (...fields) => fields.filter((e) => !e).length === 0
);

export const isBasicInfoComplete = createSelector(
  [isNameCompleted, isBirthdayCompleted],
  (...fields) => fields.filter((e) => !e).length === 0
);

export const isProfileComplete = createSelector(
  [getProfilePercentage],
  (percentage) => parseInt(percentage, 10) >= 99
);

export const shouldShowIncompleteSteps = createSelector(
  [getUserAboutData],
  (about) => about && !about.favoriteFood
);

export const getMyGroupsPaginationNextUrl = createSelector(
  [getMyGroupsPagination],
  (userGroups = {}) => userGroups.next
);

export const getHasReachedMyGroupsPaginationEnd = createSelector(
  [getMyGroupsPaginationNextUrl],
  (next) => next === null
);

export const getGroupsInvitesPaginationNextUrl = createSelector(
  [getGroupsInvitesPagination],
  (pagination = {}) => pagination.next
);

export const getHasReachedGroupsInvitesPaginationEnd = createSelector(
  [getGroupsInvitesPaginationNextUrl],
  (next) => next === null
);

export const getChallengessInvitesPaginationNextUrl = createSelector(
  [getChallengesInvitesPagination],
  (pagination = {}) => pagination.next
);

export const getHasReachedChallengesInvitesPaginationEnd = createSelector(
  [getChallengessInvitesPaginationNextUrl],
  (next) => next === null
);

export const getChallengesInvitesPaginationNextUrl = createSelector(
  [getChallengesInvitesPagination],
  (pagination = {}) => pagination.next
);

export const getMyGroupsInvites = createSelector(
  [getGroupsInvites],
  (groupsInvites = {}) => Object.values(groupsInvites)
);

export const getMyGroupsData = createSelector([getMyGroups], (myGroups = {}) =>
  Object.values(myGroups)
);

export const getMyVisibleGroups = createSelector([getMyGroupsData], (groups) =>
  groups.filter((group) => {
    if (group.privacy === 'Public') return true;
    return GROUP_STAFF.includes(group.membershipLevel);
  })
);

export const getMyAdminGroups = createSelector([getMyGroupsData], (groups) =>
  groups.filter((group) => GROUP_STAFF.includes(group.membershipLevel))
);

const getRecentBehaviors = (state) => state.entities.users.recentBehaviors;
export const getRecentBehaviorsList = createSelector(
  [getRecentBehaviors, getUserIdFromUser],
  (behaviours, userId) => behaviours[userId]
);
const getRecentEventTemplates = (state) =>
  state.entities.users.recentEventTemplates;
export const getRecentEventTemplatesList = createSelector(
  [getRecentEventTemplates, getUserIdFromUser],
  (events, userId) => events[userId]
);

export const getMyChallengesInvites = createSelector(
  [getChallengesInvites],
  (challengesInvites = {}) => Object.values(challengesInvites)
);
