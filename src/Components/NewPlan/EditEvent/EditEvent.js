/* eslint-disable jsx-a11y/anchor-is-valid */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import React from 'react';
import { connect } from 'react-redux';
import cx from 'classnames';
import { compose } from 'redux';
import moment from 'moment';
import { Modal, Icon } from 'semantic-ui-react';
import { reduxForm, formValueSelector, reset, submit } from 'redux-form';
import BEMHelper from 'react-bem-helper';
import PropTypes from 'prop-types';
import {
  DurationInput,
  TimeInput,
  TextInput,
  CustomPrompts,
  SingleDateInput,
} from '../../ReduxForm';
import { validate, initialValues } from './utils';
import MilestoneCheckBoxInput from '../MilestoneCheckBoxInput';
import CategoryIcon from '../../Elements/CategoriesIcons/CategoryIcon';
import { getSlug } from '../utils';
import DescriptionPrompts from '../DescriptionPrompts/DescriptionPrompts';
import './EditEvent.scss';

const formName = 'edit-event';
const bem = BEMHelper({ name: 'EditEventForm', outputIsString: true });

function EditEvent({
  open,
  valid,
  habit,
  date,
  onClose,
  eventKey,
  onDelete,
  maxEndDate,
  submitForm,
  disableDate,
  disableTime,
  disableDuration,
  disableLocation,
  disableSpecifics,
  isRegularChallenge,
}) {
  if (!open) return null;
  return (
    <Modal
      dimmer="inverted"
      open={open}
      onClose={onClose}
      closeIcon
      className={bem()}
      size="small"
      closeOnDimmerClick={false}
    >
      <Modal.Content>
        {habit && date && (
          <div className={bem('title')}>
            <CategoryIcon
              active
              name={habit.category}
              slug={getSlug(habit.category)}
            />
            {habit.habit} on {moment(new Date(date)).format('dddd, MMM D')}
          </div>
        )}
        <h4 className={bem('label')}>Event Description</h4>
        <DescriptionPrompts name="description" readOnly={disableSpecifics} />
        <h4 className={bem('label')}>Date</h4>
        <SingleDateInput
          name="date"
          minDate={moment()}
          maxDate={maxEndDate}
          openDirection="down"
          disabled={disableDate}
        />
        <div className="flex justify-between mt-6 mb-2 flex-wrap">
          <div>
            <h4 className={bem('label')}>Time</h4>
            <TimeInput name="time" disabled={disableTime} />
          </div>
          <div>
            <h4 className={bem('label')}>Duration</h4>
            <DurationInput name="duration" disabled={disableDuration} />
          </div>
        </div>
        <h4 className={bem('label')}>Location</h4>
        <TextInput
          name="location"
          placeholder="ex. the park"
          disabled={disableLocation}
        />
        {!isRegularChallenge && (
          <CustomPrompts name="customPrompts" className="mt-3" />
        )}
        {!isRegularChallenge && (
          <MilestoneCheckBoxInput
            name="milestone"
            label="Mark this date as a milestone"
            className="mb-8"
          />
        )}
      </Modal.Content>
      <Modal.Actions className={onDelete ? 'justify-between' : 'justify-end'}>
        {onDelete && (
          <a className="pointer" onClick={() => onDelete(eventKey)}>
            <Icon name="trash" />
            Delete
          </a>
        )}
        <div>
          <a className="pointer" onClick={onClose}>
            Cancel
          </a>
          <a
            className={cx('pointer', { [bem('disabled')]: !valid })}
            {...(valid && { onClick: () => submitForm(formName) })}
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
  onDelete: PropTypes.func,
  isRegularChallenge: PropTypes.oneOfType([
    PropTypes.bool,
    PropTypes.oneOf([null]),
  ]),
  disableTime: PropTypes.oneOfType([PropTypes.bool, PropTypes.oneOf([null])]),
  disableDate: PropTypes.oneOfType([PropTypes.bool, PropTypes.oneOf([null])]),
  disableLocation: PropTypes.oneOfType([
    PropTypes.bool,
    PropTypes.oneOf([null]),
  ]),
  disableDuration: PropTypes.oneOfType([
    PropTypes.bool,
    PropTypes.oneOf([null]),
  ]),
  disableSpecifics: PropTypes.oneOfType([
    PropTypes.bool,
    PropTypes.oneOf([null]),
  ]),
  maxEndDate: PropTypes.oneOfType([PropTypes.shape(), PropTypes.oneOf([null])]),
  eventKey: PropTypes.oneOfType([PropTypes.string, PropTypes.oneOf([null])]),
  habit: PropTypes.oneOfType([PropTypes.shape(), PropTypes.oneOf([null])]),
  date: PropTypes.oneOfType([PropTypes.shape(), PropTypes.string]),
};

const selector = formValueSelector(formName);

const mapStateToProps = (state) => {
  const { habit, date, oldKey: eventKey, disableTime, disableDate } = selector(
    state,
    'habit',
    'date',
    'oldKey',
    'disableTime',
    'disableDate'
  );
  return {
    eventKey,
    date,
    habit,
    disableTime,
    disableDate,
  };
};
export default compose(
  connect(mapStateToProps, { submitForm: submit }),
  reduxForm({
    form: formName,
    initialValues,
    validate,
    onSubmit: (
      {
        date,
        time,
        habit,
        duration,
        location,
        milestone,
        customPrompts,
        description,
        oldKey,
        templateID,
      },
      dispatch,
      { onSubmitForm }
    ) => {
      const data = {
        date,
        time,
        habit: { ...habit, description },
        duration,
        location,
        milestone,
        templateID,
        customPrompts,
      };
      onSubmitForm(data, oldKey);
      dispatch(reset(formName));
    },
  })
)(EditEvent);
