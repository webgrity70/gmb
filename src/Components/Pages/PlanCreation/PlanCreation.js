import React, { useState, useCallback, useEffect } from 'react';
import moment from 'moment';
import BEMHelper from 'react-bem-helper';
import { withRouter } from 'react-router-dom';
import { toast } from 'react-toastify';
import PropTypes from 'prop-types';
import { compose } from 'redux';
import withSizes from 'react-sizes';
import isEmpty from 'lodash/isEmpty';
import { change, reset, formValueSelector, registerField } from 'redux-form';
import { connect } from 'react-redux';
import { Button, Icon, Popup } from 'semantic-ui-react';
import {
  TextInput,
  DateRangeInput,
  CheckBoxInput,
  DropdownInput,
  RadioInput,
} from '../../ReduxForm';
import { BehaviorModal, Calendar } from '../../NewPlan';
import NotificationsModal from '../../NotificationsModal';
import MilestonesModal from '../../NewPlan/MilestonesModal';
import { globalTemplateOptions, formName } from './utils';
// import PlanContext from '../../Plan/PlanContext';
import WarningUnsavedModal from '../../Elements/WarningUnsavedModal';
// import { timeFormaTypes } from '../../Plan/utils';
import { formName as behaviorFormName } from '../../NewPlan/BehaviorModal/utils';
import MilestonesPopup from '../../NewPlan/MilestonesPopup';
import { getTemplateDetails } from '../../../selectors/plans';
import './PlanCreation.scss';

const bem = BEMHelper({ name: 'PlanCreation', outputIsString: true });

const initialCurrentIntervalDate = {
  startDate: null,
  endDate: null,
};

function PlanCreation({
  submit,
  resetForm,
  dateSelected,
  onDelete,
  loading,
  editing,
  isMobile,
  changeFormValue,
  history,
  startDate,
  endDate,
  valid,
  loadingDelete,
  dirty,
  hasEvents,
  registerFormField,
  submitSucceeded,
  details,
  goal,
}) {
  // const { timeFormat } = useContext(PlanContext);
  const intervalDate = { startDate, endDate };
  const [nextLocation, setNextLocation] = useState(null);
  const [openMilestonesModal, setOpenMilestonesModal] = useState(false);
  const [openMilestonesPopup, setOpenMilestonesPopup] = useState(false);
  const [openWarning, setOpenWarning] = useState(false);
  const [openBehaviorModal, setOpenBehaviorModal] = useState(false);
  const [currentIntervalDate, setCurrentIntervalDate] = useState(
    initialCurrentIntervalDate
  );
  const [openNotificationsModal, setOpenNotificationsModal] = useState(false);
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
  function onCloseBehaviorModal(created) {
    setOpenBehaviorModal(false);
    resetForm(behaviorFormName);
    if (created) setOpenMilestonesPopup(true);
    if (currentIntervalDate.startDate)
      setCurrentIntervalDate(initialCurrentIntervalDate);
  }
  function onAddNewBehavior() {
    changeFormValue(behaviorFormName, 'repeatDates', { startDate, endDate });
    changeFormValue(behaviorFormName, 'date', startDate);
    setOpenBehaviorModal(true);
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
      toast.error('Please fill out all fields and click Save Plan.');
    }
  }
  function onCloseNotifications(shouldSubmit) {
    if (shouldSubmit) {
      submit();
    }
    setOpenNotificationsModal(false);
  }
  function onCreateTemplate(checked) {
    if (checked) {
      changeFormValue(formName, 'templateName', goal);
    }
  }

  return (
    <>
      <div>
        <TextInput
          name="goal"
          label="What's your goal with this plan?"
          placeholder="e.g., Lose 5 Pounds in three weeks"
          legend="This is your plan name."
        />
        <div className={bem('date-title')}>Start - end date:</div>
        <DateRangeInput
          name="date"
          numberOfMonths={isMobile ? 1 : 2}
          details={details}
          formName="new-plan"
        />
        {startDate && endDate && (
          <span className={bem('duration')}>
            Plan duration:{' '}
            {endDate
              .clone()
              .endOf('week')
              .diff(startDate.clone().startOf('week'), 'weeks') + 1}{' '}
            weeks (max: 12 weeks)
          </span>
        )}
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
                <Button basic onClick={() => setOpenNotificationsModal(true)}>
                  <Icon name="bell" />
                  Reminder/Check-in Settings
                </Button>
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
        <div className="flex mt-8 flex-1 flex-wrap flex-col md:flex-row">
          <div className="flex mt-2 mr-12">
            <CheckBoxInput
              name="createTemplate"
              label="Save Plan as a Template"
              onChange={onCreateTemplate}
            />
            <Popup
              trigger={<i className="ml-2 far fa-question-circle" />}
              on="click"
              hoverable
              inverted
            >
              Use successful Plans again.
              <a
                className="more-popup"
                href=" http://help.getmotivatedbuddies.com/en/articles/3205215-how-to-use-plan-templates"
                rel="noopener noreferrer"
                target="_blank"
              >
                more
              </a>
            </Popup>
          </div>
          <div className="flex flex-col flex-1 mr-0 md:mr-12">
            <TextInput
              name="templateName"
              placeholder="e.g., Lose 5 pounds in three weeks"
            />
          </div>
          <div className={bem('global')}>
            <DropdownInput
              name="globalTemplate"
              options={globalTemplateOptions}
            />
          </div>
        </div>
        <div className={bem('actions')}>
          <Button
            disabled={loading || loadingDelete}
            onClick={() => history.push('/plan')}
          >
            Cancel
          </Button>
          {onDelete && (
            <Button
              disabled={loading || loadingDelete}
              onClick={onDelete}
              loading={loadingDelete}
            >
              Delete Plan
            </Button>
          )}
          <Button
            color="orange"
            onClick={() => setOpenNotificationsModal(true)}
            disabled={baseDisabledSaveConds}
            loading={loading}
          >
            Save Plan
          </Button>
        </div>
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
        open={openNotificationsModal}
        showToast={false}
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
    </>
  );
}

const selector = formValueSelector(formName);

const mapStateToProps = (state, { id }) => {
  const { date, events, baseTemplate, goal } = selector(
    state,
    'date',
    'events',
    'baseTemplate',
    'goal'
  );

  return {
    hasEvents: !isEmpty(events),
    dateSelected: date && !!date.startDate && !!date.endDate,
    ...(date && {
      endDate: date.endDate,
      startDate: date.startDate,
    }),
    events,
    details: getTemplateDetails(state, { id: baseTemplate }),
    goal,
  };
};

PlanCreation.propTypes = {
  dateSelected: PropTypes.bool,
  resetForm: PropTypes.func,
  history: PropTypes.shape(),
  valid: PropTypes.bool,
  dirty: PropTypes.bool,
  changeFormValue: PropTypes.func,
  hasEvents: PropTypes.bool,
  events: PropTypes.any,
  registerFormField: PropTypes.func,
  submit: PropTypes.func,
  loadingDelete: PropTypes.bool,
  editing: PropTypes.bool,
  onDelete: PropTypes.func,
  loading: PropTypes.bool,
  isMobile: PropTypes.bool,
  submitSucceeded: PropTypes.bool,
  startDate: PropTypes.oneOfType([PropTypes.shape(), PropTypes.oneOf([null])]),
  endDate: PropTypes.oneOfType([PropTypes.shape(), PropTypes.oneOf([null])]),
};

export default compose(
  withRouter,
  withSizes(({ width }) => ({
    isMobile: width < 768,
  })),
  connect(mapStateToProps, {
    resetForm: reset,
    changeFormValue: change,
    registerFormField: registerField,
  })
)(PlanCreation);
