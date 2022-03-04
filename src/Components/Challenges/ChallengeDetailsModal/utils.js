import BEMHelper from 'react-bem-helper';
import { Remarkable } from 'remarkable';
import get from 'lodash/get';
import { touch } from 'redux-form';
import { linkify } from 'remarkable/linkify';
import PropTypes from 'prop-types';
import moment from 'moment';
import { getMyProfile } from '../../../selectors/profile';
import { getPathname } from '../../../selectors/router';
import { getSlug, getTimeFromMinutes } from '../../NewPlan/utils';
import * as challengeActions from '../../../Actions/actions_challenges';
import { initThread } from '../../../Actions/actions_challenges_chat';
import {
  getChallengeConfirmations,
  getChallengeDetails,
  getChallengeCheckins,
  getCurrentChallengeMembers,
} from '../../../selectors/challenges';
import {
  getLoadingJoinFlashChallenge,
  getLoadingLeaveChallenge,
} from '../../../selectors/requests';
import {
  deletePlan as deletePlanAction,
  createPlan as createPlanAction,
} from '../../../Actions/actions_plan';
import indexesToPrompts from '../../../utils/indexesToPrompts';

const md = new Remarkable({ linkTarget: '_blank' }).use(linkify);

export const bem = BEMHelper({
  name: 'ChallengeDetailsModal',
  outputIsString: true,
});

export const propTypes = {
  trigger: PropTypes.node,
  touchField: PropTypes.func,
  onOpen: PropTypes.func,
  open: PropTypes.bool,
  id: PropTypes.number,
  fetchChallengeDetails: PropTypes.func,
  onClose: PropTypes.func,
  pathname: PropTypes.string,
  challenge: PropTypes.oneOfType([PropTypes.shape(), PropTypes.oneOf([null])]),
  confirmations: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.shape()),
    PropTypes.oneOf([null]),
  ]),
  checkins: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.shape()),
    PropTypes.oneOf([null]),
  ]),
  members: PropTypes.any,
  fetchChallengeCheckins: PropTypes.func,
  fetchChallengeConfirmations: PropTypes.func,
  createPlan: PropTypes.func,
  createPlanJoinFlashChallenge: PropTypes.func,
  myUser: PropTypes.shape(),
  loadingJoin: PropTypes.bool,
  loadingLeave: PropTypes.bool,
  deletePlan: PropTypes.func,
  deleteChallenge: PropTypes.func,
  leaveChallenge: PropTypes.func,
};

export const editFormName = 'edit-flash-challenge';
export const repeatFormName = 'repeat-flash-challenge';

export const getEditInitialValues = ({ challenge, startDateFormatted }) => {
  const initialDuration = getTimeFromMinutes(challenge.duration);
  const [initialTime, format] = startDateFormatted.split(' ');
  const [hours, minutes] = initialTime.split(':');

  return {
    type: 'single',
    date: moment(challenge.date),
    location: challenge.place,
    habit: {
      category: challenge.category,
      habit: challenge.habit,
      slug: getSlug(challenge.category),
      value: challenge.habitID,
      description: md.render(challenge.specifics),
    },

    customPrompts: {
      active: challenge.prompts.length > 0,
      prompts: indexesToPrompts(challenge.prompts),
    },

    duration: {
      hours: String(initialDuration.hours),
      minutes: String(initialDuration.minutes),
    },

    time: {
      hours,
      minutes,
      ...(format && { format: format.toLowerCase() }),
    },

    milestone: {
      active: !!challenge.milestone,
      description: challenge.milestone,
    },

    challenge: {
      active: true,
      name: challenge.name,
      address: {
        active: false,
        location: '',
        placeId: null,
      },
    },
  };
};

export function getDateStatuses({ date, duration }) {
  const isStarted = date.clone().isBefore(moment());
  const isConfirmationStarted = date.clone().diff(moment(), 'hours') < 24;
  const isFinished = moment() > date.clone().add(duration, 'minutes');
  return { isStarted, isFinished, isConfirmationStarted };
}

export const mapStateToProps = (state, { id, challenge }) => {
  const confirmations = getChallengeConfirmations(state, { id });
  const checkins = getChallengeCheckins(state, { id });
  const members = getCurrentChallengeMembers(state, { id });

  const userOwner = (() => {
    if (challenge.type === 'Flash') {
      return (
        confirmations &&
        confirmations.find(
          (e) => e.userID === get(challenge, 'challengeManager.id', null)
        )
      );
    }

    const details = getChallengeDetails(state, { id });
    if (details) return details.challengeManager;

    return challenge.challengeManager;
  })();
  return {
    // challenge: getChallengeDetails(state, { id }),
    pathname: getPathname(state),
    userOwner,
    confirmations,
    checkins,
    members,
    loadingJoin: getLoadingJoinFlashChallenge(state),
    loadingLeave: getLoadingLeaveChallenge(state),
    myUser: getMyProfile(state),
  };
};

export const mapDispatchToProps = {
  fetchChallengeDetails: challengeActions.fetchChallengeDetails,
  fetchChallengeConfirmations: challengeActions.fetchChallengeConfirmations,
  fetchChallengeCheckins: challengeActions.fetchChallengeCheckins,
  fetchChallengeMembers: challengeActions.fetchMembers,
  createPlanJoinFlashChallenge: challengeActions.createPlanJoinFlashChallenge,
  createPlan: createPlanAction,
  leaveChallenge: challengeActions.leaveChallenge,
  deleteChallenge: challengeActions.deleteChallenge,
  openChat: initThread,
  deletePlan: deletePlanAction,
  touchField: touch,
};
