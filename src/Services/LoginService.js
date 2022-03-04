import { API_URI, BASE_URI, CLIENT_ID, CLIENT_SECRET } from '../settings';

export default {
  async getSocialIDs() {
    const response = await fetch(`${API_URI}socials/`);
    if (response.status === 200) return response.json();
    throw await response.json;
  },
  async verifyHash(hash) {
    const response = await fetch(`${API_URI}user/beta-registration/check/`, {
      method: 'POST',
      headers: { 'Content-type': 'application/json' },
      body: JSON.stringify({ hash }),
    });
    if (response.status === 200) return response.json();
    throw await response.json();
  },
  async convertToken(backend, token, create = false) {
    const tokenToConvert = {
      grant_type: 'convert_token',
      client_id: CLIENT_ID,
      client_secret: CLIENT_SECRET,
      backend,
      token,
      register: create,
    };
    const response = await fetch(`${BASE_URI}auth/convert-token/`, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(tokenToConvert),
    });
    if (response.status === 200) return response.json();
    throw await response.json();
  },
  async sendPasswordReset(email) {
    const response = await fetch(`${API_URI}user/password-reset/`, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email }),
    });
    if (response.status === 200) return response.json();
    throw await response.json();
  },
  async resetPassword(hash, password) {
    const response = await fetch(`${API_URI}user/password-reset/complete/`, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ password, hash }),
    });
    if (response.status === 200) return response.json();
    throw await response.json();
  },

  async login(email, password) {
    const formData = {
      grant_type: 'password',
      client_id: CLIENT_ID,
      client_secret: CLIENT_SECRET,
      username: email,
      password,
    };
    const response = await fetch(`${BASE_URI}auth/token/`, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formData),
    });
    if (response.status === 200) return response.json();
    throw await response.json();
  },
  async refreshToken() {
    const refreshToken = localStorage.getItem('refresh_token');
    if (!refreshToken) return;
    const currentToken = {
      grant_type: 'refresh_token',
      client_id: CLIENT_ID,
      client_secret: CLIENT_SECRET,
      refresh_token: refreshToken,
    };
    const response = await fetch(`${BASE_URI}auth/token/`, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(currentToken),
    });
    if (response.status === 200) return response.json();
    throw await response.json();
  },
  async isAlive() {
    const response = await fetch(`${API_URI}status/`);
    if (response.status === 200) return true;
    throw await false;
  },
  async createBetaPassword(hash, password, tosAccepted) {
    const response = await fetch(`${API_URI}user/beta-registration/`, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ password, hash, tosAccepted }),
    });
    if (response.status === 200) return response.json();
    throw await response.json();
  },
};
