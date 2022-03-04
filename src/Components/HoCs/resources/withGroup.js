import get from 'lodash/get';
import withResource from './withResource';
import { fetchGroup } from '../../../Actions/actions_groups';
import { getFullGroup, isLoading, haveError } from '../../../selectors/groups';

export default ({ ...config }) =>
  withResource({
    resource: 'data',
    fetchAction: fetchGroup,
    fetchingSelector: (state) => isLoading(state),
    errorSelector: (state) => haveError(state),
    selector: (state, props) => {
      const idParam = get(props, 'match.params.id', null);
      const groupId = idParam ? parseInt(idParam, 10) : null;
      return getFullGroup(state, { groupId });
    },
    ...config,
  });
