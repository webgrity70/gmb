import withResource from './withResource';
import { fetchEventDetails } from '../../../Actions/actions_plan';
import { getEvent, getEventId } from '../../../selectors/plans';

export default ({ ...config }) =>
  withResource({
    resource: 'eventDetails',
    fetchAction: fetchEventDetails,
    selector: getEvent,
    paramsSelector: getEventId,
    ...config,
  });
