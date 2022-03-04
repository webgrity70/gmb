import withResource from './withResource';
import { fetchEventsTemplates } from '../../../Actions/actions_plan';
import { getEventsTemplates } from '../../../selectors/plans';

export default ({ ...config }) =>
  withResource({
    resource: 'templates',
    fetchAction: fetchEventsTemplates,
    selector: getEventsTemplates,
    skipLoading: true,
    ...config,
  });
