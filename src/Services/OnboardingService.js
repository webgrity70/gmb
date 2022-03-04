import axios from 'axios';
import { API_URI } from '../settings';

const urlEncode = function (data) {
  const str = [];
  for (const p in data) {
    if (
      data.hasOwnProperty(p) &&
      !(data[p] === undefined || data[p] === null)
    ) {
      str.push(
        `${encodeURIComponent(p)}=${data[p] ? encodeURIComponent(data[p]) : ''}`
      );
    }
  }
  return str.join('&');
};
function handleBehaviours(data) {
  const weightLoss = parseFloat(data.specialBehaviours.weightLoss);
  const behaviours = Object.entries(data.behaviours)
    .filter(([, checked]) => checked)
    .map(([name]) => name);

  if (data.specialBehaviours.LoseWeight) behaviours.push('Lose Weight');

  const payload = {
    ...(data.specialBehaviours.LoseWeight && {
      lose_weight: data.weightUnit === 'lb' ? weightLoss / 2.2046 : weightLoss,
    }),
    negative_behaviours: behaviours,
  };
  return payload;
}
export default {
  async getModules() {
    const response = await fetch(`${API_URI}questionnaire/modules/`);
    if (response.status === 200) return await response.json();
  },

  async getBehaviours() {
    const response = await fetch(`${API_URI}v2/activity/behaviours/`);
    return await response.json();
  },

  async userExists(email) {
    const response = await fetch(`${API_URI}user/exists/${email.toString()}/`);
    return await response.json();
  },
  async userRegister(data) {
    const response = await fetch(`${API_URI}user/register/`, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    if (response.status === 200) return await response.json();
    throw await response.json();
  },
  async createSubscription(data) {
    const response = await fetch(`${API_URI}v2/billing/create-subscription/`, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    if (response.status === 200) return await response.json();
    throw await response.json();
  },
  async createPortalSession(billing) {
    return axios
      .post(
        `${API_URI}v2/billing/generate_portal_session/`,
        urlEncode({ customerID: billing.customerID })
      )
      .then((response) => response.data)
      .catch((err) => ({}));
  },

  async userRegisterV2(data) {
    const body = {
      ...data,
      ...(data.negative_behaviours &&
        handleBehaviours(data.negative_behaviours)),
    };
    const response = await fetch(`${API_URI}v2/user/registration/`, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });
    return await response.json();
  },
  async userVerify(confirmation_hash) {
    const response = await fetch(
      `${API_URI}user/verify/${confirmation_hash}/`,
      {
        method: 'POST',
      }
    );

    if (response.status === 200) return await response.json();
    throw await response.json();
  },
  async getHabits() {
    const response = await fetch(`${API_URI}activity/habits/`);
    if (response.status === 200) return await response.json();
    throw await response.json();
  },
  async getGenders() {
    const response = await fetch(`${API_URI}user/genders/`);
    if (response.status === 200) return await response.json();
    throw await response.json();
  },
  async getGroups(payload) {
    const response = await fetch(`${API_URI}v2/groups/registration/`, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });
    if (response.status === 200) return response.json();
    throw await response.json();
  },
};
