import { createReducer } from 'redux-starter-kit';
import get from 'lodash/get';
import keyBy from 'lodash/keyBy';
import omit from 'lodash/omit';
import * as groupsActions from '../Actions/actions_groups';

const initialState = {
  loading: false,
  posting: false,
  error: null,
  members: [],
  announcements: [],
  posts: [],
  draftPosts: [],
  pendingPrivateMembers: [],
  templates: [],
  admins: [],
  responses: {},
  welcomePost: '',
  groupManager: null,
  updatedPost: 0,
};

const reducer = createReducer(initialState, {
  [groupsActions.fetchGroupStarted]: (state) => ({
    ...initialState,
    posting: state.posting,
    loading: true,
  }),
  [groupsActions.fetchMembersSucceeded]: (state, { payload }) => ({
    ...state,
    loading: false,
    error: null,
    members: payload.previous
      ? [...state.members, ...payload.results]
      : payload.results,
  }),
  [groupsActions.fetchAnnouncementsSucceeded]: (state, { payload }) => ({
    ...state,
    loading: false,
    error: null,
    announcements: [...state.announcements, ...get(payload, 'results', [])],
  }),
  [groupsActions.fetchPostsSucceeded]: (state, { payload }) => ({
    ...state,
    loading: false,
    error: null,
    posts: [...get(payload, 'results', [])],
  }),
  [groupsActions.fetchNextPostsSucceeded]: (state, { payload }) => ({
    ...state,
    loading: false,
    error: null,
    posts: [...state.posts, ...get(payload, 'results', [])],
  }),
  [groupsActions.fetchDraftPostsSucceeded]: (state, { payload }) => ({
    ...state,
    loading: false,
    error: null,
    draftPosts: [...get(payload, 'results', [])],
  }),
  [groupsActions.fetchGroupFailed]: (state, { payload }) => ({
    ...state,
    loading: false,
    error: payload,
  }),
  [groupsActions.joinGroupStarted]: (state) => ({ ...state, posting: true }),
  [groupsActions.joinGroupSucceeded]: (state) => ({ ...state, posting: false }),
  [groupsActions.leaveGroupSucceeded]: (state) => ({
    ...state,
    posting: false,
  }),
  [groupsActions.joinGroupFailed]: (state, { payload }) => ({
    ...state,
    posting: false,
    error: payload,
  }),
  [groupsActions.createGroup.started]: (state) => ({
    ...state,
    posting: true,
  }),
  [groupsActions.createGroup.failed]: (state) => ({
    ...state,
    posting: false,
  }),
  [groupsActions.createGroup.succeeded]: (state) => ({
    ...state,
    posting: false,
  }),
  [groupsActions.createAnnouncementSucceded.type]: (state, { payload }) => ({
    ...state,
    announcements: [payload, ...state.announcements],
  }),
  [groupsActions.createPostSucceeded.type]: (state, { payload }) => ({
    ...state,
    posts: [payload, ...state.posts],
  }),
  [groupsActions.createDraftPostSucceeded.type]: (state, { payload }) => ({
    ...state,
    draftPosts: [payload, ...state.draftPosts],
  }),
  [groupsActions.editPostSucceeded.type]: (state, { payload }) => {
    let posts = [...state.posts];
    let draftPosts = [...state.draftPosts];
    if (payload.is_draft) {
      draftPosts = draftPosts.map((draftPost) => {
        if (draftPost.id === payload.id) {
          draftPost = payload;
        }
        return draftPost;
      });
    } else {
      posts = posts.map((post) => {
        if (post.id === payload.id) {
          post = payload;
        }
        return post;
      });
    }
    return {
      ...state,
      updatedPost: payload.id,
      posts,
      draftPosts,
    };
  },
  [groupsActions.editDraftPostSucceeded.type]: (state, { payload }) => {
    const draftPosts = [...state.draftPosts];
    const postIds = draftPosts.map((post) => post.id);
    const postIndex = postIds.indexOf(payload.id);
    draftPosts.splice(postIndex, 1, payload);

    return {
      ...state,
      updatedPost: payload.id,
      draftPosts,
    };
  },

  [groupsActions.deletePostSucceeded.type]: (state, { payload }) => ({
    ...state,
    posts: state.posts.filter((post) => post.id !== payload.postId),
  }),
  [groupsActions.deleteDraftPostSucceeded.type]: (state, { payload }) => ({
    ...state,
    draftPosts: state.draftPosts.filter((post) => post.id !== payload.postId),
  }),
  [groupsActions.fetchPendingPrivateMembers.succeeded]: (
    state,
    { payload }
  ) => ({
    ...state,
    pendingPrivateMembers: payload.previous
      ? [...state.pendingPrivateMembers, ...payload.results]
      : payload.results,
  }),
  [groupsActions.changePPMStatus.succeeded]: (state, { payload }) => {
    const user = state.pendingPrivateMembers.find(
      (e) => e.id === payload.userId
    );
    return {
      ...state,
      pendingPrivateMembers: state.pendingPrivateMembers.filter(
        (e) => e.id !== payload.userId
      ),
      ...(payload.condition && { members: [...state.members, user] }),
    };
  },
  [groupsActions.kickUserFromGroup.succeeded]: (state, { payload }) => ({
    ...state,
    members: state.members.filter((e) => e.id !== payload.userId),
  }),
  [groupsActions.fetchGroupAdmins.succeeded]: (state, { payload }) => ({
    ...state,
    admins: payload,
  }),
  [groupsActions.fetchGroupTemplates.succeeded]: (state, { payload }) => ({
    ...state,
    templates: keyBy(payload, 'id'),
  }),
  [groupsActions.fetchPostResponsesSucceeded.type]: (state, { payload }) => {
    const { responses } = state;
    return {
      ...state,
      responses: {
        ...responses,
        [payload.postId]: {
          ...get(responses, payload.postId, {}),
          ...keyBy(get(payload, 'data.results', []), 'id'),
        },
      },
    };
  },
  [groupsActions.createPostResponseSucceeded.type]: (state, { payload }) => {
    const { responses } = state;
    return {
      ...state,
      responses: {
        ...responses,
        updatedPost: payload.postId,
        [payload.postId]: {
          [payload.data.id]: payload.data,
          ...get(responses, payload.postId, {}),
        },
      },
    };
  },
  [groupsActions.deletePostResponseSucceeded.type]: (state, { payload }) => {
    const { responses } = state;
    const postResponses = responses[payload.postId];
    return {
      ...state,
      updatedPost: payload.postId,
      responses: {
        ...responses,
        [payload.postId]: omit(postResponses, payload.responseId),
      },
    };
  },
  [groupsActions.editPostResponseSucceeded.type]: (state, { payload }) => {
    const { responses } = state;
    const postResponses = get(responses, payload.postId, {});
    return {
      ...state,
      responses: {
        ...responses,
        [payload.postId]: { ...postResponses, [payload.data.id]: payload.data },
      },
    };
  },
  [groupsActions.fetchGroupSucceeded.type]: (state, { payload }) => ({
    ...state,
    welcomePost: get(payload, 'welcome_post'),
  }),
  [groupsActions.fetchGroupSucceeded.type]: (state, { payload }) => ({
    ...state,
    groupManager: get(payload, 'groupManager'),
  }),
  [groupsActions.createWelcomePostSucceeded.type]: (state, { payload }) => ({
    ...state,
    welcomePost: get(payload, 'welcome_post'),
  }),
});

export default reducer;
