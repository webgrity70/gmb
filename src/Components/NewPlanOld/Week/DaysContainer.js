/* eslint-disable no-extra-boolean-cast */
/* eslint-disable jsx-a11y/anchor-is-valid */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import React from 'react';
import PropTypes from 'prop-types';
import isEmpty from 'lodash/isEmpty';
import get from 'lodash/get';
import { defaultRepeatValues } from '../utils';
import Day from './Day';

class DaysContainer extends React.Component {
  onChangeHabit = ({ day, habit }) => {
    const { form } = this.props;
    form.setFieldValue(
      `days.${day}.habit`,
      !isEmpty(habit) ? habit : { habit: habit.habit, category: habit.category }
    );
    this.isChecked(day, 'habit');
  };

  onChangeTime = ({ day, value }) => {
    const { form } = this.props;
    form.setFieldValue(`days.${day}.time`, value);
    this.isChecked(day, 'time');
  };

  onChangePlace = ({ day, value }) => {
    const { form } = this.props;
    form.setFieldValue(`days.${day}.place`, value);
    this.isChecked(day, 'place');
  };

  onChangeSpecifics = ({ day, value }) => {
    const { form } = this.props;
    form.setFieldValue(`days.${day}.specifics`, value);
    this.isChecked(day, 'specifics');
  };

  onChangeSessionDurantion = ({ day, value }) => {
    const { form } = this.props;
    form.setFieldValue(`days.${day}.sessionDuration`, value);
    this.isChecked(day, 'sessionDuration');
  };

  onOpenSpecifics = (day) => {
    const { form } = this.props;
    form.setFieldValue(`days.${day}.openSpecifics`, true);
  };

  onCheckDay = (day, reset) => {
    const {
      form: {
        setFieldValue,
        values: {
          days: {
            [day]: { checked },
          },
          repeatValues,
          repeat,
        },
      },
    } = this.props;
    if (!checked) {
      const fields = Object.keys(repeat).filter((e) => e);
      fields.forEach(
        (f) =>
          !!repeatValues[f] &&
          setFieldValue(`days.${day}.${f}`, repeatValues[f])
      );
    } else if (!reset) {
      const fields = Object.keys(defaultRepeatValues);
      fields.forEach((f) =>
        setFieldValue(`days.${day}.${f}`, defaultRepeatValues[f])
      );
    }
    setFieldValue(`days.${day}.checked`, !checked);
  };

  isChecked(day, field) {
    const { form } = this.props;
    if (!form.values.days[day].checked) {
      form.setFieldValue(`days.${day}.checked`, true);
      const fields = Object.keys(form.values.repeat).filter(
        (e) => e && e !== field
      );
      fields.forEach(
        (f) =>
          !!form.values.repeatValues[f] &&
          form.setFieldValue(`days.${day}.${f}`, form.values.repeatValues[f])
      );
    }
  }

  render() {
    const {
      data,
      form,
      profileId,
      week,
      isMobile,
      timeFormat,
      startDate,
      categories,
    } = this.props;
    return (
      <>
        {data.map((day) => (
          <Day
            key={`week-${week}/day-${day}`}
            day={day}
            nWeek={week - 1}
            errors={get(form.errors, day)}
            setFieldError={form.setFieldError}
            values={get(form.values.days, day)}
            onCheckDay={this.onCheckDay}
            onChangeHabit={this.onChangeHabit}
            profileId={profileId}
            startDate={startDate}
            isMobile={isMobile}
            categories={categories}
            onChangeTime={this.onChangeTime}
            onChangePlace={this.onChangePlace}
            onChangeSessionDurantion={this.onChangeSessionDurantion}
            onChangeSpecifics={this.onChangeSpecifics}
            onOpenSpecifics={this.onOpenSpecifics}
            timeFormat={timeFormat}
          />
        ))}
      </>
    );
  }
}

DaysContainer.propTypes = {
  data: PropTypes.arrayOf(PropTypes.string),
  form: PropTypes.shape(),
  isMobile: PropTypes.bool,
  profileId: PropTypes.number,
  startDate: PropTypes.shape(),
  timeFormat: PropTypes.string,
  week: PropTypes.number,
  categories: PropTypes.arrayOf(PropTypes.shape()),
};

export default DaysContainer;
