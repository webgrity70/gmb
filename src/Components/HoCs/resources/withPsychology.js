import withResource from './withResource';
import { fetchPsychology } from '../../../Actions/actions_profile';

const getPsychology = (state) => Object.values(state.entities.psychology);

export default ({ ...config }) =>
  withResource({
    resource: 'allPsychology',
    fetchAction: fetchPsychology,
    selector: getPsychology,
    ...config,
  });
