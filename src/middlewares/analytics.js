import createHandlerMiddleware from 'redux-handler-middleware';
import { TrackEvent } from '../Services/TrackEvent';
import { getMyProfileId } from '../selectors/profile';
import {
  deleteEvent,
  createPlan,
  updateEvent,
  createEvent,
} from '../Actions/actions_plan';

const blockedForIntercom = [/^\/profile$/, /verify/, /\/dashboard\/+\w/];

export default createHandlerMiddleware([
  {
    action: updateEvent.succeeded.type,
    afterHandler: () => TrackEvent('plan-event-add'),
  },
  {
    action: createEvent.succeeded.type,
    afterHandler: () => TrackEvent('plan-added-event'),
  },
  {
    action: createPlan.succeeded.type,
    afterHandler: () => TrackEvent('plan-added-plan'),
  },
  {
    action: deleteEvent.succeeded.type,
    afterHandler: () => TrackEvent('plan-event-delete'),
  },
  {
    action: '@@router/LOCATION_CHANGE',
    afterHandler: (
      store,
      {
        payload: {
          location: { pathname },
        },
      }
    ) => {
      const isBlocked = blockedForIntercom
        .map((regex) => regex.test(pathname))
        .some((e) => e);
      if (!isBlocked) {
        if (/profile/g.test(pathname)) {
          const state = store.getState();
          const myProfileId = getMyProfileId(state);
          const id = pathname.split('/').pop();
          if (myProfileId) {
            if (`${myProfileId}` === id) {
              const event = 'priprofile-viewed-page';
              TrackEvent(event);
            } else {
              const event = 'pubprofile-viewed-page';
              TrackEvent(event, { profileId: id });
            }
          }
        } else if (/plan/g.test(pathname)) {
          const event = 'plan-viewed-page';
          TrackEvent(event, { location: pathname });
        } else if (/groups\/\d/.test(pathname)) {
          const id = pathname.split('/').pop();
          const event = 'grp-viewed-page';
          TrackEvent(event, { groupId: id });
        } else {
          const path = pathname.slice(1).replace(/\//g, '-');
          const event = `${path}-viewed-page`;
          TrackEvent(event);
        }
      }
    },
  },
]);
