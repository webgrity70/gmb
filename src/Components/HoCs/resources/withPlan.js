import withResource from './withResource';
import { fetchPlan } from '../../../Actions/actions_plan';
import { getPlan, getParamsId } from '../../../selectors/plans';

export default ({ ...config }) =>
  withResource({
    resource: 'plan',
    fetchAction: fetchPlan,
    selector: getPlan,
    paramsSelector: getParamsId,
    alwaysFetchOnMount: true,
    ...config,
  });
