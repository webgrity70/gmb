import React from 'react';
import moment from 'moment';
import cx from 'classnames';
import Input from './questions/Input';
import Gender from './questions/Gender';
import DateComponent from './questions/DateComponent';
import Location from './questions/Location';
import Languages from './questions/Languages';
import MultipleSelector from './questions/MultipleSelector';
import Education from './questions/Education';
import GMBDropdown from './questions/Dropdown';
// import PlaceComponent from './questions/PlaceComponent';
import GroupSelect from './questions/GroupSelect';
import Apps from './questions/App';
import TextArea from './questions/TextArea';
import DropdownMultiple from './questions/DropdownMultiple';
import Scale from './questions/Scale';
import RangeSlider from './questions/RangeSlider';
import Referrals from './questions/Referral';
import SingleSelect from './questions/SingleSelect';
import Habits from './questions/Habits';
import PlanDays from './questions/PlanDays';
import Billing from './questions/Billing';
import SameTimeAndPlace from './questions/SameTimeAndPlace';
import ReduceBehavior from './questions/ReduceBehaviors';
import PlanNumberOfTimes from './questions/PlanNumberInTimes';
import Distance from './questions/Distance';
import About from './questions/About';
import TimezoneRange from './questions/TimezoneRange';

const DATE_FORMAT = 'YYYY-MM-DD';

const getQuestion = (type, onChange, value, question) => {
  if (
    ['buddy_sex', 'build_habit', 'meeting_preference'].includes(
      question.identifier
    )
  ) {
    return (
      <SingleSelect
        options={question.options}
        value={value}
        onChange={onChange}
      />
    );
  }

  if (question.identifier === 'about') {
    return <About onChange={onChange} value={value} question={question} />;
  }

  switch (type) {
    case 'input_text':
      return (
        <Input
          autoFocus
          value={value}
          onChange={(e, data) => onChange(data.value)}
          placeholder={question.placeholder}
        />
      );

    case 'gender':
      return (
        <Gender value={value} onChange={(e, data) => onChange(data.value)} />
      );

    case 'age':
      return (
        <DateComponent
          value={value}
          onChange={(date) => onChange(date.format(DATE_FORMAT))}
          maxYear={new Date().getFullYear()}
          minYear={moment().subtract(16, 'years')}
          message="You must be over 16 years old to sign up."
        />
      );

    case 'date':
      return (
        <DateComponent
          value={value}
          onChange={(date) => onChange(date.format(DATE_FORMAT))}
        />
      );

    case 'location':
      // Initial value is empty string, and location needs object
      return <Location value={value || {}} onChange={onChange} />;

    case 'language':
      return (
        <Languages value={value} onChange={onChange} question={question} />
      );

    case 'dropdown_allow_multiple':
      return (
        <DropdownMultiple
          value={value}
          onChange={onChange}
          question={question}
        />
      );

    case 'multiple_selector_with_other':
      return (
        <MultipleSelector
          onChange={onChange}
          value={value}
          options={question.options}
        />
      );

    case 'dropdown_with_currently_in':
      return (
        <Education
          onChange={onChange}
          value={value}
          options={question.options}
        />
      );

    case 'dropdown':
      return (
        <GMBDropdown
          onChange={(e, data) => onChange(data.value)}
          value={value}
          options={question.options}
        />
      );

    case 'group_schools':
      return (
        <GroupSelect
          groupType="School"
          onChange={onChange}
          value={value}
          question={question}
        />
      );

    case 'group_gyms':
      return (
        <GroupSelect
          groupType="Gym"
          onChange={onChange}
          value={value}
          question={question}
        />
      );

    case 'group_organizations':
      return (
        <GroupSelect
          groupType="Organization"
          onChange={onChange}
          value={value}
          question={question}
        />
      );

    case 'apps':
      return <Apps onChange={onChange} value={value} apps={question.options} />;

    case 'text_area':
      return <TextArea onChange={onChange} value={value} question={question} />;

    case 'input_number':
      return (
        <Input
          value={value}
          type="number"
          onChange={(e, data) => onChange(data.value)}
          placeholder={question.placeholder}
        />
      );

    case 'multiple_selector':
      return (
        <DropdownMultiple
          value={value}
          onChange={onChange}
          options={question.options}
        />
      );

    case 'slider':
    case 'scale': {
      let min = parseInt(question.min, 10);
      min = isNaN(min) ? 0 : min;

      let max = parseInt(question.max, 10);
      max = isNaN(max) ? 100 : max;

      if (value === '') {
        onChange((min + max) / 2);
      }

      if (question.identifier === 'distance') {
        return (
          <Distance
            min={min}
            max={max}
            value={value}
            onChange={onChange}
            className={question.identifier}
          />
        );
      }

      if (question.identifier === 'timezone_range') {
        return (
          <TimezoneRange
            min={min}
            max={max}
            value={value}
            onChange={onChange}
            className={question.identifier}
          />
        );
      }

      return (
        <Scale
          minLabel={question.min}
          maxLabel={question.max}
          min={min}
          max={max}
          value={value}
          onChange={onChange}
          className={question.identifier}
        />
      );
    }

    case 'range_slider':
      return (
        <RangeSlider
          min={question.min}
          max={question.max}
          value={value}
          onChange={onChange}
        />
      );

    case 'referral_emails':
      return <Referrals value={value} onChange={onChange} />;

    case 'same_time_and_place':
      return (
        <SameTimeAndPlace
          value={value}
          onChange={onChange}
          options={question.options}
        />
      );

    case 'habit':
      return <Habits value={value} onChange={onChange} />;

    case 'plan_days':
      return <PlanDays value={value} onChange={onChange} />;

    case 'billing':
      return <Billing value={value} onChange={onChange} />;

    case 'negative_behaviours':
      return (
        <ReduceBehavior
          value={value}
          onChange={onChange}
          behaviors={question.options}
        />
      );

    case 'plan_number_of_times':
      return (
        <PlanNumberOfTimes
          value={value}
          onChange={onChange}
          question={question}
        />
      );

    default:
      return null;
  }
};

const Question = ({ question, onChange, value }) => (
  <div
    className={cx('question', question.identifier, {
      'signup-confirmation-question': question.type === 'confirmation',
    })}
  >
    <p className="question-title"> {question.question} </p>
    {question.description && (
      <p className="question-sub-title">
        {/* <Icon name="eye slash outline" /> */}
        {question.description}
      </p>
    )}

    <div className="question-content" key={question.identifier}>
      {getQuestion(question.type, onChange, value, question)}
    </div>
  </div>
);

export default Question;
