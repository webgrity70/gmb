/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/anchor-is-valid */
import React from 'react';
import moment from 'moment';
import { compose } from 'redux';
import BEMHelper from 'react-bem-helper';
import cx from 'classnames';
import { connect } from 'react-redux';
import { reduxForm, reset, change, formValueSelector } from 'redux-form';
import PropTypes from 'prop-types';
import { Modal } from 'semantic-ui-react';
import {
  RadioInput,
  DurationInput,
  TimeInput,
  TextInput,
  HabitInput,
  DropdownInput,
  DateRangeInput,
  CheckBoxInput,
  CustomPrompts,
  SingleDateInput,
} from '../../ReduxForm';
import MilestoneCheckBoxInput from '../MilestoneCheckBoxInput';
import FlashChallengeCheckBoxInput from '../FlashChallengeCheckBoxInput';
import EventTemplates from '../EventTemplates';
import {
  validate,
  initialValues,
  options,
  repeatOptions,
  customDaysOptions,
  getSinglePlanValues,
} from './utils';
import { createPlan } from '../../../Actions/actions_plan';
// import { getUserLocationId } from '../../../selectors/profile';
import convertMeridiem from '../../../utils/convertMeridiem';
import './BehaviorModal.scss';

const bem = BEMHelper({ name: 'BehaviorModal', outputIsString: true });

function BehaviorModal({
  valid,
  currentIntervalDate,
  submit,
  repeat,
  form,
  onClose,
  resetForm,
  isEditMode,
  // currentLocationId,
  isFlashChallenge,
  open,
  type,
  planEndDate,
  isSingleEvent,
  isNewEvent,
  title,
  hideOptions,
  newEventName,
}) {
  function getTitle() {
    if (title) return title;
    return isSingleEvent ? 'New one-off event' : 'New Behavior';
  }
  return (
    <Modal
      dimmer="inverted"
      open={open}
      onClose={() => onClose()}
      closeOnDimmerClick={false}
      size="small"
      closeIcon
      className={bem()}
    >
      <Modal.Content>
        <h3 className={bem('title')}>{getTitle()}</h3>
        {isSingleEvent && (
          <div className={bem('event-templates')}>
            <EventTemplates formName={form} forChallenges={isFlashChallenge} />
          </div>
        )}
        {!hideOptions && (
          <div className="flex justify-between mb-4 flex-col md:flex-row">
            <RadioInput name="type" options={options} />
            {type === 'single' && <EventTemplates formName={form} />}
          </div>
        )}
        {isFlashChallenge && (
          <FlashChallengeCheckBoxInput
            name="challenge"
            alwaysActive
            label="Turn this to a flash challenge"
            // currentLocationId={currentLocationId}
          />
        )}
        <h4 className={bem('label')}>What do you want to do?</h4>
        <HabitInput
          name="habit"
          isNewEvent={isNewEvent}
          newEventName={newEventName}
        />
        {!isSingleEvent && type === 'multi' && (
          <>
            <h4 className={bem('label')}>Repeat</h4>
            <DropdownInput
              name="repeat"
              options={repeatOptions}
              placeholder="Frequency"
            />
            {repeat === 0 && (
              <div className="flex flex-wrap mb-4 mt-1">
                {customDaysOptions.map((e) => (
                  <CheckBoxInput {...e} className="flex-0 md:flex-1 mr-4" />
                ))}
              </div>
            )}
            <div className={bem('label')}>Start - end date:</div>
            <DateRangeInput
              name="repeatDates"
              maxDate={planEndDate}
              minDate={currentIntervalDate.startDate}
              openDirection="up"
              numberOfMonths={1}
            />
          </>
        )}
        {type === 'single' && (
          <>
            <h4 className={bem('label')}>Date</h4>
            <SingleDateInput
              name="date"
              minDate={currentIntervalDate.startDate}
              maxDate={currentIntervalDate.endDate}
              openDirection="down"
            />
          </>
        )}
        <div className="flex justify-between mt-6 flex-wrap">
          <div className="mb-3 md:mb-0">
            <h4 className={bem('label')}>Time</h4>
            <TimeInput tabindexbase={1} name="time" />
          </div>
          <div>
            <h4 className={bem('label')}>Duration</h4>
            <DurationInput tabindexbase={4} name="duration" />
          </div>
        </div>
        <h4 className={bem('label')}>Location</h4>
        <TextInput
          name="location"
          placeholder="e.g., the park"
          autoCapitalize="false"
        />
        <CustomPrompts name="customPrompts" className="mt-3" />
        {type === 'single' && (
          <MilestoneCheckBoxInput
            name="milestone"
            label="Mark this date as a milestone"
          />
        )}
        {isSingleEvent && !isFlashChallenge && (
          <FlashChallengeCheckBoxInput
            name="challenge"
            label="Turn this to a flash challenge"
            // currentLocationId={currentLocationId}
          />
        )}
      </Modal.Content>
      <Modal.Actions>
        <a className="pointer" onClick={() => [resetForm(form), onClose()]}>
          Cancel
        </a>
        <a
          className={cx('pointer', { [bem('disabled')]: !valid })}
          {...(valid && { onClick: submit })}
        >
          {isEditMode ? 'Save' : 'Create'}
        </a>
      </Modal.Actions>
    </Modal>
  );
}

BehaviorModal.propTypes = {
  onClose: PropTypes.func,
  type: PropTypes.string,
  open: PropTypes.bool,
  repeat: PropTypes.number,
  valid: PropTypes.bool,
  hideOptions: PropTypes.bool,
  destroyForm: PropTypes.func,
  form: PropTypes.string,
  planEndDate: PropTypes.oneOfType([
    PropTypes.shape(),
    PropTypes.oneOf([null]),
  ]),
  currentIntervalDate: PropTypes.shape({
    startDate: PropTypes.oneOfType([
      PropTypes.shape(),
      PropTypes.oneOf([null]),
    ]),
    endDate: PropTypes.oneOfType([PropTypes.shape(), PropTypes.oneOf([null])]),
  }),
  submit: PropTypes.func,
  isSingleEvent: PropTypes.bool,
  onSubmitSuccess: PropTypes.oneOfType([
    PropTypes.func,
    PropTypes.oneOf([null]),
  ]),
  isEditMode: PropTypes.oneOfType([PropTypes.bool, PropTypes.oneOf([null])]),
  title: PropTypes.oneOfType([PropTypes.string, PropTypes.oneOf([null])]),
  isNewEvent: PropTypes.bool,
  newEventName: PropTypes.string,
  resetForm: PropTypes.func,
  isFlashChallenge: PropTypes.bool,
  // currentLocationId: PropTypes.string,
};

export default compose(
  connect(
    (state, { form }) => {
      const selector = formValueSelector(form);
      const events = selector(state, 'events');
      return {
        ...selector(state, 'type', 'repeat'),
        habits: events != null ? Object.keys(events) : [],
        /* ...(profile && {
          currentLocationId: getUserLocationId(state, { profileId: profile.pk })
        }), */
      };
    },
    { resetForm: reset }
  ),
  reduxForm({
    // form as prop
    validate,
    initialValues,
    enableReinitialize: true,
    shouldError: () => true,
    onSubmit: async (
      {
        date,
        habit,
        customDays,
        customPrompts,
        repeat,
        repeatDates,
        baseTemplate,
        type,
        time,
        duration,
        location,
        milestone,
        challenge,
        templateEvent,
      },
      dispatch,
      {
        onClose,
        isSingleEvent,
        habits,
        form,
        resetForm,
        onSubmitSuccess,
        mainFormName,
      }
    ) => {
      const baseData = {
        time,
        duration,
        customPrompts: {
          ...customPrompts,
          prompts: customPrompts.prompts.filter((e) => !!e),
        },
        location,
        milestone,
        ...(templateEvent && { templateEvent }),
      };
      const existingHabit = habits.some((e) => {
        const [_habitVal, _date] = e.split('/');
        return (
          Number(_habitVal) === habit.value &&
          date.clone().week() === moment(new Date(_date)).week()
        );
      });
      const data = {
        ...baseData,
        habit: {
          ...habit,
          ...(!existingHabit && { initialValues: { ...baseData } }),
        },
      };
      if (onSubmitSuccess) {
        onSubmitSuccess({
          ...data,
          date,
          habit,
          challenge,
        });
        resetForm(form);
        onClose();
      } else if (isSingleEvent) {
        const singlePlanData = getSinglePlanValues({
          time,
          duration,
          customPrompts,
          location,
          milestone,
          date,
          habit,
          baseTemplate,
          challenge,
          templateEvent,
        });
        await dispatch(createPlan(singlePlanData));
        resetForm(form);
        onClose(true);
      } else if (type === 'single') {
        const dayUnix = date
          .clone()
          .set({
            minutes: time.minutes,
            hours: convertMeridiem({ hour: time.hours, format: time.format }),
            seconds: 0,
            milliseconds: 0,
          })
          .format('X');
        dispatch(
          change(mainFormName, `events.${habit.value}/${dayUnix}`, {
            date,
            ...data,
          })
        );
        resetForm(form);
        onClose();
      } else {
        const baseDate = repeatDates.startDate.clone();
        const endDate = repeatDates.endDate.clone();
        const customRange = repeat === 0;
        const repeatInterval = customRange ? 1 : repeat;
        const startDayUnix = baseDate
          .clone()
          .set({
            minutes: Number(time.minutes),
            hours: convertMeridiem({ hour: time.hours, format: time.format }),
            seconds: 0,
            milliseconds: 0,
          })
          .format('X');
        dispatch(
          change(mainFormName, `events.${habit.value}/${startDayUnix}`, {
            date: baseDate.clone(),
            ...data,
          })
        );
        while (baseDate.isBefore(endDate)) {
          const day = baseDate.add(repeatInterval, 'day').clone();
          const checkedDays = customRange
            ? Object.keys(customDays)
                .filter((e) => customDays[e])
                .map((e) => Number(e))
            : [];
          if (!customRange || checkedDays.includes(day.clone().day())) {
            const dayUnix = day
              .clone()
              .set({
                minutes: Number(time.minutes),
                hours: convertMeridiem({
                  hour: time.hours,
                  format: time.format,
                }),
                seconds: 0,
                milliseconds: 0,
              })
              .format('X');
            dispatch(
              change(mainFormName, `events.${habit.value}/${dayUnix}`, {
                date: day,
                ...data,
              })
            );
          }
        }
        resetForm(form);
        onClose(true);
      }
    },
  })
)(BehaviorModal);
