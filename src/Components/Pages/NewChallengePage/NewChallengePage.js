import React, { useEffect } from 'react';
import { reduxForm, change } from 'redux-form';
import { compose } from 'redux';
import { connect } from 'react-redux';
import isEmpty from 'lodash/isEmpty';
import moment from 'moment';
import BEMHelper from 'react-bem-helper';
import { Container } from 'semantic-ui-react';
import { validate, initialValues } from './utils';
import convertMeridiem from '../../../utils/convertMeridiem';
import { createPlan } from '../../../Actions/actions_plan';
import { createChallenge } from '../../../Actions/actions_challenges';
import { parseDurationToMinutes } from '../../NewPlan/utils';
import { formName } from '../../Challenges/ChallengeCreation/utils';
import ChallengeCreation from '../../Challenges/ChallengeCreation';
import { getCreateChallengeLoading } from '../../../selectors/requests';
import './NewChallengePage.scss';

const bem = BEMHelper({ name: 'NewChallengePage', outputIsString: true });
const toMarkdown = require('to-markdown');

function NewChallengePage({ changeFormValue, ...props }) {
  useEffect(() => {
    changeFormValue(formName, 'advanced', {
      active: true,
    });
  }, []);

  return (
    <div className={bem()}>
      <Container>
        <h1 className={bem('title')}>New Challenge</h1>
        <ChallengeCreation {...props} editing={false} />
      </Container>
    </div>
  );
}

export default compose(
  connect((state) => ({ loading: getCreateChallengeLoading(state) }), {
    changeFormValue: change,
  }),
  reduxForm({
    form: formName,
    initialValues,
    validate,
    onSubmit: async (
      {
        name,
        date,
        type,
        events,
        website,
        timezone,
        location,
        advanced,
        intensity,
        languages,
        description,
        createEvents,
        intervalType,
        mustJoinBeforeStart,
        timezoneRestriction,
      },
      dispatch
    ) => {
      const eventsArr = Object.values(events);
      const eventsWeeks = eventsArr.map((event) => {
        const yearWeek = `${moment(event.date).weekYear()}-${moment(
          event.date
        ).week()}`;
        return yearWeek;
      });
      const weeks = [...new Set(eventsWeeks)].length;
      const parsedEvents = eventsArr
        .filter((event) => {
          if (!event) return false;
          const fullDate = moment(new Date(event.date)).set({
            hours: convertMeridiem({
              hour: event.time.hours,
              format: event.time.format,
            }),
            minutes: event.time.minutes,
          });
          return fullDate.isAfter(moment());
        })
        .map((event) => {
          const fullDate = moment(new Date(event.date)).set({
            hours: convertMeridiem({
              hour: event.time.hours,
              format: event.time.format,
            }),
            minutes: event.time.minutes,
          });
          return {
            date: moment.utc(fullDate).format(),
            category: event.habit.category,
            habit: event.habit.habit,
            place: event.location,
            ...(!isEmpty(event.habit.description) && {
              specifics: toMarkdown(event.habit.description),
            }),
            duration: parseDurationToMinutes(
              `${event.duration.hours}h ${event.duration.minutes}m`
            ),
            ...(event.milestone.active && {
              milestone: event.milestone.description,
            }),
            ...(event.customPrompts.active && {
              prompts: event.customPrompts.prompts,
            }),
          };
        })
        .sort((a, b) => moment(a.date).diff(moment(b.date)));
      const data = {
        name,
        weeks,
        timezone,
        createEvents,
        startDate: moment.utc(date.startDate).format('YYYY-MM-DD'),
        timezoneRestriction,
        createTemplate: true,
        globalTemplate: true,
        canChangeDetails: advanced.active && advanced.specifics,
        canChangeLocation: advanced.active && advanced.location,
        canChangeDuration: advanced.active && advanced.duration,
        canChangeTime:
          advanced.time && timezoneRestriction !== 'Global' ? '24h' : 'no',
        templateName: name,
        events: parsedEvents,
      };
      const { created } = await dispatch(createPlan(data, true));
      await dispatch(
        createChallenge({
          name,
          intensity,
          privacy: 'Public',
          mustJoinBeforeStart,
          startDate: parsedEvents[0].date,
          endDate: parsedEvents[eventsArr.length - 1].date,
          intervalType: intervalType ? 'Consecutive' : 'Flexible',
          type: type ? 'Consecutive' : 'Flexible',
          templateID: created.baseTemplate,
          ...(location && { location: location.placeId }),
          ...(website && { website }),
          frequency: Math.round(Object.keys(events).length / weeks),
          languages: languages.map(({ value }) => value),
          description,
          category: [...new Set(parsedEvents.map(({ category }) => category))],
        })
      );
    },
  })
)(NewChallengePage);
