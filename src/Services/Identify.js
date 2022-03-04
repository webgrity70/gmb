import LogRocket from 'logrocket';

export const Identify = (userData, { subscription } = {}) => {
  //Segment snippet ---->
  if (window.analytics) {
    window.analytics.identify(userData.pk, {
      email: userData.email,
      firstName: userData.first_name,
      lastName: userData.last_name,
      gender: userData.gender,
      planStatus: subscription.planStatus,
      trialEnd: subscription.trialEnd,
      planName: subscription.planName,
    });
  }
  //Logrocket Snippet ---->
  LogRocket.identify(userData.pk, {
    name: userData.name,
    email: userData.email,
  });
  //Encharge Snippet ---->
  if (window.EncTracking) {
    window.EncTracking.identify({
      email: userData.email,
      userId: userData.pk,
      name: `${userData.first_name} ${userData.last_name}`,
    });
  }

  // Lou Snippet ——>
  window.onload = function () {
    if (window.LOU) {
      window.LOU.identify(userData.pk);
    }
  };
};
//Link the same user tracked under different ids
export const IdentifyAlias = (userData) => {
  if (window.analytics) {
    window.analytics.alias(userData.pk);
  }
};
