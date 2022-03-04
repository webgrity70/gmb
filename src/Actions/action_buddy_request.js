import { createAction } from 'redux-starter-kit';
import BuddiesService from '../Services/BuddiesService';
import { fetchThreads } from './action_chat';
import { makeFetchAction } from './utils';

export const buddyHasAccepted = createAction('[BUDDY_REQUEST] BUDDY_ACCEPTED');

export const acceptRequest = makeFetchAction({
  actionGroup: 'BUDDY_REQUEST',
  action: 'ACCEPT_REQUEST',
  fetchData: BuddiesService.accept,
  onSucceedPayload(args, res) {
    return res.data;
  },
  onSucceedHandler(args, res, dispatch) {
    dispatch(fetchThreads());
    return res.data;
  },
});

export const declineRequest = makeFetchAction({
  actionGroup: 'BUDDY_REQUEST',
  action: 'DECLINE_REQUEST',
  fetchData: BuddiesService.decline,
  onSucceedPayload(args, res) {
    return res.data;
  },
  onSucceedHandler(args, res, dispatch) {
    dispatch(fetchThreads());
    return res.data;
  },
});
