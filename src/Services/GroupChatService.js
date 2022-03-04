import { API_URI } from '../settings';
import { authenticatedGet } from '../utils/fetch';

export default {
  async getThreadMessages(groupId) {
    return authenticatedGet(
      `${API_URI}v2/groups/threads/${groupId}/?page_size=10`
    );
  },
};
