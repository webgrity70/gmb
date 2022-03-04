import moment from 'moment';

const STATUSES = {
  TRIAL: 'in_trial',
};

function hasExpired({ planStatus, trialEnd, currentTermEnd }) {
  if (!planStatus) return null;
  let date = '';
  const now = moment(Date.now());
  if (planStatus === STATUSES.TRIAL) {
    date = trialEnd;
  } else {
    date = currentTermEnd;
  }
  const diffExpired = moment(date).diff(now, 'minutes');
  return diffExpired <= 0;
}

export default hasExpired;
