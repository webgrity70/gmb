import { IntercomAPI } from 'react-intercom';

export const TrackEvent = (event, metadata) => {
  IntercomAPI('trackEvent', event, metadata);
  if (window.analytics) {
    window.analytics.track(event, metadata);
  }
};
