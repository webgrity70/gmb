import { createAction } from 'redux-starter-kit';

const invalidTokenMsg = 'Invalid token header. No credentials provided.';
// We should use the response status but then we need to modificate
// every request to return that status

const defaultOnSucceedPayload = (args, data) => data;
const defaultOnErrorPayload = (args, e) => e;
const defaultOnSucceedHandler = (args, data) => data;

const logout = createAction('[USER] LOGOUT');

export const makeFetchAction = ({
  action = '',
  actionGroup = '',
  fetchData,
  onSucceedPayload = defaultOnSucceedPayload,
  onErrorPayload = defaultOnErrorPayload,
  onSucceedHandler = defaultOnSucceedHandler,
}) => {
  const actions = {
    started: createAction(`[${actionGroup}] ${action}`),
    succeeded: createAction(`[${actionGroup}] ${action}_SUCCEEDED`),
    failed: createAction(`[${actionGroup}] ${action}_FAILED`),
  };

  function thunkAction(...args) {
    return async (dispatch, getState) => {
      dispatch(actions.started(args));
      try {
        const data = await fetchData(...args);
        dispatch(actions.succeeded(onSucceedPayload(args, data)));
        return onSucceedHandler(args, data, dispatch, getState);
      } catch (e) {
        const error =
          e.stack && e.stack.includes('SyntaxError')
            ? { message: 'Something went wrong' }
            : e;
        dispatch(actions.failed(onErrorPayload(args, error)));
        if (e.detail && e.detail === invalidTokenMsg && !e.avoidLogout) {
          dispatch(logout());
        }
        throw onErrorPayload(args, e);
      }
    };
  }

  thunkAction.started = actions.started;
  thunkAction.succeeded = actions.succeeded;
  thunkAction.failed = actions.failed;

  return thunkAction;
};
