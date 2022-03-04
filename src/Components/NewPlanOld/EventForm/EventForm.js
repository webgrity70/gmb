/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useContext } from 'react';
import isEmpty from 'lodash/isEmpty';
import moment from 'moment';
import withSizes from 'react-sizes';
import PropTypes from 'prop-types';
import get from 'lodash/get';
import cx from 'classnames';
import { Checkbox, Input, Button, Icon, Popup } from 'semantic-ui-react';
import BEMHelper from 'react-bem-helper';
import { Formik } from 'formik';
import {
  EventValidationSchema,
  momentDate,
  getSlug,
  parseDurationToMinutes,
  parseMinutesToDuration,
} from '../utils';
import Duration from '../Duration';
import Place from '../Place';
import Time from '../Time';
import { EventTemplates } from '../TemplatesTrigger';
import { BehaviorsWHOC as Behaviors } from '../Behaviors';
import DatePicker from '../DatePicker';

import './EventForm.scss';
import PlanContext from '../../Plan/PlanContext';
import MDEEditor from '../../Elements/MDEditor/MdeEditor';

const bem = BEMHelper({ name: 'EventForm', outputIsString: true });

const EventForm = ({ profileId, isMobile, onSubmit, loading }) => {
  const { timeFormat } = useContext(PlanContext);
  return (
    <Formik
      enableReinitialize
      validationSchema={EventValidationSchema}
      initialValues={{
        habit: {},
        time: null,
        createTemplate: false,
        templateName: '',
        specifics: '',
        place: '',
        sessionDuration: '',
      }}
      onSubmit={(values, { setSubmitting }) => {
        setSubmitting(false);
        const [hour, minute] = values.time.split(':');
        const fullDate = values.date.set({ hour, minute });
        const data = {
          createTemplate: values.createTemplate,
          date: moment.utc(fullDate).format(),
          place: values.place,
          habit: values.habit.habit,
          category: values.habit.category,
          duration: parseDurationToMinutes(values.sessionDuration),
          ...(!!values.specifics && { specifics: values.specifics }),
          ...(!!values.templateName && { templateName: values.templateName }),
        };
        onSubmit(data);
      }}
    >
      {(form) => {
        function onChangeHabit(habit) {
          form.setFieldValue('habit', !isEmpty(habit) ? habit : {});
          if (isEmpty(habit)) form.setFieldValue('openSpecifics', false);
        }
        function onChangeTime(value) {
          form.setFieldValue('time', value);
        }
        function onChangePlace(_, { value }) {
          form.setFieldValue('place', value);
        }
        function onChangeSpecifics(value) {
          form.setFieldValue('specifics', value);
        }
        function onChangeSaveTemplate() {
          form.setFieldValue('createTemplate', !form.values.createTemplate);
        }
        function onChangeDate(date) {
          form.setFieldValue('date', date);
        }
        function onChangeSessionDurantion(_, { value }) {
          form.setFieldValue('sessionDuration', value);
        }
        function onChangeTemplateName(_, { value }) {
          form.setFieldValue('templateName', value);
        }
        function onSelectTemplate(request) {
          form.setFieldValue('specifics', request.specifics);
          form.setFieldValue('place', request.place);
          form.setFieldValue('time', momentDate(request.date).format('HH:mm'));
          form.setFieldValue(
            'sessionDuration',
            parseMinutesToDuration(request.duration)
          );
          form.setFieldValue('habit', {
            habit: request.habit,
            text: request.habit,
            value: request.habit,
            category: request.category,
            slug: getSlug(request.category),
          });
        }
        function openSpecifics() {
          form.setFieldValue('openSpecifics', true);
        }
        function openNotifications() {
          window.open(
            `${window.location.origin}/settings/notifications?section=calendar`,
            'sharer',
            'toolbar=0,status=0,width=800,height=500'
          );
        }
        function openFullScreen(ref) {
          if (isMobile && ref && !form.values.specifics)
            ref.toolbarElements.fullScreen.click();
        }
        function renderEditor() {
          return (
            !!get(form.values.habit, 'value', null) && (
              <div className={bem('mde-editor')}>
                {form.values.openSpecifics ? (
                  <MDEEditor
                    value={form.values.specifics}
                    onChange={onChangeSpecifics}
                    getInstance={openFullScreen}
                    placeholder={`What specifically do you intend to do

ex. 2 miles at a 7 minute pace, pgs 12-30 of Behavioral Psychology?
                    `}
                  />
                ) : (
                  <a onClick={() => openSpecifics()}>Add event specifics +</a>
                )}
              </div>
            )
          );
        }
        return (
          <div className={bem()}>
            <div className={cx('flex flex-wrap', bem('header'))}>
              <div>
                <EventTemplates onSelect={onSelectTemplate} />
                <div className={bem('date-title')}>
                  <h1>Date</h1>
                </div>
                <DatePicker
                  onChange={onChangeDate}
                  value={form.values.date}
                  error={!!form.errors.date}
                />
              </div>
              <div className={cx('flex flex-wrap', bem('fields'))}>
                <Behaviors
                  onChangeHabit={onChangeHabit}
                  values={{
                    habit: form.values.habit,
                  }}
                  profileId={profileId}
                  errors={{
                    habit: !!form.errors.habit,
                  }}
                />
                {isMobile && renderEditor()}
                <Time
                  onChange={onChangeTime}
                  value={form.values.time}
                  error={!!form.errors.time}
                  timeFormat={timeFormat}
                />
                <Place
                  onChange={onChangePlace}
                  value={form.values.place}
                  error={!!form.errors.place}
                />
                <Duration
                  onChange={onChangeSessionDurantion}
                  values={{
                    duration: form.values.sessionDuration,
                  }}
                  errors={{
                    duration: !!form.errors.sessionDuration,
                  }}
                />
                {!isMobile && renderEditor()}
              </div>
            </div>
            <div className={cx('flex justify-between', bem('save-container'))}>
              <div className={cx('flex flex-wrap', bem('template'))}>
                <Checkbox
                  checked={form.values.createTemplate}
                  onChange={onChangeSaveTemplate}
                  label="Save Event as a Template"
                />
                <div className="flex flex-col">
                  <Input
                    name="templateName"
                    placeholder="Lose 5 pounds in three weeks"
                    onChange={onChangeTemplateName}
                    value={form.values.templateName}
                    error={form.errors.templateName && form.dirty}
                  />
                  <span>Template Name</span>
                </div>
              </div>
              <div className="flex flex-col items-end flex-1">
                <Button
                  color="orange"
                  type="submit"
                  loading={loading}
                  disabled={!form.isValid || loading}
                  onClick={form.submitForm}
                >
                  <Icon name="add circle" />
                  Add Event
                </Button>
                <div className={bem('save')}>
                  <a onClick={openNotifications}>Set your confirmation time</a>
                  <Popup
                    trigger={<i className="far fa-question-circle mb-2" />}
                    on="click"
                    hoverable
                    inverted
                  >
                    Select when to receive a confirmation for this behavior.
                    <a
                      className="more-popup"
                      href="http://help.getmotivatedbuddies.com/en/articles/3207913-confirmations"
                      rel="noopener noreferrer"
                      target="_blank"
                    >
                      more
                    </a>
                  </Popup>
                </div>
              </div>
            </div>
          </div>
        );
      }}
    </Formik>
  );
};

EventForm.propTypes = {
  onSubmit: PropTypes.func,
  loading: PropTypes.bool,
  profileId: PropTypes.number,
  isMobile: PropTypes.bool,
};

export default withSizes(({ width }) => ({
  isMobile: width < 768,
}))(EventForm);
