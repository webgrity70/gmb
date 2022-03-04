import withResource from './withResource';
import { fetchGroupsLevels } from '../../../Actions/actions_groups';
import { getLevels } from '../../../selectors/groups';

export default ({ ...config }) =>
  withResource({
    resource: 'groupsLevels',
    fetchAction: fetchGroupsLevels,
    selector: getLevels,
    ...config,
  });
