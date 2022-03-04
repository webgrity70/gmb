import React, { useEffect, useContext } from 'react';
import queryString from 'query-string';
import { compose } from 'redux';
import { reduxForm, change } from 'redux-form';
import { connect } from 'react-redux';
import isEmpty from 'lodash/isEmpty';
import moment from 'moment';
import { Remarkable } from 'remarkable';
import { linkify } from 'remarkable/linkify';
import { Container } from 'semantic-ui-react';
import BEMHelper from 'react-bem-helper';
import PropTypes from 'prop-types';
import { withPlan } from '../../HoCs';
import {
  getUpdatePlanLoading,
  getDeletePlanLoading,
} from '../../../selectors/requests';
import {
  deletePlan as deletePlanAction,
  updatePlan,
} from '../../../Actions/actions_plan';
import { validate, initialValues } from '../NewPlan/utils';
import PlanCreation from '../PlanCreation';
import { formName } from '../PlanCreation/utils';
import {
  parseDurationToMinutes,
  getTimeFromMinutes,
} from '../../NewPlan/utils';
import PlanContext from '../../Plan/PlanContext';
import convertMeridiem from '../../../utils/convertMeridiem';
import './EditPlan.scss';
import indexesToPrompts from '../../../utils/indexesToPrompts';

const toMarkdown = require('to-markdown');

const md = new Remarkable({ linkTarget: '_blank' }).use(linkify);

const bem = BEMHelper({ name: 'EditPlanPage', outputIsString: true });

function EditPlan({
  plan,
  deletePlan,
  changeFormValue,
  loading,
  loadingDelete,
  ...props
}) {
  const { timeFormat } = useContext(PlanContext);
  useEffect(() => {
    changeFormValue(formName, 'goal', plan.name);
    const events = plan.events.sort(
      (a, b) => new Date(a.startDate) - new Date(b.startDate)
    );
    if (events.length > 0) {
      changeFormValue(formName, 'date', {
        startDate: moment(events[0].startDate),
        endDate: moment(events[events.length - 1].startDate),
      });
    }
    events.forEach((event) => {
      const date = moment(new Date(event.startDate));
      const [mHours, mMinutes, mFormat] = date
        .clone()
        .format(timeFormat)
        .replace(/\s/, ':')
        .split(/:/);
      const { hours: dHours, minutes: dMinutes } = getTimeFromMinutes(
        event.sessionDuration
      );
      const eventData = {
        habit: {
          category: event.habit.category.name,
          habit: event.habit.name,
          slug: event.habit.category.slug,
          value: event.habit.id,
          description: md.render(event.specifics),
        },
        time: { minutes: mMinutes, hours: mHours, format: mFormat },
        duration: {
          hours: dHours > 0 ? String(dHours) : undefined,
          minutes: dMinutes > 0 ? String(dMinutes) : undefined,
        },
        customPrompts: {
          active: event.prompts.length > 0,
          prompts: event.prompts.length
            ? indexesToPrompts(event.prompts)
            : [''],
        },
        location: event.location,
        milestone: {
          active: !!event.milestone,
          description: event.milestone || '',
        },
        date,
      };
      const dayUnix = date
        .clone()
        .set({
          minutes: mMinutes,
          hours: convertMeridiem({ hour: mHours, format: mFormat }),
          seconds: 0,
          milliseconds: 0,
        })
        .format('X');
      const key = `events.${event.habit.id}/${dayUnix}`;
      changeFormValue(formName, key, eventData);
    });
  }, [plan]);
  function onDelete() {
    deletePlan(plan.id);
  }
  return (
    <div className={bem()}>
      <Container>
        <h1 className={bem('title')}>Edit Plan</h1>
        <PlanCreation
          {...props}
          loading={loading}
          loadingDelete={loadingDelete}
          onDelete={onDelete}
          editing
        />
      </Container>
    </div>
  );
}

const mapStateToProps = (state) => {
  const { group: groupId } = queryString.parse(state.router.location.search);
  return {
    loading: getUpdatePlanLoading(state),
    loadingDelete: getDeletePlanLoading(state),
    groupId,
  };
};

EditPlan.propTypes = {
  plan: PropTypes.shape(),
  deletePlan: PropTypes.func,
  loadingDelete: PropTypes.bool,
  loading: PropTypes.bool,
  changeFormValue: PropTypes.func,
};

export default compose(
  connect(mapStateToProps, {
    deletePlan: deletePlanAction,
    changeFormValue: change,
  }),
  withPlan({}),
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
      },
      dispatch,
      { plan, groupId }
    ) => {
      const eventsWeeks = Object.values(events).map((event) => {
        const yearWeek = `${moment(event.date).weekYear()}-${moment(
          event.date
        ).week()}`;
        return yearWeek;
      });
      const data = {
        id: plan.id,
        name: goal,
        group: groupId,
        startDate: moment.utc(date.startDate).format('YYYY-MM-DD'),
        weeks: [...new Set(eventsWeeks)].length,
        timezoneRestriction,
        createTemplate,
        globalTemplate,
        timezone,
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
              duration: parseDurationToMinutes(
                `${event.duration.hours}h ${event.duration.minutes}m`
              ),
              ...(event.milestone.active && {
                milestone: event.milestone.description,
              }),
              ...(event.templateEvent && {
                templateEvent: event.templateEvent,
              }),
              ...(!isEmpty(event.habit.description) && {
                specifics: toMarkdown(event.habit.description),
              }),
              ...(event.customPrompts.active && {
                prompts: event.customPrompts.prompts,
              }),
            };
          }),
      };
      dispatch(
        updatePlan({ ...data, eventsIds: plan.events.map(({ id }) => id) })
      );
    },
  })
)(EditPlan);
