/* eslint-disable jsx-a11y/anchor-is-valid */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import React, { useState } from 'react';
import { connect } from 'react-redux';
import cx from 'classnames';
import { compose } from 'redux';
import { Modal, Icon, Accordion } from 'semantic-ui-react';
import { reduxForm, formValueSelector, reset, submit } from 'redux-form';
import BEMHelper from 'react-bem-helper';
import PropTypes from 'prop-types';
import {
  DurationInput,
  TimeInput,
  TextInput,
  HabitInput,
} from '../../ReduxForm';
import { initialValues, validate } from './utils';
import CategoryIcon from '../../Elements/CategoriesIcons/CategoryIcon';
import { getSlug } from '../utils';
import './MultiEditEvent.scss';

const formName = 'multi-edit-event';
const bem = BEMHelper({ name: 'MultiEditEventForm', outputIsString: true });

function MultiEditEvent({
  open,
  valid,
  submitForm,
  onClose,
  habit,
  disableHabit,
  disableDetails,
  disableLocation,
  disableTime,
  disableDuration,
}) {
  const [accordionIndex, setAccordionIndex] = useState(null);
  if (!open) return null;
  function handleClick(e, { index }) {
    const newIndex = accordionIndex === index ? -1 : index;
    setAccordionIndex(newIndex);
  }

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
        {habit.category && (
          <div className={bem('title')}>
            <CategoryIcon
              active
              name={habit.category}
              slug={getSlug(habit.category)}
            />
            Edit Behavior: {habit.habit}
          </div>
        )}
        <div className="ml-1">
          <h4 className={bem('label')}>What do you want to do?</h4>
          <HabitInput
            name="habit"
            disabled={disableHabit}
            hideDetails={disableDetails}
          />
        </div>
        <Accordion>
          <Accordion.Title
            active={accordionIndex === 0}
            index={0}
            onClick={handleClick}
          >
            <Icon name="dropdown" />
            Time and duration
          </Accordion.Title>
          <Accordion.Content active={accordionIndex === 0}>
            <div className="flex justify-between ml-2 flex-wrap">
              <div>
                <h4 className={bem('label')}>Time</h4>
                <TimeInput name="time" disabled={disableTime} />
              </div>
              <div>
                <h4 className={bem('label')}>Duration</h4>
                <DurationInput name="duration" disabled={disableDuration} />
              </div>
            </div>
          </Accordion.Content>
          <Accordion.Title
            active={accordionIndex === 1}
            index={1}
            onClick={handleClick}
          >
            <Icon name="dropdown" />
            Location
          </Accordion.Title>
          <Accordion.Content active={accordionIndex === 1}>
            <TextInput
              name="location"
              placeholder="ex. the park"
              className="ml-2"
              disabled={disableLocation}
            />
          </Accordion.Content>
        </Accordion>
      </Modal.Content>
      <Modal.Actions>
        <a className="pointer" onClick={onClose}>
          Cancel
        </a>
        <a
          className={cx('pointer', { [bem('disabled')]: !valid })}
          {...(valid && { onClick: () => submitForm(formName) })}
        >
          Save
        </a>
      </Modal.Actions>
    </Modal>
  );
}

MultiEditEvent.propTypes = {
  open: PropTypes.bool,
  onClose: PropTypes.func,
  submitForm: PropTypes.func,
  valid: PropTypes.bool,
  onDelete: PropTypes.func,
  eventKey: PropTypes.oneOfType([PropTypes.string, PropTypes.oneOf([null])]),
  habit: PropTypes.oneOfType([PropTypes.shape(), PropTypes.oneOf([null])]),
  disableDetails: PropTypes.oneOfType([
    PropTypes.bool,
    PropTypes.oneOf([null]),
  ]),
  disableHabit: PropTypes.oneOfType([PropTypes.bool, PropTypes.oneOf([null])]),
  disableLocation: PropTypes.oneOfType([
    PropTypes.bool,
    PropTypes.oneOf([null]),
  ]),
  disableTime: PropTypes.oneOfType([PropTypes.bool, PropTypes.oneOf([null])]),
  disableDuration: PropTypes.oneOfType([
    PropTypes.bool,
    PropTypes.oneOf([null]),
  ]),
  date: PropTypes.oneOfType([PropTypes.shape(), PropTypes.string]),
};

const selector = formValueSelector(formName);

const mapStateToProps = (state) => {
  const habit = selector(state, 'habit');
  return {
    habit,
  };
};
export default compose(
  connect(mapStateToProps, { submitForm: submit }),
  reduxForm({
    form: formName,
    initialValues,
    validate,
    onSubmit: (
      { time, duration, habit, initialHabit, location },
      dispatch,
      { onSubmitForm }
    ) => {
      const data = {
        time,
        habit,
        duration,
        location,
      };
      onSubmitForm(data, initialHabit);
      dispatch(reset(formName));
    },
  })
)(MultiEditEvent);
