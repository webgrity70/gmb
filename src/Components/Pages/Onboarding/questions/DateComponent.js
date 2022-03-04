import React, { Fragment } from 'react';
import { Form, Dropdown } from 'semantic-ui-react';
import moment from 'moment';
import _ from 'lodash';

// TO-DO fix this based on year
const MONTHS = [
  {
    text: '01',
    value: 1,
    key: 1,
    days: 31,
  },
  {
    text: '02',
    value: 2,
    key: 2,
    days: 28,
  },
  {
    text: '03',
    value: 3,
    key: 3,
    days: 31,
  },
  {
    text: '04',
    value: 4,
    key: 4,
    days: 30,
  },
  {
    text: '05',
    value: 5,
    key: 5,
    days: 31,
  },
  {
    text: '06',
    value: 6,
    key: 6,
    days: 30,
  },
  {
    text: '07',
    value: 7,
    key: 7,
    days: 31,
  },
  {
    text: '08',
    value: 8,
    key: 8,
    days: 31,
  },
  {
    text: '09',
    value: 9,
    key: 9,
    days: 30,
  },
  {
    text: '10',
    value: 10,
    key: 10,
    days: 31,
  },
  {
    text: '11',
    value: 11,
    key: 11,
    days: 30,
  },
  {
    text: '12',
    value: 12,
    key: 12,
    days: 31,
  },
];

const buildDays = (month) => {
  const selectedMonth = MONTHS[month - 1];
  let numberOfDays = selectedMonth.days;
  const days = [];
  while (numberOfDays) {
    days.push({
      value: numberOfDays,
      key: numberOfDays,
      text: numberOfDays < 10 ? `0${numberOfDays}` : numberOfDays,
    });
    numberOfDays -= 1;
  }
  return days.reverse();
};

export default class DateComponent extends React.Component {
  constructor(props) {
    super(props);

    this.state = { days: buildDays(1), error: false };

    this.setDay = this.setDay.bind(this);
    this.setMonth = this.setMonth.bind(this);
    this.setYear = this.setYear.bind(this);
    this.buildDate = this.buildDate.bind(this);
  }

  UNSAFE_componentWillMount() {
    const { value, maxYear } = this.props;
    let day;
    let month;
    let year;

    if (value) {
      const splittedValue = value.split('-');
      day = parseInt(_.get(splittedValue, '[2]'), 0);
      month = parseInt(_.get(splittedValue, '[1]'), 0);
      year = parseInt(_.get(splittedValue, '[0]'), 0);
      this.setState({ day, month, year });
    }

    const years = [];
    const MAX_YEAR = maxYear || new Date().getFullYear();
    let YEAR = 1905;

    while (YEAR <= MAX_YEAR) {
      years.push({
        value: YEAR,
        key: YEAR,
        text: YEAR,
      });
      YEAR += 1;
    }

    years.reverse();
    this.setState({ years });
  }

  setDay(e, data) {
    this.setState({ day: data.value }, this.buildDate);
  }

  setMonth(e, data) {
    this.setState(
      { days: buildDays(data.value), month: data.value },
      this.buildDate
    );
  }

  setYear(e, data) {
    this.setState({ year: data.value }, this.buildDate);
  }

  buildDate() {
    const { day, month, year, error } = this.state;
    const notEmpty = !isNaN(year) && !isNaN(day) && !isNaN(month);
    if (notEmpty) {
      const { onChange, minYear } = this.props;
      const date = moment(`${month}/${day}/${year}`, 'MM/DD/YYYY');
      const minYearValid = moment(`${month}/${day}/${year}`).isBefore(minYear);
      onChange(date);
      if (minYearValid) {
        if (error) this.setState({ error: false });
      } else {
        this.setState({ error: true });
      }
    }
  }

  render() {
    const { setDay, setMonth, setYear } = this;
    const { days, day, month, year, years, error } = this.state;
    const { message } = this.props;
    return (
      <Fragment>
        <Form.Field className="form_field_container_inner date_dropdowns">
          <Form.Field className="form_field_container_inner">
            <Dropdown
              placeholder="MM"
              search
              selection
              defaultValue={month}
              onChange={setMonth}
              options={MONTHS}
            />
          </Form.Field>

          <Form.Field className="form_field_container_inner">
            <Dropdown
              placeholder="DD"
              search
              selection
              defaultValue={day}
              onChange={setDay}
              options={days}
            />
          </Form.Field>

          <Form.Field className="form_field_container_inner">
            <Dropdown
              placeholder="YYYY"
              search
              selection
              defaultValue={year}
              onChange={setYear}
              options={years}
            />
          </Form.Field>
        </Form.Field>
        {error && <div className="date-error">{message}</div>}
      </Fragment>
    );
  }
}
