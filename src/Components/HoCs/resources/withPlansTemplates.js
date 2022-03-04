import withResource from './withResource';
import { fetchPlansTemplates } from '../../../Actions/actions_plan';
import { getPlansTemplates } from '../../../selectors/plans';

export default ({ ...config }) =>
  withResource({
    resource: 'templates',
    fetchAction: fetchPlansTemplates,
    selector: getPlansTemplates,
    skipLoading: true,
    ...config,
  });
