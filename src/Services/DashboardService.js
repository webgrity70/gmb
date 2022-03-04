import { API_URI } from '../settings';
import { challengeDateStringToLocalTimezone } from '../utils/convertTimezone';
import { orderFetchedPrompts } from '../utils/promptsOrdering';

async function getEventPrompts(id) {
  const response = await fetch(`${API_URI}v2/prompts/event/${id}/`, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem('access_token')}`,
    },
  });
  if (response.status === 200) {
    const data = await response.json();
    let prompts = orderFetchedPrompts(data);
    return prompts;
  }
  throw await response.json();
}

export default {
  async getPlansForDashboard(id) {
    const response = await fetch(`${API_URI}dashboard/plans/`, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('access_token')}`,
      },
      body: JSON.stringify({ event_id: id }),
    });
    if (response.status === 200) {
      const plans = await response.json();
      const prompts = await Promise.all(
        plans.map(({ pk }) => getEventPrompts(pk))
      );
      return plans.map((plan, index) => ({
        ...plan,
        prompts: prompts[index],
      }));
    }
    throw await response.json();
  },
  async trackMilestone(eventId, done) {
    const response = await fetch(`${API_URI}v2/event/${eventId}/on-track/`, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('access_token')}`,
      },
      body: JSON.stringify({ onTrack: done }),
    });
    if (response.status === 200) return response.json();
    throw await response.json();
  },
  async answerPrompt(eventId, prompt) {
    const response = await fetch(
      `${API_URI}v2/prompts/event/${eventId}/answer/${prompt.id}/`,
      {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('access_token')}`,
        },
        body: JSON.stringify({ promptValue: prompt.promptValue }),
      }
    );
    if (response.status === 200)
      return { statusCode: response.status, ...(await response.json()) };
    const error = { statusCode: response.status, ...(await response.json()) };
    throw error;
  },
  async answerPrompts(eventId, prompts) {
    const requests = prompts.map(({ id, promptValue }) =>
      this.answerPrompt(eventId, { id, promptValue })
    );
    const responses = await Promise.all(requests);
    if (responses.every(({ statusCode }) => statusCode === 200)) {
      return { statusCode: 200, responses };
    }
    const error = { statusCode: 400, responses };
    throw error;
  },
  async CheckInEvent(eventID, note, progress, prompts, canCheckIn) {
    const response = await fetch(`${API_URI}dashboard/check-in/${eventID}/`, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('access_token')}`,
      },
      body: JSON.stringify({
        note,
        progress,
        can_check_in: canCheckIn ? 1 : 0,
      }),
    });
    if (response.status === 200) {
      if (prompts.length) {
        const { statusCode, responses } = await this.answerPrompts(
          eventID,
          prompts.filter((e) => e.promptValue)
        );
        if (statusCode === 200) return response.json();
        throw responses;
      } else {
        return response.json();
      }
    }
    throw await response.json();
  },
  async CheckReadyEvent(eventID, note, ready) {
    const response = await fetch(
      `${API_URI}dashboard/check-ready/${eventID}/`,
      {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('access_token')}`,
        },
        body: JSON.stringify({ note, ready }),
      }
    );
    if (response.status === 200) return response.json();
    throw await response.json();
  },
  async getProgress(id = '') {
    const response = await fetch(`${API_URI}v2/activity/progress/${id}/`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('access_token')}`,
      },
    });
    if (response.status === 200) return response.json();
    throw await response.json();
  },
  async getPlansForDashboardV2(id) {
    const response = await fetch(`${API_URI}v1/dashboard/plans/`, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('access_token')}`,
      },
      body: JSON.stringify({ event_id: id }),
    });
    if (response.status === 200) {
      const plans = await response.json();
      plans.forEach((event) => {
        if (event.start_date) {
          event.start_date = challengeDateStringToLocalTimezone({
            date: event.start_date,
            timezone: event.challenge_template_timezone,
            restriction: event.challenge_timezone_restriction,
          });
        }
        if (event.end_date) {
          event.end_date = challengeDateStringToLocalTimezone({
            date: event.end_date,
            timezone: event.challenge_template_timezone,
            restriction: event.challenge_timezone_restriction,
          });
        }
      });
      const prompts = await Promise.all(
        plans.map(({ pk }) => getEventPrompts(pk))
      );
      return plans.map((plan, index) => ({
        ...plan,
        prompts: prompts[index],
      }));
    }
    throw await response.json();
  },
};
