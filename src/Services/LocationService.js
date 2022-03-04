import { API_URI } from '../settings';
import { isLocalhost } from '../registerServiceWorker';

export default {
  async queryPlaceAPI(q) {
    const response = await fetch(
      `${API_URI}places/?q=${q}${isLocalhost ? '&sample' : ''}`
    );
    if (response.status === 200) return response.json();
    throw await response.json();
  },
};
