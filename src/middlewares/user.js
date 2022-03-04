import createHandlerMiddleware from 'redux-handler-middleware';
import * as userActions from '../Actions/actions_user';
import CalendarCacheService from '../Services/CalendarCacheService';

export default createHandlerMiddleware([
  {
    action: userActions.logout.type,
    afterHandler: () => {
      CalendarCacheService.deletePlans();
    },
  },
]);
