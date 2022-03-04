import { createSelector } from 'redux-starter-kit';
import withResource from './withResource';
import { fetchApps } from '../../../Actions/actions_profile';

const getApps = (state) => state.entities.apps;

const appsOptions = createSelector([getApps], (apps) =>
  Object.values(apps).map((app) => ({
    key: app.id,
    value: app.id,
    text: app.name,
    iconurl: app.icon,
  }))
);
export default ({ ...config }) =>
  withResource({
    resource: 'allApps',
    fetchAction: fetchApps,
    selector: appsOptions,
    ...config,
  });
