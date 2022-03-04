import moment from 'moment';
import { logout } from '../Actions/actions_user';
import history from '../history';
import LoginService from '../Services/LoginService';

export function refreshToken(dispatch) {
  const freshTokenPromise = LoginService.refreshToken()
    .then((tokenData) => {
      localStorage.setItem('access_token', tokenData.access_token);
      localStorage.setItem('refresh_token', tokenData.refresh_token);
      localStorage.setItem(
        'expires',
        moment().add(tokenData.expires_in, 'seconds').format()
      );
      dispatch({
        type: 'AUTH_DONE_REFRESHING_TOKEN',
      });
      return tokenData.access_token
        ? Promise.resolve()
        : Promise.reject(new Error('Could not refresh token'));
    })
    .catch((e) => {
      dispatch({
        type: 'AUTH_DONE_REFRESHING_TOKEN',
      });
      return Promise.reject(e);
    });

  dispatch({
    type: 'AUTH_REFRESHING_TOKEN',
    freshTokenPromise,
  });

  return freshTokenPromise;
}
export default ({ dispatch, getState }) => (next) => async (action) => {
  if (typeof action === 'function') {
    const expireDate = localStorage.getItem('expires')
      ? moment(localStorage.getItem('expires'))
      : null;
    if (moment().isAfter(expireDate, 'seconds')) {
      if (!getState().session.auth.freshTokenPromise) {
        return refreshToken(dispatch)
          .then(() => next(action))
          .catch(() => {
            history.block(() => null);
            dispatch(logout());
          });
      }
      return getState()
        .session.auth.freshTokenPromise.then(() => next(action))
        .catch(() => {
          history.block(() => null);
          dispatch(logout());
        });
    }
    return next(action);
  }
  return next(action);
};
