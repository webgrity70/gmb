import queryString from 'query-string';
import { API_URI, createRequest } from '../settings';

export const getThreads = () => createRequest('v2/chat/threads/', 'GET');

export const getMessages = (threadId) =>
  createRequest(`v2/chat/threads/${threadId}/`, 'GET');

export const sendMessage = (threadId, message) =>
  createRequest(`v2/chat/threads/${threadId}/`, 'POST', { message });

export default {
  async getNotifications({ page, pageSize = 20, nType = 'buddy' } = {}) {
    const response = await fetch(
      `${API_URI}user/notifications/${nType}/?${queryString.stringify({
        page,
        page_size: pageSize,
      })}`,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('access_token')}`,
        },
      }
    );
    if (response.status === 200) return response.json();
    throw await response.json();
  },
  async getPendingBuddyRequests({ page, pageSize = 20 } = {}) {
    const response = await fetch(
      `${API_URI}v2/buddy-requests/pending/?${queryString.stringify({
        page,
        page_size: pageSize,
      })}`,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('access_token')}`,
        },
      }
    );
    if (response.status === 200) return response.json();
    throw await response.json();
  },
  async checkNew() {
    const response = await fetch(`${API_URI}v2/user/check-notifications/`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('access_token')}`,
      },
    });
    if (response.status === 200) return response.json();
    throw await response.json();
  },
  async getThreads() {
    const response = await fetch(`${API_URI}v2/chat/threads/`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('access_token')}`,
      },
    });
    if (response.status === 200) return response.json();
    throw await response.json();
  },
  async getGroupsThreads() {
    const response = await fetch(`${API_URI}v2/groups/threads/?page_size=100`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('access_token')}`,
      },
    });
    if (response.status === 200) return response.json();
    throw await response.json();
  },
  async getJoinableGroupsThreads() {
    const response = await fetch(
      `${API_URI}v2/groups/threads/can-join/?page_size=100`,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('access_token')}`,
        },
      }
    );
    if (response.status === 200) return response.json();
    throw await response.json();
  },
  async getMessages(threadId) {
    const response = await fetch(`${API_URI}v2/chat/threads/${threadId}/`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('access_token')}`,
      },
    });
    if (response.status === 200) return response.json();
    throw await response.json();
  },
  async setThreadAsRead(threadId) {
    const response = await fetch(
      `${API_URI}v2/chat/threads/${threadId}/read/`,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('access_token')}`,
        },
      }
    );
    if (response.status === 200) return response.json();
    throw await response.json();
  },
  async markGroupInvitationsSeen() {
    const response = await fetch(`${API_URI}v2/groups/invites/seen/`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('access_token')}`,
      },
    });
    if (response.status === 200) return response.json();
    throw await response.json();
  },
  async markChallengeInvitationsSeen() {
    const response = await fetch(`${API_URI}v2/challenges/invites/seen/`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('access_token')}`,
      },
    });
    if (response.status === 200) return response.json();
    throw await response.json();
  },
  async markBuddyRequestsSeen() {
    const response = await fetch(`${API_URI}v2/buddy-requests/seen/`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('access_token')}`,
      },
    });
    if (response.status === 200) return response.json();
    throw await response.json();
  },
  async leaveChat({ threadId }) {
    const response = await fetch(
      `${API_URI}v2/chat/threads/${threadId}/close/`,
      {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('access_token')}`,
        },
      }
    );
    if (response.status === 200) return response.json();
    throw await response.json();
  },
};
