/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/anchor-is-valid */
/* eslint-disable no-extra-boolean-cast */
import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import isEmpty from 'lodash/isEmpty';
import get from 'lodash/get';
import cx from 'classnames';
import { Icon } from 'semantic-ui-react';
import Behaviors from '../Behaviors';
import MDEEditor from '../../Elements/MDEditor/MdeEditor';
import Time from '../Time';
import { PlanTemplates } from '../TemplatesTrigger';
import Place from '../Place';
import Duration from '../Duration';
import { days, getWeekLabel, getInitial } from '../utils';
import DaysContainer from './DaysContainer';
import { bem } from './utils';
import 'easymde/dist/easymde.min.css';
import './Week.scss';
import { withCategories } from '../../HoCs';

const Week = ({
  profileId,
  timeFormat,
  form,
  isMobile,
  onSelectTemplate,
  categories,
  shouldAllowRepeatWeek,
  onRepeatPrevious,
  removeWeek,
  startDate,
  week,
}) => {
  function openRepeatSpecifics() {
    form.setFieldValue('repeat.openSpecifics', true);
  }
  function clearWeek() {
    const baseValues = getInitial();
    Object.keys(baseValues).forEach((field) => {
      days.forEach((day) =>
        form.setFieldValue(`days.${day}.${field}`, baseValues[field])
      );
    });
  }
  function changeRefs(field, value) {
    if (form.values.repeat[field]) {
      const daysKeys = Object.keys(form.values.days);
      daysKeys.forEach((dKey) => {
        if (form.values.days[dKey].checked)
          form.setFieldValue(`days.${dKey}.${field}`, value);
      });
    }
  }
  function onChangeRepeatHabit(habit) {
    const value = !isEmpty(habit)
      ? habit
      : { habit: habit.habit, category: habit.category };
    form.setFieldValue('repeatValues.habit', value);
    if (isEmpty(habit)) form.setFieldValue('repeat.specifics', false);
    changeRefs('habit', value);
  }
  function onChangeRepeatTime(value) {
    form.setFieldValue('repeatValues.time', value);
    changeRefs('time', value);
  }
  function onChangeRepeatPlace(_, { value }) {
    form.setFieldValue('repeatValues.place', value);
    changeRefs('place', value);
  }
  function onChangeRepeatSpecifics(value) {
    form.setFieldValue('repeatValues.specifics', value);
    changeRefs('specifics', value);
  }
  function onChangeRepeatSessionDurantion(_, { value }) {
    form.setFieldValue('repeatValues.sessionDuration', value);
    changeRefs('sessionDuration', value);
  }
  function onRepeatField(field) {
    const path = `repeat.${field}`;
    const currentValue = get(form.values, path, false);
    const value = !currentValue;
    form.setFieldValue(path, value);
    if (value) changeRefs(field, value);
  }
  function openFullScreen(ref) {
    if (isMobile && ref && !form.values.repeatValues.specifics) {
      ref.toolbarElements.fullScreen.click();
    }
  }
  function renderRepeatEditor() {
    return (
      !!get(form.values.repeatValues.habit, 'value', null) && (
        <div className={bem('mde-editor')}>
          {form.values.repeat.openSpecifics ? (
            <MDEEditor
              value={form.values.repeatValues.specifics}
              getInstance={openFullScreen}
              onChange={(value) => onChangeRepeatSpecifics(value)}
              placeholder={`What specifically do you intend to do

ex. 2 miles at a 7 minute pace, pgs 12-30 of Behavioral Psychology?
                    `}
            />
          ) : (
            <a onClick={() => openRepeatSpecifics()}>Add event specifics +</a>
          )}
        </div>
      )
    );
  }
  function renderExtraAction() {
    if (shouldAllowRepeatWeek) {
      return (
        <div onClick={() => onRepeatPrevious(week)}>
          <i className="fas fa-redo-alt" />
          Repeat previous
        </div>
      );
    }
    return (
      <div>
        <PlanTemplates
          onSelect={onSelectTemplate}
          trigger={
            <div>
              <i className="fas fa-file-import" />
              My Templates
            </div>
          }
        />
      </div>
    );
  }
  function WeekLabel() {
    if (isEmpty(startDate)) return null;
    return (
      <Fragment>
        <h1> | </h1>
        <h1>{getWeekLabel({ nWeek: week - 1, startPlan: startDate })}</h1>
      </Fragment>
    );
  }
  return (
    <Fragment>
      <div className={bem('week-title')}>
        <h1>Week {week}</h1>
        <WeekLabel />
        <div className={bem('divider')} />
        <div className={bem('actions')}>
          {renderExtraAction()}
          <div onClick={clearWeek}>
            <i className="fas fa-backspace" />
            Clear Week
          </div>
          {week > 1 && (
            <div onClick={() => removeWeek(week)}>
              <Icon name="close" />
              Remove Week
            </div>
          )}
        </div>
      </div>
      <div className={cx('flex flex-col', bem())}>
        <div className={cx('flex', bem('header'))}>
          <div className={bem('repeat-fields')}>
            <Behaviors
              categories={categories}
              onChangeHabit={onChangeRepeatHabit}
              values={{
                habit: form.values.repeatValues.habit,
              }}
              profileId={profileId}
              repeat={form.values.repeat.habit}
              onCheckRepeat={() => [
                onRepeatField('habit'),
                onRepeatField('specifics'),
              ]}
              errors={{}}
              canRepeat
            />
            {isMobile && renderRepeatEditor()}
            <Time
              onChange={onChangeRepeatTime}
              value={form.values.repeatValues.time}
              repeat={form.values.repeat.time}
              onCheckRepeat={() => onRepeatField('time')}
              timeFormat={timeFormat}
              canRepeat
            />
            <Place
              onChange={onChangeRepeatPlace}
              value={form.values.repeatValues.place}
              repeat={form.values.repeat.place}
              onCheckRepeat={() => onRepeatField('place')}
              canRepeat
            />
            <Duration
              onChange={onChangeRepeatSessionDurantion}
              values={{
                duration: form.values.repeatValues.sessionDuration,
              }}
              errors={{ duration: get(form.errors, 'repeat.sessionDuration') }}
              repeat={form.values.repeat.sessionDuration}
              onCheckRepeat={() => onRepeatField('sessionDuration')}
              canRepeat
            />
            {!isMobile && renderRepeatEditor()}
          </div>
        </div>
        <DaysContainer
          data={days}
          form={form}
          week={week}
          profileId={profileId}
          isMobile={isMobile}
          timeFormat={timeFormat}
          startDate={startDate}
          categories={categories}
        />
      </div>
    </Fragment>
  );
};

Week.propTypes = {
  isMobile: PropTypes.bool,
  profileId: PropTypes.number,
  timeFormat: PropTypes.string,
  shouldAllowRepeatWeek: PropTypes.bool,
  onSelectTemplate: PropTypes.func,
  removeWeek: PropTypes.func,
  week: PropTypes.number,
  form: PropTypes.shape(),
  onRepeatPrevious: PropTypes.func,
  startDate: PropTypes.shape(),
  categories: PropTypes.arrayOf(PropTypes.shape()),
};

export default withCategories({
  paramsSelector: () => true,
  skipLoading: true,
})(Week);
