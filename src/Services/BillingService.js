import { API_URI } from '../settings';

export default {
  /* async getPlans() {
    const response = await fetch(`${API_URI}v2/billing/plans/`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('access_token')}`,
      },
    });
    if (response.status === 200) return response.json();
    throw await response.json();
  }, */
  async createHostedCheckout(planName) {
    const response = await fetch(
      `${API_URI}v2/billing/create-hosted-checkout/`,
      {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('access_token')}`,
        },
        body: JSON.stringify({ planName }),
      }
    );
    if (response.status === 200) return response.json();
    throw await response.json();
  },
  async generatePortalSession(customerID) {
    const response = await fetch(
      `${API_URI}v2/billing/generate-portal-session/`,
      {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('access_token')}`,
        },
        body: JSON.stringify({ customerID }),
      }
    );
    if (response.status === 200) return response.json();
    throw await response.json();
  },
};
