import { useReducer } from 'react';
import copy from 'copy-to-clipboard';
import { createAction, createReducer } from 'redux-starter-kit';
import useTimeout from './use-timeout';

const setCopied = createAction('SET_COPIED');
const clearCopied = createAction('CLEAR_COPIED');

const initialState = { copied: false, delay: null };
const reducer = createReducer(initialState, {
  [setCopied]: (state, action) => ({
    copied: action.payload.copied,
    delay: action.payload.delay,
  }),
  [clearCopied]: () => initialState,
});

export default function useCopyClipboardTimeout(text, delay) {
  const [state, dispatch] = useReducer(reducer, initialState);

  useTimeout(() => {
    dispatch(clearCopied());
  }, state.delay);

  return [
    state.copied,
    () => {
      const copied = copy(text);
      dispatch(setCopied({ delay, copied }));
    },
  ];
}
