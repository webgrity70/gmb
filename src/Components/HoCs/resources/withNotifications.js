import withResource from './withResource';
import { fetchUserNotifications } from '../../../Actions/actions_user';
import { getUserNotifications } from '../../../reducers/session/selectors';

export default ({ ...config }) =>
  withResource({
    resource: 'notifications',
    fetchAction: fetchUserNotifications,
    selector: getUserNotifications,
    ...config,
  });
