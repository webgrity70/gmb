/* eslint-disable jsx-a11y/anchor-is-valid */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import React, { useContext } from 'react';
import withSizes from 'react-sizes';
import { compose } from 'redux';
import { connect } from 'react-redux';
import get from 'lodash/get';
import { Link, withRouter } from 'react-router-dom';
import isEmpty from 'lodash/isEmpty';
import { Formik } from 'formik';
import { Container, Button, Icon } from 'semantic-ui-react';
import cx from 'classnames';
import PropTypes from 'prop-types';
import BEMHelper from 'react-bem-helper';
import PlanContext from '../../Plan/PlanContext';
import {
  deleteEvent as deleteEventAction,
  updateEvent as updateEventAction,
} from '../../../Actions/actions_plan';
import { BehaviorsWHOC as Behaviors } from '../../NewPlan/Behaviors';
import Place from '../../NewPlan/Place';
import Time from '../../NewPlan/Time';
import Duration from '../../NewPlan/Duration';
import DatePicker from '../../NewPlan/DatePicker';
import {
  EventValidationSchema,
  parseDurationToMinutes,
} from '../../NewPlan/utils';
import { withEvent } from '../../HoCs';
import MDEEditor from '../../Elements/MDEditor/MdeEditor';
import { getEventInitialValues } from './utils';
import {
  getUpdateEventLoading,
  getDeleteEventLoading,
} from '../../../selectors/requests';
import './Event.scss';

const bem = BEMHelper({ name: 'EventPage', outputIsString: true });

const Event = ({
  user,
  eventDetails,
  deleteEvent,
  updateEvent,
  isMobile,
  history,
  loading,
  loadingDelete,
}) => {
  const { timeFormat } = useContext(PlanContext);
  return (
    <div className={bem()}>
      <Container>
        <h1 className={bem('title')}>Your Plan</h1>
        <div className={bem('container')}>
          <h1>Edit a one off event</h1>
          <Link to="/plan">
            <Icon name="close" />
          </Link>
          <Formik
            enableReinitialize
            validationSchema={EventValidationSchema}
            initialValues={getEventInitialValues({ values: eventDetails })}
            onSubmit={(values, { setSubmitting }) => {
              setSubmitting(false);
              const [hour, minute] = values.time.split(':');
              const date = values.date.clone().set({ hour, minute }).format();
              const event = {
                date,
                habit: values.habit.habit,
                category: values.habit.category,
                place: values.place,
                createTemplate: false,
                id: eventDetails.id,
                duration: parseDurationToMinutes(values.sessionDuration),
                ...(!!values.specifics && { specifics: values.specifics }),
              };
              updateEvent(event);
            }}
          >
            {(form) => {
              function onChangeHabit(habit) {
                form.setFieldValue('habit', !isEmpty(habit) ? habit : {});
              }
              function onChangeTime(value) {
                form.setFieldValue('time', value);
              }
              function onChangePlace(_, { value }) {
                form.setFieldValue('place', value);
              }
              function onChangeDate(date) {
                form.setFieldValue('date', date);
              }
              function onChangeSessionDurantion(_, { value }) {
                form.setFieldValue('sessionDuration', value);
              }
              function onDeleteEvent() {
                deleteEvent(eventDetails.id);
              }
              function onChangeSpecifics(value) {
                form.setFieldValue('specifics', value);
              }
              function openSpecifics() {
                form.setFieldValue('openSpecifics', true);
              }
              function openFullScreen(ref) {
                if (isMobile && ref && !form.values.specifics) {
                  ref.toolbarElements.fullScreen.click();
                }
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
                        <a onClick={() => openSpecifics()}>
                          Add event specifics +
                        </a>
                      )}
                    </div>
                  )
                );
              }
              return (
                <div className={bem('form')}>
                  <div className={cx('flex flex-wrap', bem('form--header'))}>
                    <div>
                      <h3>Date</h3>
                      <DatePicker
                        onChange={onChangeDate}
                        value={form.values.date}
                      />
                    </div>
                    <div className={cx('flex flex-wrap', bem('fields'))}>
                      <Behaviors
                        onChangeHabit={onChangeHabit}
                        values={{
                          habit: form.values.habit,
                        }}
                        profileId={user.id}
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
                  <div
                    className={cx(
                      'flex justify-end',
                      bem('form--save-container')
                    )}
                  >
                    {eventDetails.plan && (
                      <Button
                        basic
                        color="orange"
                        disabled={loading || loadingDelete}
                        className="edit"
                        onClick={() =>
                          history.push(`/plan/${eventDetails.plan}`)
                        }
                      >
                        Edit plan
                      </Button>
                    )}
                    <Button
                      onClick={onDeleteEvent}
                      disabled={loading}
                      loading={loadingDelete}
                    >
                      <Icon name="trash" />
                      Delete
                    </Button>
                    <Button
                      color="orange"
                      disabled={
                        !isEmpty(form.errors) || loading || loadingDelete
                      }
                      loading={loading}
                      onClick={() => form.submitForm()}
                    >
                      <Icon name="add circle" />
                      Save
                    </Button>
                  </div>
                </div>
              );
            }}
          </Formik>
        </div>
      </Container>
    </div>
  );
};

Event.propTypes = {
  eventDetails: PropTypes.shape(),
  user: PropTypes.shape(),
  deleteEvent: PropTypes.func,
  history: PropTypes.shape(),
  updateEvent: PropTypes.func,
  loading: PropTypes.bool,
  loadingDelete: PropTypes.bool,
  isMobile: PropTypes.bool,
};

const mapStateToProps = (state) => ({
  loading: getUpdateEventLoading(state),
  loadingDelete: getDeleteEventLoading(state),
});

export default compose(
  withEvent({}),
  withRouter,
  withSizes(({ width }) => ({
    isMobile: width < 768,
  })),
  connect(mapStateToProps, {
    deleteEvent: deleteEventAction,
    updateEvent: updateEventAction,
  })
)(Event);
