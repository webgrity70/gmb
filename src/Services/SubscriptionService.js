import { API_URI } from '../settings';

export default {
  async getAndUpdateUserSubscription(userID) {
    const response = await fetch(
      `${API_URI}v2/user/information/${userID}/subscription/fetch/`,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('access_token')}`,
        },
      }
    );
    if (response.status === 200) return response.json();
    throw await response.json();
  },
  async getUserSubscription(userID) {
    const response = await fetch(
      `${API_URI}v2/user/information/${userID}/subscription/`,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('access_token')}`,
        },
      }
    );
    if (response.status === 200) return response.json();
    throw await response.json();
  },
};
