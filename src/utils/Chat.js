import moment from 'moment';

export const getBuddyForThread = (thread, userId) => {
  if (thread.participantA.id === userId) {
    return thread.participantB;
  }

  return thread.participantA;
};

export const getCurrentUserForThread = (thread, userId) => {
  if (thread.participantA.id === userId) {
    return thread.participantA;
  }

  return thread.participantB;
};

export const isExpired = (expiringTime) =>
  moment(expiringTime).isSameOrBefore(moment());
