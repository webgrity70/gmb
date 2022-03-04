import { API_URI, createRequest } from '../settings';

function removeCategory({ categoryId: category }) {
  return createRequest('v2/user/category/remove/', 'POST', { category });
}

function activeCategory(habit, goal, goalImportance, category) {
  return createRequest('v2/user/category/activate/', 'POST', {
    habit,
    goal,
    goalImportance,
    category,
  });
}

function updateCategory(habit, goal, goalImportance, category) {
  return createRequest('v2/user/category/update/', 'POST', {
    habit,
    goal,
    goalImportance,
    category,
  });
}

function getCategories(userId) {
  return createRequest(`v2/user/${userId}/categories/`, 'GET');
}

export default {
  async fetchApps() {
    const response = await fetch(`${API_URI}v2/apps/`);
    if (response.status === 200) return response.json();
    throw await response.json();
  },
  async fetchPsychology() {
    const response = await fetch(
      `${API_URI}v2/questionnaire/questions/psychological/`
    );
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
  async saveField(field, value) {
    const response = await fetch(`${API_URI}user/save/${field}/`, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('access_token')}`,
      },
      body: JSON.stringify({ value }),
    });
    if (response.status === 200) return response.json();
    throw await response.json();
  },
  async getCommunicationPreferences() {
    const response = await fetch(`${API_URI}user/communication-preferences/`);
    if (response.status === 200) return response.json();
    throw await response.json();
  },
  async updateCommunicationPreferences(preferences) {
    const response = await fetch(
      `${API_URI}user/communication-preferences/update/`,
      {
        method: 'PUT',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('access_token')}`,
        },
        body: JSON.stringify({
          contact_preferences: preferences.map((pref) =>
            parseInt(pref.value, 10)
          ),
        }),
      }
    );
    if (response.status === 200) return response.json();
    throw await response.json();
  },
  async getLanguages() {
    const response = await fetch(`${API_URI}user/languages/`);
    if (response.status === 200) return response.json();
    throw await response.json();
  },
  async saveLanguages(selectedLanguages) {
    const response = await fetch(`${API_URI}user/languages/update/`, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('access_token')}`,
      },
      body: JSON.stringify({ languages: selectedLanguages }),
    });
    if (response.status === 200) return response.json();
    throw await response.json();
  },
  async updateLocation(placeID) {
    const response = await fetch(`${API_URI}user/location/update/`, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('access_token')}`,
      },
      body: JSON.stringify({ place_id: placeID }),
    });
    if (response.status === 200) return response.json();
    throw await response.json();
  },
  async getApplications() {
    const response = await fetch(`${API_URI}apps/`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('access_token')}`,
      },
    });
    if (response.status === 200) return response.json();
    throw await response.json();
  },
  async getApplicationsV2() {
    const response = await fetch(`${API_URI}v2/apps/`);
    if (response.status === 200) return response.json();
    throw await response.json();
  },
  async getUserApplications(id) {
    const response = await fetch(`${API_URI}apps/${id}/`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('access_token')}`,
      },
    });
    if (response.status === 200) return response.json();
    throw await response.json();
  },
  async updateApplications(ids) {
    const response = await fetch(`${API_URI}user/apps/update/`, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('access_token')}`,
      },
      body: JSON.stringify({ applications: ids }),
    });
    if (response.status === 200) return response.json();
    throw await response.json();
  },
  async getBuddyForCategory(userID, categoryID) {
    const response = await fetch(
      `${API_URI}v2/user/category/card/${userID}/${categoryID}/`,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('access_token')}`,
        },
      }
    );
    if (response.status === 200) return response.json();
    throw await response.json();
  },
  async updateGoalImportance(habit, goal, goalImportance, newHabit) {
    const response = await fetch(`${API_URI}user/update-goal/${habit}/`, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('access_token')}`,
      },
      body: JSON.stringify({
        goal,
        goal_importance: goalImportance,
        newHabit,
      }),
    });
    if (response.status === 200) return response.json();
    throw await response.json();
  },
  async getProfile(user) {
    if (
      !localStorage.getItem('refresh_token') &&
      !localStorage.getItem('access_token')
    )
      return false;
    const response = await fetch(
      `${API_URI}user/profile/${user ? `${user}/` : ''}`,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('access_token')}`,
        },
      }
    );
    if (response.status === 200) return response.json();
    const errorDetails = await response.json();
    const error = { ...errorDetails, avoidLogout: !user };
    throw error;
  },
  async getScore() {
    const response = await fetch(`${API_URI}user/profile/score/`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('access_token')}`,
      },
    });
    if (response.status === 200) return response.json();
    throw await response.json();
  },
  async getUserCategoriesAndBuddies(userID) {
    const response = await fetch(`${API_URI}v2/user/${userID}/categories/`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('access_token')}`,
      },
    });
    if (response.status === 200) return response.json();
    throw await response.json();
  },
  async getOccupationOptions() {
    const response = await fetch(
      `${API_URI}v2/questionnaire/options/occupation/`
    );
    if (response.status === 200) return response.json();
    throw await response.json();
  },
  async getCurrentSchoolYearOptions() {
    const response = await fetch(
      `${API_URI}v2/questionnaire/options/current_school_year/`
    );
    if (response.status === 200) return response.json();
    throw await response.json();
  },
  async getEducationLevelOptions() {
    const response = await fetch(
      `${API_URI}v2/questionnaire/options/education_level/`
    );
    if (response.status === 200) return response.json();
    throw await response.json();
  },
  async getNegativeBehaviourOptions() {
    const response = await fetch(`${API_URI}v2/activity/behaviours/`);
    if (response.status === 200) return response.json();
    throw await response.json();
  },
  async getUserInformation(userID) {
    const response = await fetch(`${API_URI}v2/user/information/${userID}/`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('access_token')}`,
      },
    });
    if (response.status === 200) return response.json();
    const errorResponse = await response.json();
    const error = { ...errorResponse, status: response.status };
    throw error;
  },
  async getUserProfile(userID) {
    const response = await fetch(
      `${API_URI}user/profile/${userID ? `${userID}/` : ''}`,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('access_token')}`,
        },
      }
    );
    if (response.status === 200) return response.json();
    const errorResponse = await response.json();
    const error = { ...errorResponse, status: response.status };
    throw error;
  },
  async getUserAbout(userID) {
    const response = await fetch(
      `${API_URI}v2/user/information/${userID}/about/`,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('access_token')}`,
        },
      }
    );
    if (response.status === 200) return response.json();
    const errorResponse = await response.json();
    const error = { ...errorResponse, status: response.status };
    throw error;
  },
  async getUserApps(userID) {
    const response = await fetch(
      `${API_URI}v2/user/information/${userID}/apps/`,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('access_token')}`,
        },
      }
    );
    if (response.status === 200) return response.json();
    const errorResponse = await response.json();
    const error = { ...errorResponse, status: response.status };
    throw error;
  },
  async getUserBehaviours(userID) {
    const response = await fetch(
      `${API_URI}v2/user/information/${userID}/behaviours/`,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('access_token')}`,
        },
      }
    );
    if (response.status === 200) return response.json();
    const errorResponse = await response.json();
    const error = { ...errorResponse, status: response.status };
    throw error;
  },
  async getUserGroups(userID) {
    const response = await fetch(
      `${API_URI}v2/user/information/${userID}/groups/?page_size=100`,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('access_token')}`,
        },
      }
    );
    if (response.status === 200) return response.json();
    const errorResponse = await response.json();
    const error = { ...errorResponse, status: response.status };
    throw error;
  },
  async getMyGroups({ pageSize }) {
    const response = await fetch(
      `${API_URI}v2/user/groups/?page_size=${pageSize}`,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('access_token')}`,
        },
      }
    );
    if (response.status === 200) return response.json();
    const errorResponse = await response.json();
    const error = { ...errorResponse, status: response.status };
    throw error;
  },
  async getUserPreferences(userID) {
    const response = await fetch(
      `${API_URI}v2/user/information/${userID}/preferences/`,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('access_token')}`,
        },
      }
    );
    if (response.status === 200) return response.json();
    const errorResponse = await response.json();
    const error = { ...errorResponse, status: response.status };
    throw error;
  },
  async getUserPsychology(userID) {
    const response = await fetch(
      `${API_URI}v2/user/information/${userID}/psychology/`,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('access_token')}`,
        },
      }
    );
    if (response.status === 200) return response.json();
    const errorResponse = await response.json();
    const error = { ...errorResponse, status: response.status };
    throw error;
  },
  async updateUserPsychology(params) {
    const body = {
      psychologyPrivacy: params.privacy,
      psychology: params.psychology.map((e) => ({
        identifier: e.identifier,
        value: e.value,
      })),
    };
    const response = await fetch(`${API_URI}v2/user/update/psychology/`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${localStorage.getItem('access_token')}`,
        'Content-type': 'application/json',
      },
      body: JSON.stringify(body),
    });
    if (response.status === 200) return response.json();
    throw await response.json();
  },
  async updateUserGroups(newValues) {
    const options = {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${localStorage.getItem('access_token')}`,
        'Content-type': 'application/json',
      },
    };
    const privacy = fetch(`${API_URI}v2/user/update/groups/`, {
      ...options,
      body: JSON.stringify({ groupsPrivacy: newValues.privacy }),
    });
    const groups = newValues.groups.map(async (group) =>
      fetch(`${API_URI}v2/groups/${group.id}/leave/`, options)
    );
    const responses = await Promise.all([...groups, privacy]);
    const okResponse = responses.every((e) => e.status === 200);
    if (okResponse) return { message: 'Everything is Ok' };
    throw await Promise.all(responses.map((e) => e.json()));
  },
  async updateUserApps(params) {
    const body = {
      appsPrivacy: params.privacy,
      applications: params.apps.map((e) => e.name),
    };
    const response = await fetch(`${API_URI}v2/user/update/apps/`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${localStorage.getItem('access_token')}`,
        'Content-type': 'application/json',
      },
      body: JSON.stringify(body),
    });
    if (response.status === 200) return response.json();
    throw await response.json();
  },
  async getUserScore(userID) {
    const response = await fetch(
      `${API_URI}v2/user/information/${userID}/score/`,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('access_token')}`,
        },
      }
    );
    if (response.status === 200) return response.json();
    const errorResponse = await response.json();
    const error = { ...errorResponse, status: response.status };
    throw error;
  },
  async updateUserLanguages(languages) {
    const response = await fetch(`${API_URI}v2/user/update/languages/`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('access_token')}`,
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      method: 'POST',
      body: JSON.stringify({ languages }),
    });
    if (response.status === 200) return response.json();
    const errorResponse = await response.json();
    const error = { ...errorResponse, status: response.status };
    throw error;
  },
  async updateUserLocation(location) {
    const response = await fetch(`${API_URI}v2/user/update/location/`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('access_token')}`,
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      method: 'POST',
      body: JSON.stringify(location),
    });
    if (response.status === 200) return response.json();
    const errorResponse = await response.json();
    const error = { ...errorResponse, status: response.status };
    throw error;
  },
  async updateUserAbout(about) {
    const response = await fetch(`${API_URI}v2/user/update/about/`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('access_token')}`,
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      method: 'POST',
      body: JSON.stringify(about),
    });
    if (response.status === 200) return response.json();
    const errorResponse = await response.json();
    const error = { ...errorResponse, status: response.status };
    throw error;
  },
  async updateUserPreferences(preferences) {
    const response = await fetch(`${API_URI}v2/user/update/preferences/`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('access_token')}`,
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      method: 'POST',
      body: JSON.stringify(preferences),
    });
    if (response.status === 200) return response.json();
    const errorResponse = await response.json();
    const error = { ...errorResponse, status: response.status };
    throw error;
  },
  async updateUserOccupation(occupation) {
    const response = await fetch(`${API_URI}v2/user/update/occupation/`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('access_token')}`,
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      method: 'POST',
      body: JSON.stringify(occupation),
    });
    if (response.status === 200) return response.json();
    const errorResponse = await response.json();
    const error = { ...errorResponse, status: response.status };
    throw error;
  },
  async getUserCategories(userID) {
    const response = await fetch(`${API_URI}v2/user/${userID}/categories/`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('access_token')}`,
      },
    });
    if (response.status === 200) return response.json();
    const errorResponse = await response.json();
    const error = { ...errorResponse, status: response.status };
    throw error;
  },
  async updateUserBehaviours(behaviours) {
    const response = await fetch(`${API_URI}v2/user/update/behaviour/`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('access_token')}`,
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      method: 'POST',
      body: JSON.stringify(behaviours),
    });
    if (response.status === 200) return response.json();
    const errorResponse = await response.json();
    const error = { ...errorResponse, status: response.status };
    throw error;
  },
  async getGroupsInvites() {
    const response = await fetch(`${API_URI}v2/groups/invites/?page_size=10`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('access_token')}`,
      },
    });
    if (response.status === 200) return response.json();
    throw await response.json();
  },
  async getChallengesInvites() {
    const response = await fetch(
      `${API_URI}v2/challenges/invites/?page_size=10`,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('access_token')}`,
        },
      }
    );
    if (response.status === 200) return response.json();
    throw await response.json();
  },
  removeCategory,
  activeCategory,
  updateCategory,
  getCategories,
  async getRecentHabits() {
    const response = await fetch(`${API_URI}v2/activity/recent-habits/`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('access_token')}`,
      },
    });
    if (response.status === 200) return response.json();
    throw await response.json();
  },
  async getRecentEventTemplates() {
    const response = await fetch(`${API_URI}v2/templates/recently-used/`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('access_token')}`,
      },
    });
    if (response.status === 200) return response.json();
    throw await response.json();
  },
};
