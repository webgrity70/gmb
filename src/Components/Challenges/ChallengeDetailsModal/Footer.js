/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import React, { useState } from 'react';
import { Icon } from 'semantic-ui-react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { touch, change } from 'redux-form';
import { Remarkable } from 'remarkable';
import { linkify } from 'remarkable/linkify';
import moment from 'moment-timezone';
import EditEvent from '../../NewPlan/EditEvent';
import BehaviorModal from '../../NewPlan/BehaviorModal';
import { getSinglePlanValues } from '../../NewPlan/BehaviorModal/utils';
import {
  bem,
  editFormName,
  repeatFormName,
  getEditInitialValues,
} from './utils';
import * as planActions from '../../../Actions/actions_plan';
import * as challengeActions from '../../../Actions/actions_challenges';
import parseTimeFormat from '../../../utils/parseTimeFormat';
import {
  getSlug,
  getTimeFromMinutes,
  parseDurationToMinutes,
} from '../../NewPlan/utils';
import { getSaveAsTemplateEvent } from '../../Plan/EventDetailsModal/utils';
import SaveEventAsTemplate from '../../Plan/SaveEventAsTemplate/SaveEventAsTemplate';
import convertMeridiem from '../../../utils/convertMeridiem';
import { getChallengeDetails } from '../../../selectors/challenges';
import indexesToPrompts from '../../../utils/indexesToPrompts';
import { challengeLocalDateStringToTemplateTimezone } from '../../../utils/convertTimezone';

const md = new Remarkable({ linkTarget: '_blank' }).use(linkify);
const toMarkdown = require('to-markdown');

function CDFooter({
  id,
  date,
  canEdit,
  onClose,
  isStarted,
  challenge,
  touchField,
  deletePlan,
  createPlan,
  timeFormat,
  updateEvent,
  canChangeTime,
  isMyChallenge,
  changeFormValue,
  deleteChallenge,
  isFlashChallenge,
  canChangeDetails,
  canChangeLocation,
  canChangeDuration,
  startDateFormatted,
  templateTimezone,
  timezoneRestriction,
}) {
  const [openEditRegularModal, setOpenEditRegularModal] = useState(false);
  const [openEditFlashModal, setOpenEditFlashModal] = useState(false);
  const [openRepeatModal, setOpenRepeatModal] = useState(false);
  const canShowFlashFooter =
    isMyChallenge &&
    challenge.participants === 1 &&
    !isStarted &&
    isFlashChallenge;
  const canShowRegularFooter = !isFlashChallenge;
  async function onSubmitEdit(data) {
    if (openEditFlashModal) {
      await deletePlan(challenge.planId, true);
      deleteChallenge(id, true);
    }
    const singlePlanData = getSinglePlanValues(data);
    await createPlan(singlePlanData, true);
    setOpenEditFlashModal(false);
    onClose(true);
  }

  function onDelete() {
    deletePlan(challenge.planId, true);
    deleteChallenge(id);
    onClose(true);
  }
  function onRepeat() {
    setOpenRepeatModal(true);
    touchField(repeatFormName, 'date', 'duration', 'time');
  }
  function getFormIntervalDate() {
    const startDate = moment();
    const endDate = moment().add(12, 'weeks');
    return { startDate, endDate };
  }
  function onSubmitEditRegular(data) {
    setOpenEditRegularModal(false);
    const fullDate = data.date.clone().set({
      hours: convertMeridiem({
        hour: data.time.hours,
        format: data.time.format,
      }),
      minutes: Number(data.time.minutes),
      seconds: 0,
      milliseconds: 0,
    });

    const description = data.habit.description || data.description;
    updateEvent({
      id: challenge.eventId,
      date: challengeLocalDateStringToTemplateTimezone({
        date: fullDate,
        restriction: timezoneRestriction,
        timezone: templateTimezone,
      }),
      // Used for reducer only
      localDate: fullDate.toISOString(),
      category: data.habit.category,
      habit: data.habit.habit,
      place: data.location,
      createTemplate: false,
      duration: parseDurationToMinutes(
        `${data.duration.hours}h ${data.duration.minutes}m`
      ),
      ...(description && { specifics: toMarkdown(description) }),
      ...(data.milestone.active && { milestone: data.milestone.description }),
      ...(data.customPrompts.active && {
        prompts: data.customPrompts.prompts,
      }),
    });
    onClose(true);
  }
  function onOpenEditRegular() {
    setOpenEditRegularModal(true);
    const [mHours, mMinutes, mFormat] = date
      .clone()
      .format(timeFormat)
      .replace(/\s/, ':')
      .split(/:/);
    const { hours: dHours, minutes: dMinutes } = getTimeFromMinutes(
      challenge.duration
    );
    changeFormValue('edit-event', 'disableTime', canChangeTime === 'no');
    changeFormValue('edit-event', 'disableDate', canChangeTime !== 'yes');
    changeFormValue('edit-event', 'time', {
      minutes: mMinutes,
      hours: mHours,
      format: mFormat,
    });
    changeFormValue('edit-event', 'duration', {
      hours: dHours > 0 ? String(dHours) : undefined,
      minutes: dMinutes > 0 ? String(dMinutes) : undefined,
    });
    changeFormValue('edit-event', 'milestone', {
      active: !!challenge.milestone,
      description: challenge.milestone,
    });
    changeFormValue('edit-event', 'location', challenge.place);
    changeFormValue('edit-event', 'customPrompts', {
      active: challenge.prompts.length > 0,
      prompts: challenge.prompts.length
        ? indexesToPrompts(challenge.prompts)
        : [''],
    });
    changeFormValue('edit-event', 'habit', {
      category: challenge.category,
      habit: challenge.habit,
      slug: getSlug(challenge.category),
    });
    changeFormValue(
      'edit-event',
      'description',
      md.render(challenge.specifics)
    );
    changeFormValue('edit-event', 'date', date);
  }
  return (
    <div className={bem('footer')}>
      {isFlashChallenge && (
        <div className="pointer" onClick={onRepeat}>
          <Icon name="repeat" color="orange" />
          <span>Repeat</span>
        </div>
      )}
      {canShowFlashFooter && (
        <>
          <div className="ml-4 pointer" onClick={onDelete}>
            <Icon name="trash" color="orange" />
            <span>Delete</span>
          </div>
          <div className="pointer" onClick={() => setOpenEditFlashModal(true)}>
            <Icon name="pencil" color="orange" />
            <span>Edit</span>
          </div>
        </>
      )}
      {canShowRegularFooter && (
        <div className="flex w-full justify-between">
          <SaveEventAsTemplate
            event={getSaveAsTemplateEvent({
              ...challenge,
              location: challenge.place,
              start: date.clone().utc().format(),
              habit: {
                name: challenge.habit,
                category: { name: challenge.category },
              },
              createEvent: false,
            })}
            trigger={
              <div className="pointer">
                <Icon name="file" color="orange" />
                <span>Save as Template</span>
              </div>
            }
          />
          {canEdit && (
            <div className="pointer" onClick={onOpenEditRegular}>
              <Icon name="pencil" color="orange" />
              <span>Edit</span>
            </div>
          )}
        </div>
      )}
      {openEditFlashModal && (
        <BehaviorModal
          open
          type="single"
          form={editFormName}
          onClose={() => setOpenEditFlashModal(false)}
          planEndDate={moment().add(12, 'weeks')}
          currentIntervalDate={getFormIntervalDate()}
          initialValues={getEditInitialValues({
            challenge,
            startDateFormatted,
          })}
          onSubmitSuccess={onSubmitEdit}
          title="Edit flash challenge"
          hideOptions
          isEditMode
          isFlashChallenge
          isSingleEvent
        />
      )}
      {openRepeatModal && (
        <BehaviorModal
          open
          type="single"
          form={repeatFormName}
          onClose={() => setOpenRepeatModal(false)}
          planEndDate={moment().add(12, 'weeks')}
          currentIntervalDate={getFormIntervalDate()}
          initialValues={getEditInitialValues({
            challenge: { ...challenge, date: moment().add(10, 'minutes') },
            startDateFormatted: moment()
              .add(10, 'minutes')
              .format(parseTimeFormat(timeFormat, challenge.date))
              .toUpperCase(),
          })}
          onSubmitSuccess={onSubmitEdit}
          title="Repeat flash challenge"
          hideOptions
          isEditMode
          isFlashChallenge
          isSingleEvent
        />
      )}
      <EditEvent
        isRegularChallenge
        open={openEditRegularModal}
        canChangeTime={canChangeTime}
        onSubmitForm={onSubmitEditRegular}
        disableLocation={!canChangeLocation}
        disableDuration={!canChangeDuration}
        disableSpecifics={!canChangeDetails}
        onClose={() => setOpenEditRegularModal(false)}
      />
    </div>
  );
}

CDFooter.propTypes = {
  id: PropTypes.number,
  date: PropTypes.shape(),
  onClose: PropTypes.func,
  canEdit: PropTypes.bool,
  isStarted: PropTypes.bool,
  deletePlan: PropTypes.func,
  createPlan: PropTypes.func,
  touchField: PropTypes.func,
  updateEvent: PropTypes.func,
  timeFormat: PropTypes.string,
  challenge: PropTypes.shape(),
  isMyChallenge: PropTypes.bool,
  changeFormValue: PropTypes.func,
  deleteChallenge: PropTypes.func,
  canChangeTime: PropTypes.string,
  canChangeDetails: PropTypes.bool,
  canChangeDuration: PropTypes.bool,
  canChangeLocation: PropTypes.bool,
  isFlashChallenge: PropTypes.bool,
  startDateFormatted: PropTypes.string,
  planId: PropTypes.oneOfType([PropTypes.number, PropTypes.oneOf([null])]),
};

const mapStateToProps = (state, { id, isStarted, hasInteracted }) => {
  const details = getChallengeDetails(state, { id });
  if (!details) {
    return {
      canChangeTime: 'no',
      canEdit: false,
      canChangeDetails: false,
      canChangeDuration: false,
      canChangeLocation: false,
    };
  }
  const {
    canChangeDetails,
    canChangeDuration,
    canChangeLocation,
    canChangeTime,
  } = details;
  const hasEditableFields =
    canChangeDetails ||
    canChangeLocation ||
    canChangeDuration ||
    canChangeTime !== 'no';
  return {
    canChangeTime,
    canChangeLocation,
    canChangeDuration,
    canChangeDetails,
    canEdit: hasEditableFields && !isStarted && !hasInteracted,
    timezoneRestriction: details.timezoneRestriction,
    templateTimezone: details.templateTimezone,
  };
};

export default connect(mapStateToProps, {
  touchField: touch,
  changeFormValue: change,
  createPlan: planActions.createPlan,
  deletePlan: planActions.deletePlan,
  updateEvent: planActions.updateEvent,
  deleteChallenge: challengeActions.deleteChallenge,
})(CDFooter);
