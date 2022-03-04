import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import { Dropdown } from 'semantic-ui-react';
import { Field } from 'redux-form';
import FieldSetLayout from '../../ReduxForm/FieldSetLayout';
import './DayDropdownInput.scss';

const today = moment();
const daysLeft = moment().endOf('month').endOf('week').diff(today, 'day');
const days = Array.from(Array(daysLeft + 1).keys()).map((i) => {
  const day = moment().add(i, 'day');
  const value = day.clone().format('MM-DD-YYYY');
  return {
    value,
    key: value,
    text: `${day.clone().format('ddd, MMM D')}${
      day.isSame(today, 'day') ? ' (Today)' : ''
    }`,
  };
});

function getDaysOptions({ startDate, endDate }) {
  const daysOptions = [];
  const date = startDate.clone().subtract(1, 'day');
  while (date.isBefore(endDate, 'day')) {
    const value = date.add(1, 'day').clone();
    if (!value.isBefore(today, 'day')) {
      daysOptions.push({
        value: value.format('MM-DD-YYYY'),
        key: value,
        text: `${value.clone().format('ddd, MMM D')}${
          value.isSame(today, 'day') ? ' (Today)' : ''
        }`,
      });
    }
  }
  return daysOptions;
}
function InnerComp({
  input: { name, onChange, value },
  currentIntervalDate: { startDate, endDate },
  ...props
}) {
  const optionsDays =
    startDate && endDate ? getDaysOptions({ startDate, endDate }) : days;
  return (
    <FieldSetLayout {...props}>
      <Dropdown
        fluid
        selection
        name={name}
        options={optionsDays}
        value={value}
        placeholder="Select a date"
        onChange={(e, { value: val }) => onChange(val)}
        className="DayDropdownInput"
      />
    </FieldSetLayout>
  );
}

InnerComp.propTypes = {
  input: PropTypes.shape(),
  label: PropTypes.string,
  currentIntervalDate: PropTypes.shape({
    startDate: PropTypes.oneOfType([
      PropTypes.shape(),
      PropTypes.oneOf([null]),
    ]),
    endDate: PropTypes.oneOfType([PropTypes.shape(), PropTypes.oneOf([null])]),
  }),
};

const CheckBoxInput = (props) => <Field {...props} component={InnerComp} />;

export default CheckBoxInput;
