import React, { useEffect, useContext } from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import isEmpty from 'lodash/isEmpty';
import moment from 'moment';
import { reduxForm, change } from 'redux-form';
import BEMHelper from 'react-bem-helper';
import PropTypes from 'prop-types';
import { Container } from 'semantic-ui-react';
import { Remarkable } from 'remarkable';
import { linkify } from 'remarkable/linkify';
import convertMeridiem from '../../../utils/convertMeridiem';
import {
  getTimeFromMinutes,
  getSlug,
  parseDurationToMinutes,
} from '../../NewPlan/utils';
import ChallengeCreation from '../../Challenges/ChallengeCreation';
import { formName } from '../../Challenges/ChallengeCreation/utils';
import { validate, initialValues } from '../NewChallengePage/utils';
import PlanContext from '../../Plan/PlanContext';
import * as planActions from '../../../Actions/actions_plan';
import * as challengeActions from '../../../Actions/actions_challenges';
import history from '../../../history';
import {
  getDeleteChallengeLoading,
  getCreateChallengeLoading,
} from '../../../selectors/requests';
import { getChallengeDetails } from '../../../selectors/challenges';
import './EditChallengePage.scss';
import indexesToPrompts from '../../../utils/indexesToPrompts';

const toMarkdown = require('to-markdown');

const bem = BEMHelper({ name: 'EditChallengePage', outputIsString: true });
const md = new Remarkable({ linkTarget: '_blank' }).use(linkify);

function EditChallengePage({
  id,
  user,
  challenge,
  deletePlan,
  deleteTemplate,
  fetchChallenge,
  deleteChallenge,
  changeFormValue,
  ...props
}) {
  const { timeFormat } = useContext(PlanContext);
  useEffect(() => {
    fetchChallenge(id, true);
  }, [fetchChallenge, id]);
  useEffect(() => {
    if (challenge && challenge.events) {
      const managerId = challenge.challengeManager
        ? challenge.challengeManager.id
        : null;
      if (managerId !== user.pk || challenge.participants > 1)
        history.push('/challenges');
      else {
        const isAdvancedActive =
          challenge.canChangeTime === '24h' ||
          challenge.canChangeDetails ||
          challenge.canChangeDuration ||
          challenge.canChangeLocation;
        changeFormValue(formName, 'name', challenge.name);
        changeFormValue(
          formName,
          'mustJoinBeforeStart',
          challenge.mustJoinBeforeStart
        );
        changeFormValue(formName, 'website', challenge.website);
        changeFormValue(formName, 'description', challenge.description);
        changeFormValue(formName, 'type', challenge.type === 'Consecutive');
        changeFormValue(
          formName,
          'intervalType',
          challenge.intervalType === 'Consecutive'
        );
        changeFormValue(formName, 'intensity', challenge.intensity);
        changeFormValue(formName, 'languages', challenge.languages);
        changeFormValue(formName, 'advanced', {
          time: challenge.canChangeTime === '24h',
          duration: challenge.canChangeDuration,
          location: challenge.canChangeLocation,
          specifics: challenge.canChangeDetails,
          active: isAdvancedActive,
          // activeTime: challenge.canChangeTime !== 'no',
        });
        changeFormValue(
          formName,
          'timezoneRestriction',
          challenge.timezoneRestriction
        );
        changeFormValue(formName, 'location', {
          formattedAddress: challenge.location,
          placeId: challenge.locationID,
        });

        const events = challenge.events.sort(
          (a, b) => new Date(a.date) - new Date(b.date)
        );
        if (events.length > 0) {
          changeFormValue(formName, 'date', {
            startDate: moment(events[0].date),
            endDate: moment(events[events.length - 1].date),
          });
        }
        events.forEach((event) => {
          const dateObj = new Date(event.date);
          const date = moment(dateObj);
          const [mHours, mMinutes, mFormat] = date
            .clone()
            .format(timeFormat)
            .replace(/\s/, ':')
            .split(/:/);
          const { hours: dHours, minutes: dMinutes } = getTimeFromMinutes(
            event.duration
          );
          const eventData = {
            habit: {
              category: event.category,
              habit: event.habit,
              slug: getSlug(event.category),
              value: event.habitID,
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
            location: event.place,
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
          const key = `events.${event.habitID}/${dayUnix}`;
          changeFormValue(formName, key, eventData);
        });
      }
    }
  }, [challenge]);
  if (!challenge) return null;
  const startMomentDate = moment(challenge.startDate);
  const hasStarted = startMomentDate.clone().isBefore(moment());
  const canDelete = !hasStarted && challenge.participants === 1;

  async function onDelete() {
    if (challenge.planID) deletePlan(challenge.planID, true);
    await deleteChallenge(challenge.id);
    deleteTemplate(challenge.templateID);
  }
  return (
    <div className={bem()}>
      <Container>
        <h1 className={bem('title')}>Edit Challenge</h1>
        <ChallengeCreation
          {...props}
          editing
          {...(canDelete && { onDelete })}
        />
      </Container>
    </div>
  );
}

EditChallengePage.propTypes = {
  user: PropTypes.shape(),
  id: PropTypes.string,
  deletePlan: PropTypes.func,
  challenge: PropTypes.shape(),
  changeFormValue: PropTypes.func,
  deleteChallenge: PropTypes.func,
  deleteTemplate: PropTypes.func,
  fetchChallenge: PropTypes.func,
  loadingDelete: PropTypes.bool,
  loading: PropTypes.bool,
};

const mapStateToProps = (
  state,
  {
    match: {
      params: { id },
    },
  }
) => ({
  loading: getCreateChallengeLoading(state),
  loadingDelete: getDeleteChallengeLoading(state),
  challenge: getChallengeDetails(state, { id }),
  id,
});

export default compose(
  connect(mapStateToProps, {
    changeFormValue: change,
    deleteChallenge: challengeActions.deleteChallenge,
    deletePlan: planActions.deletePlan,
    createPlan: planActions.createPlan,
    createChallenge: challengeActions.createChallenge,
    deleteTemplate: planActions.deleteTemplate,
    fetchChallenge: challengeActions.fetchChallengeDetails,
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
        advanced,
        location,
        intensity,
        languages,
        description,
        createEvents,
        intervalType,
        mustJoinBeforeStart,
        timezoneRestriction,
      },
      dispatch,
      {
        challenge,
        createChallenge,
        createPlan,
        deletePlan,
        deleteTemplate,
        deleteChallenge,
      }
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
      if (challenge.planID) deletePlan(challenge.planID, true);
      await deleteChallenge(challenge.id, true);
      deleteTemplate(challenge.templateID, true);
      const { created } = await createPlan(data, true);
      await createChallenge(
        {
          name,
          intensity,
          privacy: 'Public',
          mustJoinBeforeStart,
          intervalType: intervalType ? 'Consecutive' : 'Flexible',
          type: type ? 'Consecutive' : 'Flexible',
          templateID: created.baseTemplate,
          startDate: parsedEvents[0].date,
          endDate: parsedEvents[eventsArr.length - 1].date,
          ...(location && { location: location.placeId }),
          ...(website && { website }),
          frequency: Math.round(Object.keys(events).length / weeks),
          languages: languages.map(({ value }) => value),
          description,
          category: [
            ...new Set(eventsArr.map(({ habit: { category } }) => category)),
          ],
        },
        true
      );
    },
  })
)(EditChallengePage);
