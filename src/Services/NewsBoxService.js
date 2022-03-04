import axios from 'axios';
import { API_URI } from '../settings';

export default {
  async getNewsPage(limit, page) {
    const response = await fetch(
      `${API_URI}v2/newsbox/${page}/${limit ? `?page_size=${limit}` : ''}`,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('access_token')}`,
        },
      }
    );
    if (response.status === 200) return response.json();
    throw await response.json();
  },
  async getNewsPageContinuation(url) {
    const response = await fetch(`${url}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('access_token')}`,
      },
    });
    if (response.status === 200) return response.json();
    throw await response.json();
  },
  async sendShoutOut(data) {
    const response = await fetch(`${API_URI}v2/newsbox/shout-outs/create/`, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('access_token')}`,
      },
      body: JSON.stringify(data),
    });
    if (response.status === 201) return response.json();
    throw await response.json();
  },
  async sendQuote(data) {
    const formData = new FormData();

    Object.keys(data).map((item) => formData.set(item, data[item]));

    return axios(`${API_URI}v2/newsbox/quotes/`, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'multipart/form-data',
        Authorization: `Bearer ${localStorage.getItem('access_token')}`,
      },
      data: formData,
    })
      .then((resp) => {
        if (resp.status === 201) {
          return resp.data;
        }
        throw resp;
      })
      .catch((err) => {
        throw err;
      });
  },
};
