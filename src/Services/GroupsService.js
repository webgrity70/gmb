import isNil from 'lodash/isNil';
import omitBy from 'lodash/omitBy';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import { API_URI } from '../settings';
import { getSlug } from '../Components/NewPlan/utils';
import {
  createPostResponseFailed,
  createPostResponseStarted,
  createPostResponseSucceeded,
  createWelcomePostSucceeded,
  deletePostResponseFailed,
  deletePostResponseSucceeded,
  editPostResponseFailed,
  editPostResponseSucceeded,
  editPostSucceeded,
  fetchDraftPostsSucceeded,
  fetchPostResponsesSucceeded,
} from '../Actions/actions_groups';
import { getUserInfo } from '../selectors/profile';

const accessToken = () => localStorage.getItem('access_token');
export const getRequestHeaders = () => ({
  headers: {
    Authorization: `Bearer ${accessToken()}`,
    'Content-Type': 'application/json',
  },
});

const gmb = axios.create({
  baseURL: `${API_URI}v2/groups`,
  ...getRequestHeaders(),
});

const handlePageParam = (page) => (page ? `?page=${page}` : '');

export const usePostService = () => {
  const dispatch = useDispatch();
  const state = useSelector((state) => state);

  return {
    getPostDetails({ groupId, postId }) {
      return gmb
        .get(`/${groupId}/posts/${postId}/`, {
          ...getRequestHeaders(),
        })
        .then((response) => {
          const data = response.data;
          dispatch(
            editPostSucceeded({
              ...data,
            })
          );
          return data;
        })
        .catch((e) => {
          dispatch(createPostResponseFailed(e.response));
        });
    },
    getAllPostResponses({ groupId, postId, page }) {
      return gmb
        .get(`/${groupId}/posts/${postId}/responses/${handlePageParam(page)}`, {
          ...getRequestHeaders(),
        })
        .then((response) => {
          dispatch(
            fetchPostResponsesSucceeded({ postId, data: response.data })
          );
          return response.data;
        })
        .catch((e) => {
          console.log(e.response);
        });
    },

    createPostResponse({ userId, group, postId, text }) {
      const user = getUserInfo(state, { profileId: userId });
      dispatch(createPostResponseStarted());
      return gmb
        .post(
          `/${group}/posts/${postId}/responses/create/`,
          { text },
          {
            ...getRequestHeaders(),
          }
        )
        .then((response) => {
          dispatch(
            createPostResponseSucceeded({
              postId,
              data: {
                ...response.data,
                user: { id: userId, avatar: user.avatar, name: user.name },
              },
            })
          );
        })
        .catch((e) => {
          dispatch(createPostResponseFailed(e.response));
        });
    },

    async editPostResponse({ user, group, postId, responseId, text }) {
      return gmb
        .put(
          `/${group}/posts/${postId}/responses/${responseId}/edit/`,
          {
            text,
          },
          {
            ...getRequestHeaders(),
          }
        )
        .then((response) => {
          dispatch(
            editPostResponseSucceeded({ post: postId, data: response.data })
          );
        })
        .catch((e) => {
          dispatch(editPostResponseFailed(e.response));
        });
    },

    async deletePostResponse({ postId, group, responseId }) {
      gmb
        .delete(`/${group}/posts/${postId}/responses/${responseId}/delete/`, {
          ...getRequestHeaders(),
        })
        .then(() => {
          dispatch(deletePostResponseSucceeded({ postId, responseId }));
        })
        .catch(() => {
          dispatch(deletePostResponseFailed());
        });
    },

    async createWelcomePost({ groupId, welcome_post, user }) {
      gmb
        .post(
          `/${groupId}/set-welcome-post/`,
          {
            welcome_post,
            user,
          },
          {
            ...getRequestHeaders(),
          }
        )
        .then((response) => {
          dispatch(createWelcomePostSucceeded({ welcome_post }));
        });
    },

    getDraftPosts({ groupId }) {
      gmb
        .get(`/${groupId}/posts`, {
          params: {
            is_draft: true,
          },
          ...getRequestHeaders(),
        })
        .then((response) => {
          dispatch(fetchDraftPostsSucceeded(response.data));
        });
    },
  };
};

export default {
  getMembers(groupId, params, page) {
    return fetch(
      `${API_URI}v2/groups/${groupId}/members/${handlePageParam(page)}`,
      {
        method: 'POST',
        ...(params && { body: JSON.stringify(params) }),
        ...getRequestHeaders(),
      }
    );
  },
  async getTemplates(groupId) {
    const response = await fetch(
      `${API_URI}v2/templates/group/${groupId}/`,
      getRequestHeaders()
    );
    if (response.status === 200) return response.json();
    throw await response.json();
  },
  async deleteGroup(groupId) {
    const response = await fetch(`${API_URI}v2/groups/${groupId}/remove/`, {
      method: 'POST',
      ...getRequestHeaders(),
    });
    if (response.status === 200) return response.json();
    throw await response.json();
  },
  async contactAdmin({ groupId, userId }) {
    const response = await fetch(`${API_URI}v2/chat/threads/contact-admin/`, {
      method: 'POST',
      body: JSON.stringify({ user: userId, group: groupId }),
      ...getRequestHeaders(),
    });
    if (response.status === 200) return response.json();
    throw await response.json();
  },
  async contactMember({ groupId, userId }) {
    const response = await fetch(`${API_URI}v2/chat/threads/contact-member/`, {
      method: 'POST',
      body: JSON.stringify({ user: userId, group: groupId }),
      ...getRequestHeaders(),
    });
    if (response.status === 200) return response.json();
    throw await response.json();
  },
  getAnnouncements(groupId, page) {
    return fetch(
      `${API_URI}v2/groups/${groupId}/announcements/${handlePageParam(page)}`,
      getRequestHeaders()
    );
  },
  async getAllAnnouncements(groupId, page) {
    const announcementsResponse = await this.getAnnouncements(groupId, page);
    if (announcementsResponse.status === 200) {
      const data = await announcementsResponse.json();
      return data;
    }
    throw await announcementsResponse.json();
  },

  getPosts(groupId, page, userId, orderByResponses) {
    return gmb
      .get(`/${groupId}/posts/`, {
        params: {
          page,
          user_id: userId,
          ordering: orderByResponses ? '-responses' : undefined,
        },
        ...getRequestHeaders(),
      })
      .catch((e) => e.response);
  },

  async getAllPosts(groupId, page, userId, orderByResponses) {
    const postsResponse = await this.getPosts(
      groupId,
      page,
      userId,
      orderByResponses
    );
    if (postsResponse.status === 200) {
      let data = { ...postsResponse.data };
      if (data.results && data.results.length > 0) {
        data.results.sort((a, b) => {
          return a.featured && b.featured
            ? 0
            : a.featured
            ? -1
            : b.featured
            ? 1
            : 0;
        });
      }
      return await data;
    }
    throw await postsResponse.data;
  },

  async createPost({ user, group, title, text, isDraft }) {
    const response = await fetch(`${API_URI}v2/groups/${group}/posts/create/`, {
      method: 'POST',
      body: JSON.stringify({
        user,
        group,
        title,
        text,
        is_draft: isDraft,
      }),
      ...getRequestHeaders(),
    });
    if (response.status >= 200 && response.status < 300) return response.json();
    throw await response.json();
  },

  async editPost({ postId, user, group, title, text, isDraft }) {
    const response = await fetch(
      `${API_URI}v2/groups/${group}/posts/${postId}/edit/`,
      {
        method: 'PUT',
        body: JSON.stringify({
          user,
          group,
          title,
          text,
          is_draft: isDraft,
        }),
        ...getRequestHeaders(),
      }
    );
    if (response.status >= 200 && response.status < 300) return response.json();
    throw await response.json();
  },

  async deletePost({ postId, group }) {
    const response = await fetch(
      `${API_URI}v2/groups/${group}/posts/${postId}/delete/`,
      {
        method: 'DELETE',
        ...getRequestHeaders(),
      }
    );
    if (response.status >= 200 && response.status < 300) {
      return {};
    }
    throw await response.json();
  },
  async pinPost({ postId, groupId }) {
    const response = await fetch(
      `${API_URI}v2/groups/${groupId}/posts/${postId}/feature/`,
      {
        method: 'POST',
        ...getRequestHeaders(),
      }
    );
    if (response.status >= 200 && response.status < 300) {
      return {};
    }
    throw await response.json();
  },
  async changePPMStatus({ userId, groupId, condition }) {
    const type = condition ? 'accept' : 'reject';
    const response = await fetch(
      `${API_URI}v2/groups/${groupId}/requests/${userId}/${type}/`,
      {
        method: 'POST',
        ...getRequestHeaders(),
      }
    );
    if (response.status === 200) return response.json();
    throw await response.json();
  },
  async getCategories(withHabits) {
    if (withHabits) {
      const response = await fetch(
        `${API_URI}v1/activity/habits/`,
        getRequestHeaders()
      );
      if (response.status === 200) {
        const categories = await response.json();
        return categories.map((cat) => ({
          pk: cat.pk,
          name: cat.label,
          slug: getSlug(cat.label),
          options: cat.options,
        }));
      }
      throw await response.json();
    } else {
      const response = await fetch(`${API_URI}v1/activity/categories/`);
      if (response.status === 200) return response.json();
      throw await response.json();
    }
  },
  async kickMember({ groupId, userId }) {
    const response = await fetch(
      `${API_URI}v2/groups/${groupId}/members/${userId}/kick/`,
      {
        method: 'POST',
        ...getRequestHeaders(),
      }
    );
    if (response.status === 200) return response.json();
    throw await response.json();
  },
  async createAnnouncement({ user, group, text }) {
    const response = await fetch(
      `${API_URI}v2/groups/${group}/announcements/create/`,
      {
        method: 'POST',
        body: JSON.stringify({ user, group, text }),
        ...getRequestHeaders(),
      }
    );
    if (response.status >= 200 && response.status < 300) return response.json();
    throw await response.json();
  },
  async getGroups(params, page) {
    const body = {
      ...params,
      ...(params.filters && { filters: omitBy(params.filters, isNil) }),
    };
    const response = await fetch(
      `${API_URI}v2/groups/${handlePageParam(page)}`,
      {
        method: 'POST',
        ...(params && { body: JSON.stringify(body) }),
        ...getRequestHeaders(),
      }
    );
    if (response.status === 200) return response.json();
    throw await response.json();
  },
  async getLevels() {
    const response = await fetch(
      `${API_URI}v2/scoring/levels/group/`,
      getRequestHeaders()
    );
    if (response.status === 200) return response.json();
    throw await response.json();
  },
  async getAdmins(groupId) {
    const response = await fetch(
      `${API_URI}v2/groups/${groupId}/admins/`,
      getRequestHeaders()
    );
    if (response.status === 200) return response.json();
    throw await response.json();
  },
  async getOne(groupId, full) {
    const detailsResponse = await fetch(
      `${API_URI}v2/groups/${groupId}/`,
      getRequestHeaders()
    );
    if (detailsResponse.status === 200) {
      const details = await detailsResponse.json();
      if (full) {
        const extraInfo = { members: [], announcements: [] };
        const membersResponse = await this.getMembers(groupId);
        const announcementsResponse = await this.getAnnouncements(groupId);
        const postsResponse = await this.getPosts(groupId);
        if (membersResponse.status === 200) {
          const members = await membersResponse.json();
          extraInfo.members = members;
        }
        if (announcementsResponse.status === 200) {
          const announcements = await announcementsResponse.json();
          extraInfo.announcements = announcements;
        }
        if (postsResponse.status === 200) {
          extraInfo.posts = postsResponse.data;
        }
        return { ...details, ...extraInfo };
      }
      return details;
    }
    const errorResponse = await detailsResponse.json();
    const error = { ...errorResponse, status: detailsResponse.status };
    throw error;
  },
  async joinChat(groupId) {
    const options = {
      method: 'POST',
      ...getRequestHeaders(),
    };
    const response = await fetch(
      `${API_URI}v2/groups/threads/${groupId}/join/`,
      options
    );
    if (response.status === 200) return response.json();
    throw await response.json();
  },
  async join(groupId) {
    const options = {
      method: 'POST',
      ...getRequestHeaders(),
    };
    const response = await fetch(
      `${API_URI}v2/groups/${groupId}/join/`,
      options
    );
    if (response.status === 200) {
      const extraInfo = { members: [], announcements: [] };
      const membersResponse = await this.getMembers(groupId);
      const announcementsResponse = await this.getAnnouncements(groupId);
      if (membersResponse.status === 200) {
        const members = await membersResponse.json();
        extraInfo.members = members;
      }
      if (announcementsResponse.status === 200) {
        const announcements = await announcementsResponse.json();
        extraInfo.announcements = announcements.results;
      }
      return extraInfo;
    }
    throw await response.json();
  },
  async getPendingPrivateMembers(groupId, params, page) {
    const response = await fetch(
      `${API_URI}v2/groups/${groupId}/requests/${handlePageParam(page)}`,
      {
        method: 'POST',
        ...(params && { body: JSON.stringify(params) }),
        ...getRequestHeaders(),
      }
    );
    if (response.status === 200) return response.json();
    throw await response.json();
  },
  async getMembersWithParams(groupId, params, page) {
    const response = await this.getMembers(groupId, params, page);
    if (response.status === 200) return response.json();
    throw await response.json();
  },
  async createGroup(params) {
    const response = await fetch(`${API_URI}v2/groups/create/`, {
      method: 'POST',
      ...(params && { body: JSON.stringify(params) }),
      ...getRequestHeaders(),
    });
    if (response.status === 200) return response.json();
    throw await response.json();
  },
  async leaveChat({ groupId }) {
    const response = await fetch(
      `${API_URI}v2/groups/threads/${groupId}/leave/`,
      {
        method: 'POST',
        ...getRequestHeaders(),
      }
    );
    if (response.status === 200) return response.json();
    throw await response.json();
  },
  async muteChat({ groupId, muted }) {
    const casePath = muted ? 'unmute' : 'mute';
    const response = await fetch(
      `${API_URI}v2/groups/threads/${groupId}/${casePath}/`,
      {
        method: 'POST',
        ...getRequestHeaders(),
      }
    );
    if (response.status === 200) return response.json();
    throw await response.json();
  },
  async toggleGroupNotificationSetting({
    groupId,
    enabled,
    disablePath,
    enablePath,
  }) {
    const casePath = enabled ? disablePath : enablePath;
    const response = await fetch(
      `${API_URI}v2/groups/threads/${groupId}/${casePath}/`,
      {
        method: 'POST',
        ...getRequestHeaders(),
      }
    );
    if (response.status === 200) return response.json();
    throw await response.json();
  },
  async sendMessage({ groupId, message }) {
    const response = await fetch(`${API_URI}v2/groups/threads/${groupId}/`, {
      method: 'POST',
      ...getRequestHeaders(),
      body: JSON.stringify({ message }),
    });
    if (response.status === 200) return response.json();
    throw await response.json();
  },
  async inviteUser({ userId: user, groupId: group }) {
    const response = await fetch(`${API_URI}v2/groups/invites/send/`, {
      method: 'POST',
      body: JSON.stringify({ user, group }),
      ...getRequestHeaders(),
    });
    if (response.status === 200) return response.json();
    throw await response.json();
  },
  async leave(groupId) {
    const options = {
      method: 'POST',
      ...getRequestHeaders(),
    };
    const response = await fetch(
      `${API_URI}v2/groups/${groupId}/leave/`,
      options
    );
    if (response.status === 200) {
      const membersResponse = await this.getMembers(groupId);
      if (membersResponse.status === 200) {
        const members = await membersResponse.json();
        return { ...response.json(), members };
      }
      return response.json();
    }
    throw await response.json();
  },
  async acceptInvitation(id) {
    const response = await fetch(`${API_URI}v2/groups/invites/${id}/accept/`, {
      method: 'POST',
      ...getRequestHeaders(),
    });
    if (response.status === 200) return response.json();
    throw await response.json();
  },
  async rejectInvitation(id) {
    const response = await fetch(`${API_URI}v2/groups/invites/${id}/decline/`, {
      method: 'POST',
      ...getRequestHeaders(),
    });
    if (response.status === 200) return response.json();
    throw await response.json();
  },
};
