import keyBy from 'lodash/keyBy';

const cacheVersion = 0;

export default {
  savePlans(planList) {
    const plans = keyBy(planList, 'id');
    localStorage.setItem(
      '__calendar-cache',
      JSON.stringify({
        v: cacheVersion,
        data: plans,
      })
    );
  },
  getPlans() {
    try {
      const plansString = localStorage.getItem('__calendar-cache');
      const plans = JSON.parse(plansString);
      if (plans.v !== cacheVersion) {
        return undefined;
      }
      return plans.data;
    } catch (e) {
      return undefined;
    }
  },
  deletePlans() {
    localStorage.removeItem('__calendar-cache');
  },
};
