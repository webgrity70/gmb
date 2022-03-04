/* eslint-disable jsx-a11y/label-has-associated-control */
import React, { useState, useEffect, useCallback } from 'react';
import cx from 'classnames';
import moment from 'moment-timezone';
import BEMHelper from 'react-bem-helper';
import PropTypes from 'prop-types';
import isEmpty from 'lodash/isEmpty';
import { connect } from 'react-redux';
import { compose } from 'redux';
import withSizes from 'react-sizes';
import { toast } from 'react-toastify';
import { Button, Icon, Popup } from 'semantic-ui-react';
import { reset, change, registerField, formValueSelector } from 'redux-form';
import {
  TextInput,
  RadioInput,
  DateRangeInput,
  LanguagesInput,
  LocationInput,
  CheckBoxInput,
  TextAreaInput,
  TimezoneInput,
  Input,
} from '../../ReduxForm';
import { fetchTemplateDetails as fetchTemplateDetailsAction } from '../../../Actions/actions_plan';
import { Calendar, BehaviorModal } from '../../NewPlan';
import NotificationsModal from '../../NotificationsModal';
import MilestonesModal from '../../NewPlan/MilestonesModal';
import GTModal from '../../Plan/GlobalTemplates/Modal';
// import { timeFormaTypes } from '../../Plan/utils';
import MilestonesPopup from '../../NewPlan/MilestonesPopup';
import history from '../../../history';
// import PlanContext from '../../Plan/PlanContext';
import PlanTemplatesDropdown from '../PlanTemplatesDropdown/PlanTemplatesDropdown';
import { convertEventsToWeeksForm } from '../../NewPlan/utils';
import AdvancedOptions from '../AdvancedOptions';
import { formName } from './utils';
import { getTemplateDetails } from '../../../selectors/plans';
import {
  fetchGlobalTemplates as fetchGlobalTemplatesAction,
  resetGTPagination as resetGTPaginationAction,
} from '../../../Actions/actions_plan';
import './ChallengeCreation.scss';
import WarningUnsavedModal from '../../Elements/WarningUnsavedModal';
import FieldSetLayout from '../../ReduxForm/FieldSetLayout';

const bem = BEMHelper({ name: 'ChallengeCreation', outputIsString: true });
const intensityOptions = [
  { label: 'Easy', value: 'Easy' },
  { label: 'Medium', value: 'Medium' },
  { label: 'Hard', value: 'Hard' },
];
const behaviorFormName = 'new-challenge-behavior';
const initialCurrentIntervalDate = {
  startDate: null,
  endDate: null,
};

function ChallengeCreation({
  name,
  templateDetails,
  valid,
  dirty,
  submit,
  editing,
  loading,
  endDate,
  onDelete,
  resetForm,
  startDate,
  hasEvents,
  isMobile,
  dateSelected,
  loadingDelete,
  submitSucceeded,
  changeFormValue,
  registerFormField,
  fetchTemplateDetails,
  fetchGlobalTemplates,
  resetGTPagination,
}) {
  const [challengeName, setChallengeName] = useState('');
  useEffect(() => {
    if (name != challengeName) {
      setChallengeName(name);
    }
  }, [name]);

  const [openGTModal, setOpenGTModal] = useState(false);

  function toggleGTModal() {
    setOpenGTModal(!openGTModal);
  }

  function onCloseGTModal() {
    toggleGTModal();
    resetGTPagination();
    fetchGlobalTemplates();
  }

  useEffect(() => {
    fetchGlobalTemplates();

    return () => {
      if (openGTModal) resetGTPagination();
    };
  }, []);

  // const { timeFormat } = useContext(PlanContext);
  const [openNotificationsModal, setOpenNotificationsModal] = useState(false);
  const [nextLocation, setNextLocation] = useState(null);
  const [openWarning, setOpenWarning] = useState(false);
  const [openMilestonesPopup, setOpenMilestonesPopup] = useState(false);
  const [openBehaviorModal, setOpenBehaviorModal] = useState(false);
  const [openMilestonesModal, setOpenMilestonesModal] = useState(false);
  const [currentIntervalDate, setCurrentIntervalDate] = useState(
    initialCurrentIntervalDate
  );
  const intervalDate = { startDate, endDate };
  const baseDisabledSaveConds =
    !valid || !!loading || !!loadingDelete || !hasEvents;
  const blockHistory = history.block((targetLocation) => {
    if (submitSucceeded) return null;
    setNextLocation(targetLocation.pathname);
    setOpenWarning(true);
    return false;
  });
  useEffect(() => {
    registerFormField(formName, 'events', 'Field');
    blockHistory();
  }, []);
  function onAddNewBehavior() {
    changeFormValue(behaviorFormName, 'repeatDates', { startDate, endDate });
    changeFormValue(behaviorFormName, 'date', startDate);
    setOpenBehaviorModal(true);
  }
  function onCloseBehaviorModal(created) {
    setOpenBehaviorModal(false);
    resetForm(behaviorFormName);
    if (created) setOpenMilestonesPopup(true);
    if (currentIntervalDate.startDate)
      setCurrentIntervalDate(initialCurrentIntervalDate);
  }
  function onOpenMilestonesWithPopup() {
    setOpenMilestonesPopup(false);
    setOpenMilestonesModal(true);
  }
  function onNegativeWarningAction() {
    history.block(() => null);
    history.push(nextLocation);
  }
  function onPositiveWarningAction() {
    if (dirty && valid) submit();
    else {
      setOpenWarning(false);
      toast.error('Please fill out all fields and click Save Challenge.');
    }
  }
  const onAddNewInWeek = useCallback(
    (date) => {
      const weekIntervalDate = date.endDate ? date : { ...date, endDate };
      setCurrentIntervalDate(weekIntervalDate);
      changeFormValue(behaviorFormName, 'repeatDates', weekIntervalDate);
      changeFormValue(behaviorFormName, 'date', date.startDate);
      setOpenBehaviorModal(true);
    },
    [setCurrentIntervalDate, setOpenBehaviorModal]
  );
  const onSelectGoal = useCallback(
    async (val) => {
      if (typeof val === 'string') {
        changeFormValue(formName, 'name', val);
      } else {
        const { detail, ...data } = await fetchTemplateDetails(val);
        if (detail) {
          toast.error(detail);
        } else {
          changeFormValue(formName, 'name', data.name);
          changeFormValue(formName, 'baseTemplate', data.id);
          const eventdate = moment(data.events[0].date);
          const eventTime = eventdate.clone().format('HH:mm');
          const [hour, minute] = eventTime.split(':').map((e) => Number(e));
          let startPlanDate = startDate.clone().set({ hour, minute });

          let startDay = startPlanDate.clone();
          let firstEventDay = moment(data.events[0].date);
          let diff = startDay.diff(firstEventDay, 'days');

          if (moment(startPlanDate).isBefore(moment())) {
            startDay = moment().add('1', 'day').set({ hour, minute });
            diff = startDay.diff(firstEventDay, 'days');
            startPlanDate = moment().add('1', 'day').set({ hour, minute });
          }

          let updated_events = data.events.map((event) => {
            return {
              ...event,
              date: moment(event.date).add(diff, 'days').utc().format(),
            };
          });

          const weeksEvents = convertEventsToWeeksForm({
            events: updated_events,
            startDate: startPlanDate,
          });

          const eventsArr = Object.values(weeksEvents);

          changeFormValue(formName, 'events', weeksEvents);
          changeFormValue(formName, 'date', {
            startDate: startPlanDate,
            endDate: eventsArr[eventsArr.length - 1].date,
          });
        }
      }
    },
    [changeFormValue, startDate, fetchTemplateDetails]
  );
  function onCloseNotifications(shouldSubmit) {
    if (shouldSubmit) {
      submit();
    }
    setOpenNotificationsModal(false);
  }
  return (
    <div className={bem()}>
      <div className={bem('templatesLink')}>
        <div onClick={() => toggleGTModal()}>
          <Icon name="file" />
          Load from templates...
        </div>
      </div>
      {/*<PlanTemplatesDropdown
        value={name}
        isEditing={editing}
        label={
          <>
            <span className="mr-1">What’s the goal of this challenge?</span>
            <span className="required">*</span>
            <Popup
              trigger={<i className="far fa-question-circle mt-2 mr-2 ml-2" />}
              on="click"
              inverted
              hoverable
            >
              Let others know what they’re working towards.
            </Popup>
          </>
        }
        placeholder="e.g., Run 3x a Week, Python for Everybody (Coursera), Lose 5lbs in 10 Weeks"
        legend="This is your challenge name."
        onSelect={onSelectGoal}
      />*/}
      <FieldSetLayout
        label={
          <>
            <span className="mr-1">What’s the goal of this challenge?</span>
            <span className="required">*</span>
            <Popup
              trigger={<i className="far fa-question-circle mt-2 mr-2 ml-2" />}
              on="click"
              inverted
              hoverable
            >
              Let others know what they’re working towards.
            </Popup>
          </>
        }
      >
        <Input
          value={challengeName}
          required
          placeholder="e.g., Run 3x a Week, Python for Everybody (Coursera), Lose 5lbs in 10 Weeks"
          className={bem('label')}
          onChange={(newName) => {
            setChallengeName(newName);
            changeFormValue(formName, 'name', newName);
          }}
        />
      </FieldSetLayout>
      <TextAreaInput
        name="description"
        label="Description"
        required
        placeholder="Describe your challenge for others. The more details the better."
        className={cx('mt-3 mb-3', bem('label'))}
      />
      <TextInput
        name="website"
        label="Website"
        placeholder="http://www.MyOrg.com"
      />
      <DateRangeInput
        name="date"
        label="Start - end date"
        className="mt-6"
        numberOfMonths={isMobile ? 1 : 2}
        formName={formName}
        details={templateDetails}
        required
      />
      {startDate && endDate && (
        <span className={bem('duration')}>
          Challenge duration:{' '}
          {endDate
            .clone()
            .endOf('week')
            .diff(startDate.clone().startOf('week'), 'weeks') || 1}{' '}
          weeks (max: 12 weeks)
        </span>
      )}
      {/* <div className="flex items-center">
        <CheckBoxInput
          name="mustJoinBeforeStart"
          label="User must join before the challenge start date"
          className="mt-4"
        />
        <Popup
          trigger={<i className="far fa-question-circle ml-4" />}
          on="click"
          inverted
          hoverable
        >
          A user cannot join the challenge after it has started.
        </Popup>
      </div> */}
      <TimezoneInput name="timezoneRestriction" className="mt-6" />
      <LocationInput name="location" />
      <LanguagesInput name="languages" className="mt-1" />
      <div className={cx('mt-2', bem('label'))}>
        <label>Who can see this challenge:</label>
        <strong>Public</strong>
        <Popup
          trigger={<i className="far fa-question-circle mr-2 ml-2" />}
          on="click"
          inverted
          hoverable
        >
          Private challenges coming soon.
        </Popup>
      </div>
      <RadioInput
        options={intensityOptions}
        name="intensity"
        className={cx(bem('intensity'), 'mt-1')}
        label={
          <>
            <span>Intensity</span>
            <Popup
              trigger={<i className="far fa-question-circle mt-2 ml-3" />}
              on="click"
              inverted
              hoverable
            >
              Describe the level of involvement you expect.
            </Popup>
          </>
        }
      />
      <AdvancedOptions formName={formName} />
      {dateSelected && (
        <>
          <h3 className={bem('schedule-title')}>Schedule your behaviors</h3>
          <div className="flex justify-between flex-col md:flex-row">
            <Button
              className={bem('schedule-button')}
              color="orange"
              onClick={onAddNewBehavior}
            >
              + New behavior
            </Button>
            <div className={bem('extra-actions')}>
              {hasEvents && (
                <Button basic onClick={() => setOpenMilestonesModal(true)}>
                  <Icon name="flag" />
                  Milestones
                </Button>
              )}
              {/* <Button basic onClick={() => setOpenNotificationsModal(true)}>
                <Icon name="bell" />
              Reminder/Check-in Settings
              </Button> */}
              <Button basic onClick={() => resetForm(formName)}>
                <Icon name="undo" />
                Reset
              </Button>
            </div>
          </div>
        </>
      )}
      <Calendar
        onAddNew={onAddNewInWeek}
        editing={editing}
        formName={formName}
        behaviorFormName={behaviorFormName}
      />
      <CheckBoxInput
        name="createEvents"
        label="Join and add this challenge to my calendar"
      />
      <div className={bem('divider')} />
      <div className={bem('actions')}>
        <Button
          disabled={loading || loadingDelete}
          onClick={() => history.push('/challenges')}
        >
          Cancel
        </Button>
        {onDelete && (
          <Button
            disabled={loading || loadingDelete}
            onClick={onDelete}
            loading={loadingDelete}
          >
            Delete Challenge
          </Button>
        )}
        <Button
          color="orange"
          onClick={() => setOpenNotificationsModal(true)}
          disabled={baseDisabledSaveConds}
          loading={loading}
        >
          Save Challenge
        </Button>
      </div>
      <BehaviorModal
        open={openBehaviorModal}
        onClose={onCloseBehaviorModal}
        planEndDate={endDate}
        form={behaviorFormName}
        mainFormName={formName}
        currentIntervalDate={
          currentIntervalDate.startDate ? currentIntervalDate : intervalDate
        }
        hideOptions={false}
      />
      <NotificationsModal
        type="challenge"
        showToast={false}
        open={openNotificationsModal}
        onClose={onCloseNotifications}
      />
      {openMilestonesModal && (
        <MilestonesModal
          open
          formName={formName}
          onClose={() => setOpenMilestonesModal(false)}
        />
      )}
      <MilestonesPopup
        open={openMilestonesPopup}
        onOpenMilestones={onOpenMilestonesWithPopup}
        onClose={() => setOpenMilestonesPopup(false)}
      />
      <WarningUnsavedModal
        open={openWarning}
        onPositive={onPositiveWarningAction}
        onNegative={onNegativeWarningAction}
        onClose={() => setOpenWarning(false)}
      />
      <GTModal
        open={openGTModal}
        onClose={onCloseGTModal}
        isMobile={isMobile}
        closeOnDimmerClick={false}
        type="Challenge"
        displayBlank={false}
        isChallenge={true}
      />
    </div>
  );
}

ChallengeCreation.propTypes = {
  dateSelected: PropTypes.bool,
  editing: PropTypes.bool,
  dirty: PropTypes.bool,
  valid: PropTypes.bool,
  submitSucceeded: PropTypes.bool,
  hasEvents: PropTypes.bool,
  resetForm: PropTypes.func,
  isMobile: PropTypes.bool,
  changeFormValue: PropTypes.func,
  registerFormField: PropTypes.func,
  loadingDelete: PropTypes.bool,
  loading: PropTypes.bool,
  submit: PropTypes.func,
  name: PropTypes.string,
  templateDetails: PropTypes.oneOfType([
    PropTypes.shape(),
    PropTypes.oneOf([null]),
  ]),
  fetchTemplateDetails: PropTypes.func,
  onDelete: PropTypes.oneOfType([PropTypes.func, PropTypes.oneOf([null])]),
  startDate: PropTypes.oneOfType([PropTypes.shape(), PropTypes.oneOf([null])]),
  endDate: PropTypes.oneOfType([PropTypes.shape(), PropTypes.oneOf([null])]),
};

const selector = formValueSelector(formName);
const mapStateToProps = (state) => {
  const { date, events, name, baseTemplate } = selector(
    state,
    'date',
    'events',
    'name',
    'baseTemplate'
  );
  return {
    name,
    hasEvents: !isEmpty(events),
    dateSelected: date && !!date.startDate && !!date.endDate,
    ...(date && {
      endDate: date.endDate,
      startDate: date.startDate,
    }),
    templateDetails: getTemplateDetails(state, { id: baseTemplate }),
  };
};

export default compose(
  withSizes(({ width }) => ({
    isMobile: width < 768,
  })),
  connect(mapStateToProps, {
    resetForm: reset,
    changeFormValue: change,
    registerFormField: registerField,
    fetchTemplateDetails: fetchTemplateDetailsAction,
    fetchGlobalTemplates: fetchGlobalTemplatesAction,
    resetGTPagination: resetGTPaginationAction,
  })
)(ChallengeCreation);
