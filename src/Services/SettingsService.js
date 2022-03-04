/* global localStorage, fetch */
import { API_URI } from '../settings';
import { TrackEvent } from './TrackEvent';

export default {
  async verifyPhoneCode(hash) {
    const response = await fetch(`${API_URI}v2/user/sms/verify/${hash}/`, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('access_token')}`,
      },
    });
    if (response.status === 200) {
      return response.json();
    }
    throw await response.json();
  },
  async sendPhoneVerificationCode() {
    const response = await fetch(`${API_URI}v2/user/sms/resend/`, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('access_token')}`,
      },
    });
    if (response.status === 200) {
      return response.json();
    }
    throw await response.json();
  },
  async saveSettings(settings) {
    const response = await fetch(`${API_URI}user/settings/save/`, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('access_token')}`,
      },
      body: JSON.stringify(settings, (k, v) => (v === undefined ? null : v)),
    });
    if (response.status === 200) {
      TrackEvent('settings-account-saved', settings);
      return response.json();
    }
    throw await response.json();
  },
  async passwordChange(currentPassword, newPassword) {
    const response = await fetch(`${API_URI}user/settings/password-change/`, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('access_token')}`,
      },
      body: JSON.stringify({ currentPassword, newPassword }),
    });
    if (response.status === 200) return response.json();
    throw await response.json();
  },
  async updateNotifications(options) {
    const response = await fetch(`${API_URI}user/settings/notifications/`, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('access_token')}`,
      },
      body: JSON.stringify({ options }),
    });
    if (response.status === 200) {
      TrackEvent('settings-notification-saved', options);
      return response.json();
    }
    throw await response.json();
  },
  async getNotificationSettings() {
    const response = await fetch(`${API_URI}user/settings/notifications/`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('access_token')}`,
      },
    });
    if (response.status === 200) return response.json();
    throw await response.json();
  },
  async getPrivacySettings() {
    const response = await fetch(`${API_URI}user/settings/privacy/`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('access_token')}`,
      },
    });
    if (response.status === 200) return response.json();
    throw await response.json();
  },
  async updatePrivacySettings(options, profileVisibility) {
    const response = await fetch(`${API_URI}user/settings/privacy/`, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('access_token')}`,
      },
      body: JSON.stringify({ options, profileVisibility }),
    });
    if (response.status === 200) return response.json();
    throw await response.json();
  },
  async loginHistory() {
    const response = await fetch(`${API_URI}user/settings/login-history/`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('access_token')}`,
      },
    });
    if (response.status === 200) return response.json();
    throw await response.json();
  },
  async putOnHold(dateFrom, dateUntil) {
    const response = await fetch(`${API_URI}user/settings/put-on-hold/`, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('access_token')}`,
      },
      body: JSON.stringify({ dateFrom, dateUntil }),
    });
    if (response.status === 200) return response.json();
    throw await response.json();
  },
  async removeAccount(password) {
    const response = await fetch(`${API_URI}user/settings/remove-account/`, {
      method: 'DELETE',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('access_token')}`,
      },
      body: JSON.stringify({ password }),
    });
    if (response.status === 204) return true;
    throw await response.json();
  },
};
