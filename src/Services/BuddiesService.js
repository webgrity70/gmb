import { API_URI, createRequest } from '../settings';

function accept(requestId) {
  return createRequest(`v2/buddy-requests/accept/${requestId}/`, 'POST');
}

function decline(requestId) {
  return createRequest(`v2/buddy-requests/decline/${requestId}/`, 'POST');
}

function revoke(requestId) {
  return createRequest(`v2/buddy-requests/revoke/${requestId}/`, 'POST');
}

function sendBuddyRequest(buddyID, categoryId) {
  const body = { category: categoryId };
  return createRequest(`v2/buddy-requests/send/${buddyID}/`, 'POST', body);
}

function acceptChat(requestId) {
  return createRequest(`v2/buddy-requests/chat/accept/${requestId}/`, 'POST');
}

function getById(buddyRequestId) {
  return createRequest(`v2/buddy-requests/${buddyRequestId}/`, 'GET');
}

function sendBetaInvite(buddyId, categoryId) {
  return createRequest(`v2/buddy-requests/beta-invite/${buddyId}/`, 'POST', {
    category: categoryId,
  });
}

export default {
  async getRecommendedMembers(limit) {
    const response = await fetch(
      `${API_URI}matching/recommendations/${
        limit ? `?page_size=${limit}` : ''
      }`,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('access_token')}`,
        },
      }
    );
    if (response.status === 200) return response.json();
    throw await response.json();
  },
  async getBuddies() {
    const response = await fetch(`${API_URI}user/buddies/`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('access_token')}`,
      },
    });
    if (response.status === 200) return response.json();
    throw await response.json();
  },
  async filterRecommendations(input, filters, order) {
    const response = await fetch(
      `${API_URI}v2/matching/filter/?page=${filters.page || 1}`,
      {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('access_token')}`,
        },
        body: JSON.stringify({ input, filters, order }),
      }
    );
    if (response.status === 200) return response.json();
    throw await response.json();
  },
  async changeBuddyStatus(buddyId, categoryId, status) {
    const response = await fetch(
      `${API_URI}v2/buddy-requests/change-status/${buddyId}/${categoryId}/`,
      {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('access_token')}`,
        },
        body: JSON.stringify({ status }),
      }
    );
    if (response.status === 200) return response.json();
    throw await response.json();
  },
  async cancelBuddyRequest(buddyID, categoryID) {
    const response = await fetch(
      `${API_URI}matching/buddy-requests/cancel/${buddyID}/${categoryID}/`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('access_token')}`,
        },
      }
    );
    if (response.status === 200) return response.json();
    throw await response.json();
  },
  accept,
  decline,
  revoke,
  acceptChat,
  getById,
  sendBuddyRequest,
  sendBetaInvite,
};
