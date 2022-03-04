import omit from 'lodash/omit';
import moment from 'moment-timezone';
import { API_URI } from '../settings';
import { challengeDateStringToLocalTimezone } from '../utils/convertTimezone';
import {
  orderFetchedPrompts,
  orderPromptsToSave,
} from '../utils/promptsOrdering';
import ChallengeService from './ChallengesService';

export default {
  async getCategorySpecificHabits() {
    const response = await fetch(`${API_URI}get_category_specific_habits/`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('access_token')}`,
      },
    });
    if (response.status === 200) return response.json();
    throw await response.json();
  },
  async getEvent(id) {
    const response = await fetch(`${API_URI}v2/event/${id}/`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('access_token')}`,
      },
    });
    if (response.status === 200) {
      let data = await response.json();
      if (data && data.prompts) {
        data.prompts = orderFetchedPrompts(data.prompts);
      }
      return data;
    }
    throw await response.json();
  },
  async getUserHabit() {
    const response = await fetch(`${API_URI}user/habits/`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('access_token')}`,
      },
    });
    if (response.status === 200) return response.json();
    throw await response.json();
  },
  async getHabits() {
    const response = await fetch(`${API_URI}activity/habits/`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('access_token')}`,
      },
    });
    if (response.status === 200) return response.json();
    throw await response.json();
  },
  async getPlans(start, end) {
    const response = await fetch(
      `${API_URI}v2/plan/list/?start=${start}&end=${end}`,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('access_token')}`,
        },
      }
    );
    if (response.status === 200) {
      let data = await response.json();
      if (Array.isArray(data) && data.length > 0) {
        data.map((item) => {
          if (item.prompts) {
            item.prompts = orderFetchedPrompts(item.prompts);
          }
          if (item.start) {
            item.start = challengeDateStringToLocalTimezone({
              date: item.start,
              timezone: item.challengeTemplateTimezone,
              restriction: item.challengeTimezoneRestriction,
            });
          }
          if (item.checkInWindowEnd) {
            item.checkInWindowEnd = challengeDateStringToLocalTimezone({
              date: item.checkInWindowEnd,
              timezone: item.challengeTemplateTimezone,
              restriction: item.challengeTimezoneRestriction,
            });
          }
          return item;
        });
      }
      return data;
    }
    throw await response.json();
  },
  async getPlan(id) {
    const response = await fetch(`${API_URI}v2/plan/${id}/`, {
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
          return item;
        });
      }
      return data;
    }
    throw await response.json();
  },
  async getPlanConfiguration(eventID) {
    const response = await fetch(`${API_URI}plan/configuration/${eventID}/`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('access_token')}`,
      },
    });
    if (response.status === 200) return response.json();
    throw await response.json();
  },
  async createEvent(event) {
    if (event.prompts) {
      event.prompts = orderPromptsToSave(event.prompts);
    }
    const response = await fetch(`${API_URI}v2/event/create/`, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('access_token')}`,
      },
      body: JSON.stringify(event),
    });
    if (response.status > 200 && response.status < 300) return response.json();
    throw await response.json();
  },
  async updateEventV1(event, pk) {
    if (event.prompts) {
      event.prompts = orderPromptsToSave(event.prompts);
    }
    const response = await fetch(`${API_URI}event/update/${pk}/`, {
      method: 'PUT',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('access_token')}`,
      },
      body: JSON.stringify(event),
    });
    if (response.status > 200 && response.status < 300) return response.json();
    throw await response.json();
  },
  async updateEvent(event) {
    if (event.prompts) {
      event.prompts = orderPromptsToSave(event.prompts);
    }
    const response = await fetch(`${API_URI}v2/event/${event.id}/edit/`, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('access_token')}`,
      },
      body: JSON.stringify(event),
    });
    if (response.status > 200 && response.status < 300) return response.json();
    throw await response.json();
  },
  async updatePlan(plan) {
    if (
      plan &&
      plan.events &&
      Array.isArray(plan.events) &&
      plan.events.length > 0
    ) {
      plan.events.map((item) => {
        if (item.prompts) {
          item.prompts = orderPromptsToSave(item.prompts);
        }
        return item;
      });
    }
    const response = await fetch(`${API_URI}v2/plan/${plan.id}/edit/`, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('access_token')}`,
      },
      body: JSON.stringify(omit(plan, 'eventsIds')),
    });
    if (response.status > 200 && response.status < 300) return response.json();
    throw await response.json();
  },
  async createPlan(plan, isEdit) {
    if (
      plan &&
      plan.events &&
      Array.isArray(plan.events) &&
      plan.events.length > 0
    ) {
      plan.events.map((item) => {
        if (item.prompts) {
          item.prompts = orderPromptsToSave(item.prompts);
        }
        return item;
      });
    }
    const response = await fetch(`${API_URI}v2/plan/create/`, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('access_token')}`,
      },
      body: JSON.stringify(omit(plan, 'challenge')),
    });
    const isSuccess = response.status > 200 && response.status < 300;
    if (!isSuccess) throw await response.json();
    const planCreatedResponse = await response.json();
    if (!plan.challenge || !plan.challenge.active) return planCreatedResponse;
    const endDate = moment(plan.events[0].date).add(
      'minutes',
      plan.events[0].duration
    );
    const challeengeData = await ChallengeService.createChallenge(
      {
        templateID:
          plan.baseTemplate || planCreatedResponse.created.baseTemplate,
        name: plan.name,
        type: 'Flash',
        mustJoinBeforeStart: true,
        intervalType: 'Consecutive',
        languages: ['en'],
        description: plan.events[0].description || plan.challenge.description,
        category: [plan.events[0].category],
        privacy: 'Public',
        startDate: plan.events[0].date,
        endDate: moment.utc(endDate).format(),
        intensity: 'Easy',
        frequency: 1,
        ...(plan.challenge.address.active && {
          location: plan.challenge.address.placeId,
        }),
      },
      isEdit
    );
    return challeengeData;
  },
  async clearPlan(eventID) {
    const response = await fetch(`${API_URI}plan/clear/${eventID}/`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${localStorage.getItem('access_token')}`,
      },
    });
    if (response.status > 200 && response.status < 300) return response.json();
    throw await response.json();
  },
  async deletePlan(id, showToast, force = false) {
    const response = await fetch(
      `${API_URI}v2/plan/${id}/remove/?force=${force ? 1 : 0}`,
      {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('access_token')}`,
        },
      }
    );
    if (response.status >= 200 && response.status < 300) return response.json();
    throw await response.json();
  },
  async clearEvent(eventID) {
    const response = await fetch(`${API_URI}event/clear/${eventID}/`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${localStorage.getItem('access_token')}`,
      },
    });
    if (response.status > 200 && response.status < 300) return response.json();
    throw await response.json();
  },
  async getPlansTemplates() {
    const response = await fetch(`${API_URI}v2/templates/plan/`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('access_token')}`,
      },
    });
    if (response.status === 200) return response.json();
    throw await response.json();
  },
  async getEventsTemplates() {
    const response = await fetch(`${API_URI}v2/templates/event/`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('access_token')}`,
      },
    });
    if (response.status === 200) return response.json();
    throw await response.json();
  },
  async deleteTemplate(id) {
    const response = await fetch(`${API_URI}v2/templates/${id}/remove/`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${localStorage.getItem('access_token')}`,
      },
    });
    if (response.status === 200) return response.json();
    throw await response.json();
  },
  async updateTemplate({ id, name }) {
    const response = await fetch(`${API_URI}v2/templates/${id}/rename/`, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('access_token')}`,
      },
      body: JSON.stringify({ name }),
    });
    if (response.status === 201) return response.json();
    throw await response.json();
  },
  async getTemplate(id) {
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
  },
  async getPlanWindow() {
    const response = await fetch(`${API_URI}v2/plan/window/`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('access_token')}`,
      },
    });
    if (response.status === 200) return response.json();
    throw await response.json();
  },
  async getGlobalTemplates(body) {
    const response = await fetch(`${API_URI}v2/templates/global/`, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('access_token')}`,
      },
      body: JSON.stringify(body),
    });
    if (response.status === 200) return response.json();
    throw await response.json();
  },
};
