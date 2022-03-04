import { createAction } from 'redux-starter-kit';
import omit from 'lodash/omit';
import { toast } from 'react-toastify';
import GroupsService from '../Services/GroupsService';
import { makeFetchAction } from './utils';
import { getUserInfo } from '../selectors/profile';
import { leaveChat, fetchGroupsThreads } from './action_group_chat';
import { fetchThreads } from './action_chat';

export const fetchGroupStarted = createAction('[GROUP] FETCH_GROUP');
export const fetchGroupSucceeded = createAction(
  '[GROUP] FETCH_GROUP_SUCCEEDED'
);
export const fetchGroupFailed = createAction('[GROUP] FETCH_GROUPS_FAILED');

export const contactMemberStarted = createAction('[GROUP] CONTACT_MEMBER');
export const contactMemberSucceeded = createAction(
  '[GROUP] CONTACT_MEMBER_SUCCEEDED'
);
export const contactMemberFailed = createAction(
  '[GROUP] CONTACT_MEMBER_FAILED'
);

export const resetPostsPagination = createAction(
  '[GROUP] RESET_POSTS_PAGINATION'
);

export const fetchMembersSucceeded = createAction(
  '[GROUP] FETCH_MEMBERS_SUCCEEDED'
);
export const fetchMembersStarted = createAction(
  '[GROUP] FETCH_MEMBERS_STARTED'
);
export const fetchMembersFailed = createAction('[GROUP] FETCH_MEMBERS_FAILED');

export const fetchAnnouncementsSucceeded = createAction(
  '[GROUP] FETCH_ANNOUNCEMENTS_SUCCEEDED'
);

export const fetchPostsStarted = createAction('[GROUP] FETCH_POSTS_STARTED');
export const fetchPostsFailed = createAction('[GROUP] FETCH_POSTS_FAILED');

export const joinGroupStarted = createAction('[GROUP] JOIN_GROUP');
export const joinGroupSucceeded = createAction('[GROUP] JOIN_GROUP_SUCCEEDED');
export const joinGroupFailed = createAction('[GROUP] JOIN_GROUP_FAILED');
export const leaveGroupSucceeded = createAction(
  '[GROUP] LEAVE_GROUP_SUCCEEDED'
);

export const fetchGroupsLevelsSucceeded = createAction(
  '[GROUP] FETCH_GROUPS_LEVELS_SUCCEEDED'
);

export const changeOrderSuccess = createAction(
  '[GROUP] CHANGE_ORDER_SUCCEEDED'
);
export const changeSearchSuccess = createAction(
  '[GROUP] CHANGE_SEARCH_SUCCEEDED'
);
export const changeFilterSuccess = createAction(
  '[GROUP] CHANGE_FILTER_SUCCEEDED'
);

export const changeMembersOrder = createAction(
  '[GROUP] CHANGE_MEMBERS_ORDER_SUCCEEDED'
);
export const changeMembersSearch = createAction(
  '[GROUP] CHANGE_MEMBERS_SEARCH_SUCCEEDED'
);
export const changeMembersFilter = createAction(
  '[GROUP] CHANGE_MEMBERS_FILTER_SUCCEEDED'
);

export const createAnnouncementStarted = createAction(
  '[GROUP] CREATE_ANNOUNCEMENT_STARTED'
);
export const createAnnouncementSucceded = createAction(
  '[GROUP] CREATE_ANNOUNCEMENT_SUCCEEDED'
);
export const createAnnouncementFailed = createAction(
  '[GROUP] CREATE_ANNOUNCEMENT_FAILED'
);

export const fetchPostsSucceeded = createAction(
  '[GROUP] FETCH_POSTS_SUCCEEDED'
);
export const fetchDraftPostsSucceeded = createAction(
  '[GROUP] FETCH_DRAFT_POSTS_SUCCEEDED'
);
export const fetchNextPostsSucceeded = createAction(
  '[GROUP] FETCH_NEXT_POSTS_SUCCEEDED'
);

export const createPostStarted = createAction('[GROUP] CREATE_POST_STARTED');
export const createPostSucceeded = createAction(
  '[GROUP] CREATE_POST_SUCCEEDED'
);
export const createDraftPostSucceeded = createAction(
  '[GROUP] CREATE_DRAFT_POST_SUCCEEDED'
);
export const createPostFailed = createAction('[GROUP] CREATE_POST_FAILED');

export const editPostStarted = createAction('[GROUP] EDIT_POST_STARTED');
export const editPostSucceeded = createAction('[GROUP] EDIT_POST_SUCCEEDED');
export const editDraftPostSucceeded = createAction(
  '[GROUP] EDIT_DRAFT_POST_SUCCEEDED'
);
export const editPostFailed = createAction('[GROUP] EDIT_POST_FAILED');

export const deletePostStarted = createAction('[GROUP] DELETE_POST_STARTED');
export const deletePostSucceeded = createAction(
  '[GROUP] DELETE_POST_SUCCEEDED'
);
export const deleteDraftPostSucceeded = createAction(
  '[GROUP] DELETE_DRAFT_POST_SUCCEEDED'
);
export const deletePostFailed = createAction('[GROUP] DELETE_POST_FAILED');

export const pinPostStarted = createAction('[GROUP] PIN_POST_STARTED');
export const pinPostSucceeded = createAction('[GROUP] PIN_POST_SUCCEEDED');
export const pinPostFailed = createAction('[GROUP] PIN_POST_FAILED');

export const fetchPostResponsesSucceeded = createAction(
  '[GROUP] FETCH_POST_RESPONSES_SUCCEEDED'
);

export const createPostResponseStarted = createAction(
  '[GROUP] CREATE_POST_RESPONSE_STARTED'
);
export const createPostResponseSucceeded = createAction(
  '[GROUP] CREATE_POST_RESPONSE_SUCCEEDED'
);
export const createPostResponseFailed = createAction(
  '[GROUP] CREATE_POST_RESPONSE_FAILED'
);

export const editPostResponseStarted = createAction(
  '[GROUP] EDIT_POST_RESPONSE_STARTED'
);
export const editPostResponseSucceeded = createAction(
  '[GROUP] EDIT_POST_RESPONSE_SUCCEEDED'
);
export const editPostResponseFailed = createAction(
  '[GROUP] EDIT_POST_RESPONSE_FAILED'
);

export const deletePostResponseStarted = createAction(
  '[GROUP] DELETE_POST_RESPONSE_STARTED'
);
export const deletePostResponseSucceeded = createAction(
  '[GROUP] DELETE_POST_RESPONSE_SUCCEEDED'
);
export const deletePostResponseFailed = createAction(
  '[GROUP] DELETE_POST_RESPONSE_FAILED'
);

export const createWelcomePostSucceeded = createAction(
  '[GROUP] CREATE_WELCOME_POST_RESPONSE_SUCCEEDED'
);

export function fetchMembers(id, filters, page) {
  return async (dispatch) => {
    try {
      dispatch(fetchMembersStarted());
      const data = await GroupsService.getMembersWithParams(id, filters, page);
      dispatch(fetchMembersSucceeded(data));
    } catch (e) {
      dispatch(fetchMembersFailed(e));
    }
  };
}

export const fetchPendingPrivateMembers = makeFetchAction({
  actionGroup: 'MEMBERS',
  action: 'FETCH_PENDING_PRIVATE_MEMBERS',
  fetchData: GroupsService.getPendingPrivateMembers,
  onSucceedPayload: (args, data) => data,
});

export const kickUserFromGroup = makeFetchAction({
  actionGroup: 'MEMBERS',
  action: 'KICK_MEMBER',
  fetchData: GroupsService.kickMember,
  onSucceedPayload: (args) => args[0],
});

export const changePPMStatus = makeFetchAction({
  actionGroup: 'MEMBERS',
  action: 'CHANGE_PENDING_PRIVATE_MEMBERS',
  fetchData: GroupsService.changePPMStatus,
  onSucceedPayload: (args) => args[0],
});

export function fetchGroupsLevels() {
  return async (dispatch) => {
    try {
      const data = await GroupsService.getLevels();
      dispatch(fetchGroupsLevelsSucceeded({ result: data }));
    } catch (e) {
      console.log(e); // TO DO
    }
  };
}

export function fetchGroup(id, full = true) {
  return async (dispatch) => {
    dispatch(fetchGroupStarted({ id }));
    try {
      const data = await GroupsService.getOne(id, full);

      dispatch(
        fetchGroupSucceeded({ ...omit(data, 'members'), fullContent: full })
      );
      if (full) {
        dispatch(fetchMembersSucceeded(data.members));
        dispatch(fetchAnnouncementsSucceeded(data.announcements));
        dispatch(fetchPostsSucceeded(data.posts));
      }
    } catch (e) {
      dispatch(fetchGroupFailed({ ...e, id }));
    }
  };
}

export function joinGroup(groupId, isPrivate) {
  return async (dispatch) => {
    dispatch(joinGroupStarted());
    try {
      if (isPrivate) {
        await GroupsService.join(groupId);
        dispatch(joinGroupSucceeded({ groupId, userPermission: 'Requested' }));
      } else {
        const { members, announcements } = await GroupsService.join(groupId);
        await dispatch(fetchGroupsThreads({ usePagination: false }));
        dispatch(joinGroupSucceeded({ groupId, userPermission: 'Member' }));
        dispatch(fetchMembersSucceeded(members));
        dispatch(fetchAnnouncementsSucceeded(announcements));
      }
    } catch (e) {
      toast.error(e.message || 'Something was wrong');
      dispatch(joinGroupFailed(e));
    }
  };
}

export function leaveGroup(groupId) {
  return async (dispatch) => {
    dispatch(joinGroupStarted());
    try {
      await dispatch(leaveChat({ groupId }));
      const { members } = await GroupsService.leave(groupId);
      dispatch(leaveGroupSucceeded({ groupId }));
      dispatch(fetchMembersSucceeded(members));
    } catch (e) {
      dispatch(joinGroupFailed(e));
    }
  };
}

export const toggleGroupNewPostSiteNotificationAction = makeFetchAction({
  actionGroup: 'GROUPS',
  action: 'TOGGLE_NEW_POST_SITE_NOTIFICATION',
  fetchData: GroupsService.toggleGroupNotificationSetting,
  onSucceedPayload: (args) => args[0],
});

export const toggleGroupNewPostEmailNotificationAction = makeFetchAction({
  actionGroup: 'GROUPS',
  action: 'TOGGLE_NEW_POST_EMAIL_NOTIFICATION',
  fetchData: GroupsService.toggleGroupNotificationSetting,
  onSucceedPayload: (args) => args[0],
});

export const toggleGroupPostResponseSiteNotificationAction = makeFetchAction({
  actionGroup: 'GROUPS',
  action: 'TOGGLE_POST_RESPONSE_SITE_NOTIFICATION',
  fetchData: GroupsService.toggleGroupNotificationSetting,
  onSucceedPayload: (args) => args[0],
});

export const toggleGroupPostResponseEmailNotificationAction = makeFetchAction({
  actionGroup: 'GROUPS',
  action: 'TOGGLE_POST_RESPONSE_EMAIL_NOTIFICATION',
  fetchData: GroupsService.toggleGroupNotificationSetting,
  onSucceedPayload: (args) => args[0],
});

export const toggleGroupPostMentionSiteNotificationAction = makeFetchAction({
  actionGroup: 'GROUPS',
  action: 'TOGGLE_POST_MENTION_SITE_NOTIFICATION',
  fetchData: GroupsService.toggleGroupNotificationSetting,
  onSucceedPayload: (args) => args[0],
});

export const toggleGroupPostMentionEmailNotificationAction = makeFetchAction({
  actionGroup: 'GROUPS',
  action: 'TOGGLE_POST_MENTION_EMAIL_NOTIFICATION',
  fetchData: GroupsService.toggleGroupNotificationSetting,
  onSucceedPayload: (args) => args[0],
});

export const toggleGroupNewMemberSiteNotificationAction = makeFetchAction({
  actionGroup: 'GROUPS',
  action: 'TOGGLE_NEW_MEMBER_SITE_NOTIFICATION',
  fetchData: GroupsService.toggleGroupNotificationSetting,
  onSucceedPayload: (args) => args[0],
});

export const toggleGroupNewMemberEmailNotificationAction = makeFetchAction({
  actionGroup: 'GROUPS',
  action: 'TOGGLE_NEW_MEMBER_EMAIL_NOTIFICATION',
  fetchData: GroupsService.toggleGroupNotificationSetting,
  onSucceedPayload: (args) => args[0],
});

export function fetchAnnouncements(groupId, page) {
  return async (dispatch) => {
    dispatch(joinGroupStarted());
    try {
      const data = await GroupsService.getAllAnnouncements(groupId, page);
      dispatch(fetchAnnouncementsSucceeded(data));
    } catch (e) {
      console.log(e);
    }
  };
}

export function fetchPosts(groupId, page, userId, orderByResponses) {
  return async (dispatch) => {
    try {
      dispatch(fetchPostsStarted());
      const data = await GroupsService.getAllPosts(
        groupId,
        page,
        userId,
        orderByResponses
      );
      if (page) {
        dispatch(fetchNextPostsSucceeded(data));
      } else {
        dispatch(fetchPostsSucceeded(data));
      }
    } catch (e) {
      dispatch(fetchPostsFailed(e));
      console.log(e);
    }
  };
}

export const fetchGroups = makeFetchAction({
  actionGroup: 'GROUPS',
  action: 'FETCH_GROUPS',
  fetchData: GroupsService.getGroups,
  onSucceedPayload: (args, data) => data,
});

export const deleteGroup = makeFetchAction({
  actionGroup: 'GROUPS',
  action: 'DELETE_GROUP',
  fetchData: GroupsService.deleteGroup,
  onSucceedPayload: (args, data) => ({ ...data, groupId: args[0] }),
});

export const fetchCategories = makeFetchAction({
  actionGroup: 'CATEGORIES',
  action: 'FETCH_CATEGORIES',
  fetchData: GroupsService.getCategories,
  onSucceedPayload: (args, data) => data,
});

export const createAnnouncement = ({ user, group, text }) => async (
  dispatch,
  getState
) => {
  dispatch(createAnnouncementStarted());
  try {
    const data = await GroupsService.createAnnouncement({ user, group, text });
    const state = getState();
    const userInfo = getUserInfo(state, { profileId: user });
    dispatch(
      createAnnouncementSucceded({
        user: { id: user, avatar: userInfo.avatar, name: userInfo.name },
        group,
        text,
        created_at: new Date().toString(),
      })
    );
    return data;
  } catch (e) {
    dispatch(createAnnouncementFailed(e));
    return e;
  }
};

export const createPost = ({ user, group, title, text, isDraft }) => async (
  dispatch,
  getState
) => {
  dispatch(createPostStarted());
  try {
    const data = await GroupsService.createPost({
      user,
      group,
      title,
      text,
      isDraft,
    });
    const state = getState();
    const userInfo = getUserInfo(state, { profileId: user });
    if (isDraft) {
      dispatch(
        createDraftPostSucceeded({
          ...data,
          user: { id: user, avatar: userInfo.avatar, name: userInfo.name },
        })
      );
    } else {
      dispatch(
        createPostSucceeded({
          ...data,
          user: { id: user, avatar: userInfo.avatar, name: userInfo.name },
        })
      );
    }
    return data;
  } catch (e) {
    dispatch(createPostFailed(e));
    return e;
  }
};

export const editPost = ({
  postId,
  user,
  group,
  title,
  text,
  isDraft,
}) => async (dispatch) => {
  dispatch(editPostStarted());
  try {
    const data = await GroupsService.editPost({
      postId,
      user,
      group,
      title,
      text,
      isDraft,
    });
    if (isDraft) {
      dispatch(
        editDraftPostSucceeded({
          ...data,
        })
      );
    } else {
      dispatch(
        editPostSucceeded({
          ...data,
        })
      );
    }
    return data;
  } catch (e) {
    dispatch(editPostFailed(e));
    return e;
  }
};

export const deletePost = ({ postId, user, group, isDraft }) => async (
  dispatch
) => {
  dispatch(deletePostStarted());
  try {
    await GroupsService.deletePost({ postId, group });

    if (isDraft) {
      dispatch(deleteDraftPostSucceeded({ postId }));
    } else {
      dispatch(deletePostSucceeded({ postId }));
    }
  } catch (e) {
    console.log(e);
    dispatch(deletePostFailed(e));
    return e;
  }
};

export const pinPost = ({ postId, groupId, checked, order }) => async (
  dispatch
) => {
  dispatch(pinPostStarted());
  try {
    await GroupsService.pinPost({ postId, groupId });
    dispatch(pinPostSucceeded({ postId }));
    dispatch(fetchPosts(groupId, undefined, checked, order));
  } catch (e) {
    dispatch(pinPostFailed(e));
    return e;
  }
};

export const createGroup = makeFetchAction({
  actionGroup: 'CATEGORIES',
  action: 'CREATE_GROUP',
  fetchData: GroupsService.createGroup,
  onSucceedPayload: (args, data) => data,
});

export function changeGroupsOrder(order) {
  return (dispatch) => {
    dispatch(changeOrderSuccess({ order }));
  };
}

export function changeGroupsSearch(search) {
  return (dispatch) => {
    dispatch(changeSearchSuccess({ search }));
  };
}

export function changeGroupsFilter(filter) {
  return (dispatch) => {
    dispatch(changeFilterSuccess({ filter }));
  };
}

export const inviteUserToGroup = makeFetchAction({
  actionGroup: 'INVITATION',
  action: 'INVITE_USER_TO_GROUP',
  fetchData: GroupsService.inviteUser,
});

export const acceptInvitation = makeFetchAction({
  actionGroup: 'INVITATION',
  action: 'ACCEPT_GROUP_INVITATION',
  fetchData: GroupsService.acceptInvitation,
  onSucceedPayload: (args, data) => ({ key: args[1], ...data }),
});

export const rejectInvitation = makeFetchAction({
  actionGroup: 'INVITATION',
  action: 'REJECT_GROUP_INVITATION',
  fetchData: GroupsService.rejectInvitation,
  onSucceedPayload: (args, data) => ({ key: args[1], ...data }),
});

export const fetchGroupAdmins = makeFetchAction({
  actionGroup: 'ADMINS',
  action: 'FETCH_GROUP_ADMINS',
  fetchData: GroupsService.getAdmins,
});

export const fetchGroupTemplates = makeFetchAction({
  actionGroup: 'GROUP',
  action: 'FETCH_GROUP_TEMPLATES',
  fetchData: GroupsService.getTemplates,
});
export const contactAdmin = makeFetchAction({
  actionGroup: 'ADMINS',
  action: 'CONTACT_GROUP_ADMIN',
  fetchData: GroupsService.contactAdmin,
  onSucceedPayload(args, res) {
    return res;
  },
  async onSucceedHandler(args, res, dispatch) {
    await dispatch(fetchThreads());
    return res;
  },
});

export function contactMember({ userId, groupId }) {
  return async (dispatch) => {
    dispatch(contactMemberStarted());
    try {
      const data = await GroupsService.contactMember({ userId, groupId });
      await dispatch(fetchThreads());
      dispatch(contactMemberSucceeded(data));
      return data;
    } catch (e) {
      dispatch(joinGroupFailed(e));
      throw e;
    }
  };
}
