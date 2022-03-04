/* eslint-disable jsx-a11y/anchor-is-valid */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import React from 'react';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import moment from 'moment';
import cx from 'classnames';
import { compose } from 'redux';
import { Modal, Icon } from 'semantic-ui-react';
import { reduxForm, reset, submit } from 'redux-form';
import BEMHelper from 'react-bem-helper';
import PropTypes from 'prop-types';
import {
  DurationInput,
  TimeInput,
  TextInput,
  CustomPrompts,
  HabitInput,
  SingleDateInput,
} from '../../ReduxForm';
import FlashChallengeCheckBoxInput from '../FlashChallengeCheckBoxInput';
import {
  deleteEvent as deleteEventAction,
  updateEvent,
  createPlan,
} from '../../../Actions/actions_plan';
import {
  getUpdateEventLoading,
  getDeleteEventLoading,
} from '../../../selectors/requests';
import { validate } from './utils';
import MilestoneCheckBoxInput from '../MilestoneCheckBoxInput';
import DescriptionPrompts from '../DescriptionPrompts/DescriptionPrompts';
import { parseDurationToMinutes } from '../utils';
import convertMeridiem from '../../../utils/convertMeridiem';
import { getSinglePlanValues } from '../BehaviorModal/utils';
import './EditExistingEvent.scss';

export const formName = 'edit-existing-event';

const bem = BEMHelper({ name: 'EditExistingEventForm', outputIsString: true });

const toMarkdown = require('to-markdown');

function EditEvent({
  open,
  valid,
  submitForm,
  onClose,
  id,
  dirty,
  deleteEvent,
  planId,
  history,
}) {
  async function onDeleteEvent() {
    deleteEvent(id);
    onClose();
  }
  return (
    <Modal
      dimmer="inverted"
      open={open}
      onClose={() => onClose()}
      closeIcon
      className={bem()}
      closeOnDimmerClick={false}
      size="small"
    >
      <Modal.Content>
        <div className={bem('title')}>Edit Event</div>
        <h4 className={bem('label')}>What do you want to do?</h4>
        <HabitInput name="habit" hideDetails />
        <h4 className={bem('label')}>Event Description</h4>
        <DescriptionPrompts name="description" />
        <h4 className={bem('label')}>Date</h4>
        <SingleDateInput name="date" openDirection="up" />
        <div className="flex justify-between mt-6 flex-wrap">
          <div>
            <h4 className={bem('label')}>Time</h4>
            <TimeInput name="time" />
          </div>
          <div>
            <h4 className={bem('label')}>Duration</h4>
            <DurationInput name="duration" />
          </div>
        </div>
        <h4 className={bem('label')}>Location</h4>
        <TextInput name="location" placeholder="ex. the park" />
        <CustomPrompts name="customPrompts" className="mt-3" />
        <MilestoneCheckBoxInput
          name="milestone"
          label="Mark this date as a milestone"
        />
        <FlashChallengeCheckBoxInput
          name="challenge"
          label="Turn this to a flash challenge"
          questionMarkText="Let others join you. Making this event a flash challenge will remove it from your plan."
          className="mb-8"
        />
      </Modal.Content>
      <Modal.Actions>
        <a className="pointer" onClick={onDeleteEvent}>
          <Icon name="trash" />
          Delete
        </a>
        <div>
          <a className="pointer" onClick={onClose}>
            Cancel
          </a>
          {planId && (
            <a
              className="pointer"
              onClick={() => history.push(`/edit-plan/${planId}`)}
            >
              Edit Plan
            </a>
          )}
          <a
            className={cx('pointer', { [bem('disabled')]: !valid || !dirty })}
            {...(valid && dirty && { onClick: () => submitForm(formName) })}
          >
            Save
          </a>
        </div>
      </Modal.Actions>
    </Modal>
  );
}

EditEvent.propTypes = {
  open: PropTypes.bool,
  onClose: PropTypes.func,
  submitForm: PropTypes.func,
  valid: PropTypes.bool,
  dirty: PropTypes.bool,
  deleteEvent: PropTypes.func,
  history: PropTypes.shape(),
  id: PropTypes.number,
  planId: PropTypes.number,
};

const mapStateToProps = (state) => ({
  loading: getUpdateEventLoading(state),
  loadingDelete: getDeleteEventLoading(state),
});

export default compose(
  withRouter,
  connect(mapStateToProps, {
    submitForm: submit,
    deleteEvent: deleteEventAction,
  }),
  reduxForm({
    form: formName,
    validate,
    onSubmit: async (
      {
        date,
        time,
        habit,
        duration,
        description,
        location,
        challenge,
        milestone,
        customPrompts,
      },
      dispatch,
      { onClose, id, deleteEvent, skipAction }
    ) => {
      const fullDate = date.clone().set({
        hours: convertMeridiem({ hour: time.hours, format: time.format }),
        minutes: time.minutes,
      });
      if (challenge.active) {
        const singlePlanData = getSinglePlanValues({
          date,
          time,
          duration,
          location,
          habit,
          milestone,
          customPrompts,
          challenge,
        });
        deleteEvent(id, true);
        await dispatch(createPlan(singlePlanData));
        dispatch(reset(formName));
        onClose(true);
      } else {
        const data = {
          id,
          date: moment.utc(fullDate).format(),
          category: habit.category,
          habit: habit.habit,
          place: location,
          createTemplate: false,
          duration: parseDurationToMinutes(
            `${duration.hours}h ${duration.minutes}m`
          ),
          ...(milestone.active && {
            milestone: milestone.description,
          }),
          ...(description && { specifics: toMarkdown(description) }),
          ...(customPrompts.active && {
            prompts: customPrompts.prompts,
          }),
        };
        dispatch(updateEvent(data, skipAction));
        dispatch(reset(formName));
        onClose(true);
      }
    },
  })
)(EditEvent);
