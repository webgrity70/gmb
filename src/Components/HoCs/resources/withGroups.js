import withResource from './withResource';
import { fetchGroups } from '../../../Actions/actions_groups';
import {
  getPaginatedGroups,
  getGroupsParams,
  getError,
} from '../../../selectors/groups';

export default ({ ...config }) =>
  withResource({
    resource: 'groups',
    fetchAction: fetchGroups,
    selector: getPaginatedGroups,
    paramsSelector: getGroupsParams,
    errorSelector: getError,
    ...config,
  });
