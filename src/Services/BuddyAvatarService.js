import { API_URI } from '../settings';

export default {
  async getAvatarElements() {
    const response = await fetch(`${API_URI}get_avatar_elements`);
    if (response.status === 200) return response.json();
    throw await response.json();
  },

  async saveUserAvatar(formData) {
    const response = await fetch(`${API_URI}save_user_avatar`, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('access_token')}`,
      },
      body: JSON.stringify(formData),
    });
    if (response.status === 200) return response.json();
    throw await response.json();
  },
};
