import withResource from './withResource';
import { fetchChallengeDetails } from '../../../Actions/actions_challenges';
import { getParamsId } from '../../../selectors/plans';
import { getChallengeDetails } from '../../../selectors/challenges';

export default ({ ...config }) =>
  withResource({
    resource: 'challenge',
    fetchAction: fetchChallengeDetails,
    selector: getChallengeDetails,
    paramsSelector: getParamsId,
    alwaysFetchOnMount: true,
    ...config,
  });
