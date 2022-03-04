import withResource from './withResource';
import { fetchEventDetails } from '../../../Actions/actions_plan';
import { getEvent, getParamsId } from '../../../selectors/plans';

export default ({ ...config }) =>
  withResource({
    resource: 'eventDetails',
    fetchAction: fetchEventDetails,
    selector: getEvent,
    paramsSelector: getParamsId,
    alwaysFetchOnMount: true,
    ...config,
  });
