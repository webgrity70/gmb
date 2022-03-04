import withResource from './withResource';
import { fetchCategories } from '../../../Actions/actions_groups';

export default ({ ...config }) =>
  withResource({
    resource: 'categories',
    fetchAction: fetchCategories,
    selector: (state) => Object.values(state.entities.categories),
    ...config,
  });
