import React from 'react';
import queryString from 'query-string';
import { Container } from 'semantic-ui-react';
import moment from 'moment';
import { compose } from 'redux';
import isEmpty from 'lodash/isEmpty';
import { connect } from 'react-redux';
import BEMHelper from 'react-bem-helper';
import { reduxForm } from 'redux-form';
import { getCreatePlanLoading } from '../../../selectors/requests';
import { createPlan } from '../../../Actions/actions_plan';
import { parseDurationToMinutes } from '../../NewPlan/utils';
import { validate, initialValues } from './utils';
import PlanCreation from '../PlanCreation';
import { formName } from '../PlanCreation/utils';
import convertMeridiem from '../../../utils/convertMeridiem';
import './NewPlan.scss';

const toMarkdown = require('to-markdown');

const bem = BEMHelper({ name: 'NewPlanPage', outputIsString: true });

function NewPlan(props) {
  return (
    <div className={bem()}>
      <Container>
        <h1 className={bem('title')}>New Plan</h1>
        <PlanCreation {...props} editing={false} />
      </Container>
    </div>
  );
}

export default compose(
  connect((state) => {
    const { group: groupId } = queryString.parse(state.router.location.search);
    return { loading: getCreatePlanLoading(state), groupId };
  }),
  reduxForm({
    form: formName,
    initialValues,
    validate,
    onSubmit: (
      {
        goal,
        events,
        date,
        timezoneRestriction,
        timezone,
        createTemplate,
        templateName,
        globalTemplate,
        baseTemplate,
      },
      dispatch,
      { groupId }
    ) => {
      const eventsWeeks = Object.values(events).map((event) => {
        const yearWeek = `${moment(event.date).weekYear()}-${moment(
          event.date
        ).week()}`;
        return yearWeek;
      });
      const data = {
        name: goal,
        group: groupId,
        startDate: moment.utc(date.startDate).format('YYYY-MM-DD'),
        weeks: [...new Set(eventsWeeks)].length,
        timezoneRestriction: createTemplate ? 'User Local Timezone' : 'Global',
        createTemplate,
        globalTemplate,
        timezone,
        ...(baseTemplate && !createTemplate && { baseTemplate }),
        ...(createTemplate && { templateName }),
        events: Object.values(events)
          .filter((e) => e)
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
              ...(event.templateEvent && {
                templateEvent: event.templateEvent,
              }),
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
          }),
      };
      dispatch(createPlan(data));
    },
  })
)(NewPlan);
