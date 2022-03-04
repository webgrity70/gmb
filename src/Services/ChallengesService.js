import moment from 'moment-timezone';
import { API_URI } from '../settings';
import {
  challengeDateStringToLocalTimezone,
  challengeLocalDateStringToTemplateTimezone,
} from '../utils/convertTimezone';
import {
  orderFetchedPrompts,
  orderPromptsToSave,
} from '../utils/promptsOrdering';

const getPlanTemplate = async (id) => {
  const response = await fetch(`${API_URI}v2/templates/${id}/`, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem('access_token')}`,
    },
  });
  if (response.status === 200) {
    let data = await response.json();
    if (
      data &&
      data.events &&
      Array.isArray(data.events) &&
      data.events.length > 0
    ) {
      data.events.map((item) => {
        if (item.prompts) {
          item.prompts = orderFetchedPrompts(item.prompts);
        }
        if (item.date) {
          item.date = challengeDateStringToLocalTimezone({
            date: item.date,
            timezone: data.timezone,
            restriction: data.timezoneRestriction,
          });
        }
        return item;
      });
    }
    return data;
  }
  throw await response.json();
};

const getRequestHeaders = () => ({
  headers: {
    Authorization: `Bearer ${localStorage.getItem('access_token')}`,
    'Content-Type': 'application/json',
  },
});

const joinChallenge = async (challengeId) => {
  const response = await fetch(`${API_URI}v2/challenges/${challengeId}/join/`, {
    method: 'POST',
    ...getRequestHeaders(),
  });
  if (response.status === 200) return response.json();
  throw await response.json();
};

export default {
  joinChallenge,

  async fetchFlashChallenges({ startDate, endDate }) {
    const response = await fetch(
      `${API_URI}v2/challenges/flash/?page_size=1000&start=${startDate
        .clone()
        .format('YYYY-MM-DD')}&end=${endDate.clone().format('YYYY-MM-DD')}`,
      {
        method: 'GET',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('access_token')}`,
        },
      }
    );
    if (response.status === 200) {
      let data = await response.json();
      if (
        data &&
        data.results &&
        Array.isArray(data.results) &&
        data.results.length > 0
      ) {
        data.results.map((result) => {
          if (result.event && result.event.prompts) {
            result.event.prompts = orderFetchedPrompts(result.event.prompts);
          }
          return result;
        });
      }
      return data;
    }
    throw await response.json();
  },

  async fetchChallengeDetails(id, withEvents = true) {
    const response = await fetch(`${API_URI}v2/challenges/${id}/`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('access_token')}`,
      },
    });
    if (response.status === 200) {
      const data = await response.json();

      if (data.startDate) {
        data.startDate = challengeDateStringToLocalTimezone({
          date: data.startDate,
          timezone: data.templateTimezone,
          restriction: data.timezoneRestriction,
        });
      }

      if (data.endDate) {
        data.endDate = challengeDateStringToLocalTimezone({
          date: data.endDate,
          timezone: data.templateTimezone,
          restriction: data.timezoneRestriction,
        });
      }

      if (!withEvents) return data;
      try {
        const { events } = await getPlanTemplate(data.templateID);
        return {
          ...data,
          events,
        };
      } catch (e) {
        throw e;
      }
    }
    throw await response.json();
  },

  async fetchChallengeCheckins(id, templateEventId) {
    const response = await fetch(
      `${API_URI}v2/challenges/${id}/events/${templateEventId}/check-ins/?page_size=150`,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('access_token')}`,
        },
      }
    );
    if (response.status === 200) {
      let data = await response.json();
      if (
        data &&
        data.results &&
        Array.isArray(data.results) &&
        data.results.length > 0
      ) {
        data.results.map((result) => {
          if (result.prompts) {
            result.prompts = orderFetchedPrompts(result.prompts);
          }
          return result;
        });
      }
      return data;
    }
    throw await response.json();
  },

  async fetchChallengeConfirmations(id, templateEventId) {
    const response = await fetch(
      `${API_URI}v2/challenges/${id}/events/${templateEventId}/confirmations/?page_size=150`,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('access_token')}`,
        },
      }
    );
    if (response.status === 200) return response.json();
    throw await response.json();
  },

  async createChallenge(challenge, isEdit) {
    const response = await fetch(`${API_URI}v2/challenges/create/`, {
      method: 'POST',
      ...getRequestHeaders(),
      body: JSON.stringify(challenge),
    });
    if (response.status === 200) {
      const data = await response.json();
      return {
        ...data,
        ...(isEdit && { message: 'Challenge has been updated.' }),
      };
    }
    throw await response.json();
  },

  async leaveChallenge(challengeId) {
    // if (justLeave) return { message: 'Successfully left Challenge.' };
    const response = await fetch(
      `${API_URI}v2/challenges/${challengeId}/leave/`,
      {
        method: 'POST',
        ...getRequestHeaders(),
      }
    );
    if (response.status === 200) return response.json();
    throw await response.json();
  },

  async createPlanJoinRegularChallenge(challenge, myUser, skipJoin) {
    const startDate = moment.utc(challenge.startDate);
    const plan = {
      name: challenge.name,
      startDate: startDate.clone().format('YYYY-MM-DD'),
      weeks: 1,
      timezone: challenge.timezone || challenge.templateTimezone,
      timezoneRestriction: challenge.timezoneRestriction,
      baseTemplate: challenge.templateID,
      createTemplate: false,
      events: challenge.events
        .filter((event) => moment(new Date(event.date)).isAfter(moment()))
        .map((event) => ({
          habit: event.habit,
          place: event.place,
          habitID: event.habitID,
          category: event.category,
          duration: event.duration,
          date: challengeLocalDateStringToTemplateTimezone({
            date: event.date,
            timezone: challenge.timezone || challenge.templateTimezone,
            restriction: challenge.timezoneRestriction,
          }),
          templateEvent: event.templateID,
          ...(event.specifics && { specifics: event.specifics }),
          ...(event.milestone && { milestone: event.milestone }),
          ...(event.prompts && {
            prompts: orderPromptsToSave(event.prompts),
          }),
        })),
    };
    const response = await fetch(`${API_URI}v2/plan/create/`, {
      method: 'POST',
      ...getRequestHeaders(),
      body: JSON.stringify(plan),
    });
    const isSuccess = response.status > 200 && response.status < 300;
    if (!isSuccess) throw await response.json();
    if (skipJoin) return Promise.resolve({});
    return joinChallenge(challenge.id);
  },

  async createPlanJoinFlashChallenge(challenge, myUser, skipJoin) {
    const date = moment.utc(challenge.date);
    const plan = {
      name: challenge.name,
      startDate: date.clone().format('YYYY-MM-DD'),
      weeks: 1,
      timezone: moment.tz.guess(),
      timezoneRestriction: 'Global',
      baseTemplate: challenge.baseTemplate,
      createTemplate: false,
      events: [
        {
          date: date.clone().format(),
          category: challenge.category,
          habit: challenge.habit,
          place: challenge.place,
          duration: challenge.duration,
          templateEvent: challenge.templateID,
          ...(challenge.milestone && {
            milestone: challenge.milestone,
          }),
          ...(challenge.specifics && { specifics: challenge.specifics }),
          ...(challenge.prompts && {
            prompts: orderPromptsToSave(challenge.prompts),
          }),
        },
      ],
    };
    const response = await fetch(`${API_URI}v2/plan/create/`, {
      method: 'POST',
      ...getRequestHeaders(),
      body: JSON.stringify(plan),
    });
    const isSuccess = response.status > 200 && response.status < 300;
    if (!isSuccess) throw await response.json();
    if (skipJoin) return Promise.resolve({});
    return joinChallenge(challenge.id);
  },

  async deleteChallenge(challengeId) {
    const response = await fetch(
      `${API_URI}v2/challenges/${challengeId}/remove/`,
      {
        method: 'POST',
        ...getRequestHeaders(),
      }
    );
    if (response.status === 200) return response.json();
    throw await response.json();
  },

  async getChallengesThreads() {
    const response = await fetch(
      `${API_URI}v2/challenges/threads/?page_size=100`,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('access_token')}`,
        },
      }
    );
    if (response.status === 200) return response.json();
    throw await response.json();
  },
  async leaveChat({ challengeId }) {
    const response = await fetch(
      `${API_URI}v2/challenges/threads/${challengeId}/leave/`,
      {
        method: 'POST',
        ...getRequestHeaders(),
      }
    );
    if (response.status === 200) return response.json();
    throw await response.json();
  },
  async muteChat({ challengeId, muted }) {
    const casePath = muted ? 'unmute' : 'mute';
    const response = await fetch(
      `${API_URI}v2/challenges/threads/${challengeId}/${casePath}/`,
      {
        method: 'POST',
        ...getRequestHeaders(),
      }
    );
    if (response.status === 200) return response.json();
    throw await response.json();
  },
  async toggleChallengeNotificationSetting({
    challengeId,
    enabled,
    disablePath,
    enablePath,
  }) {
    const casePath = enabled ? disablePath : enablePath;
    const response = await fetch(
      `${API_URI}v2/challenges/threads/${challengeId}/${casePath}/`,
      {
        method: 'POST',
        ...getRequestHeaders(),
      }
    );
    if (response.status === 200) return response.json();
    throw await response.json();
  },
  async sendMessage({ challengeId, message }) {
    const response = await fetch(
      `${API_URI}v2/challenges/threads/${challengeId}/`,
      {
        method: 'POST',
        ...getRequestHeaders(),
        body: JSON.stringify({ message }),
      }
    );
    if (response.status === 200) return response.json();
    throw await response.json();
  },
  async fetchCalendarPlan(id, start, end) {
    const response = await fetch(
      `${API_URI}v2/challenges/${id}/events/?start=${start}&end=${end}`,
      getRequestHeaders()
    );
    if (response.status === 200) {
      let data = await response.json();
      if (Array.isArray(data) && data.length > 0) {
        data.map((item) => {
          if (item.prompts) {
            item.prompts = orderFetchedPrompts(item.prompts);
          }

          if (item.userStartTime || item.templateStartTime) {
            const date = challengeDateStringToLocalTimezone({
              date: item.userStartTime || item.templateStartTime,
              timezone: item.templateTimezone,
              restriction: item.templateTimezoneRestriction,
            });
            if (item.userStartTime) {
              item.userStartTime = date;
            } else {
              item.templateStartTime = date;
            }
          }

          return item;
        });
      }
      return data;
    }
    throw await response.json();
  },
  async contactOwner({ challengeId, userId }) {
    const response = await fetch(
      `${API_URI}v2/chat/threads/contact-challenge-admin/`,
      {
        method: 'POST',
        ...getRequestHeaders(),
        body: JSON.stringify({ user: userId, challenge: challengeId }),
      }
    );
    if (response.status === 200) return response.json();
    throw await response.json();
  },
  async renameChallenge(id, name) {
    const response = await fetch(`${API_URI}v2/challenges/${id}/rename/`, {
      method: 'POST',
      ...getRequestHeaders(),
      body: JSON.stringify({ name }),
    });
    if (response.status === 200) return response.json();
    throw await response.json();
  },
  async changeLanguages(id, languages) {
    const response = await fetch(
      `${API_URI}v2/challenges/${id}/change-languages/`,
      {
        method: 'POST',
        ...getRequestHeaders(),
        body: JSON.stringify({
          languages: languages.map(({ value }) => value),
        }),
      }
    );
    if (response.status === 200) return response.json();
    throw await response.json();
  },
  async changeLocation(id, location) {
    const response = await fetch(
      `${API_URI}v2/challenges/${id}/change-location/`,
      {
        method: 'POST',
        ...getRequestHeaders(),
        body: JSON.stringify({ google_place_id: location.placeId }),
      }
    );
    if (response.status === 200) return response.json();
    throw await response.json();
  },
  async fetchMembers(challengeId) {
    const response = await fetch(
      `${API_URI}v2/challenges/${challengeId}/participants/`,
      {
        method: 'POST',
        ...getRequestHeaders(),
      }
    );
    if (response.status === 200) return response.json();
    throw await response.json();
  },
  async fetchChallenges() {
    const response = await fetch(`${API_URI}v2/challenges/`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('access_token')}`,
      },
    });
    if (response.status === 200) {
      let data = await response.json();
      if (
        data &&
        data.results &&
        Array.isArray(data.results) &&
        data.results.length > 0
      ) {
        data.results.map((result) => {
          if (result.latestEvent && result.latestEvent.prompts) {
            result.latestEvent.prompts = orderFetchedPrompts(
              result.latestEvent.prompts
            );
          }
          if (result.upcomingEvent && result.upcomingEvent.prompts) {
            result.upcomingEvent.prompts = orderFetchedPrompts(
              result.upcomingEvent.prompts
            );
          }
          return result;
        });
      }
      return data;
    }
    throw await response.json();
  },
  async acceptInvitation(id) {
    const response = await fetch(
      `${API_URI}v2/challenges/invites/${id}/accept/`,
      {
        method: 'POST',
        ...getRequestHeaders(),
      }
    );
    if (response.status === 200) return response.json();
    throw await response.json();
  },
  async rejectInvitation(id) {
    const response = await fetch(
      `${API_URI}v2/challenges/invites/${id}/decline/`,
      {
        method: 'POST',
        ...getRequestHeaders(),
      }
    );
    if (response.status === 200) return response.json();
    throw await response.json();
  },
  async getCalendarWindow(id) {
    const response = await fetch(`${API_URI}v2/challenges/${id}/window/`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('access_token')}`,
      },
    });
    if (response.status === 200) return response.json();
    throw await response.json();
  },
  async fetchChallengesForInvites() {
    const response = await fetch(
      `${API_URI}v2/challenges/invites/challenges/`,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('access_token')}`,
        },
      }
    );
    if (response.status === 200) return response.json();
    throw await response.json();
  },
  async inviteToChallenge(userId, challengeId) {
    const response = await fetch(`${API_URI}v2/challenges/invites/send/`, {
      method: 'POST',
      body: JSON.stringify({ user: userId, challenge: challengeId }),
      ...getRequestHeaders(),
    });
    if (response.status === 200) return response.json();
    throw await response.json();
  },
};
