/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable no-restricted-globals */
import React, { Component } from 'react';
import FullCalendar from 'fullcalendar-reactwrapper';
import cx from 'classnames';
import 'moment-timezone';
import moment from 'moment';
import { TimeInput } from 'semantic-ui-calendar-react';
import { debounce } from 'lodash';
import get from 'lodash/get';
import find from 'lodash/find';
import {
  Container,
  Segment,
  Checkbox,
  Input,
  Grid,
  Button,
  Dropdown,
  Icon,
  Popup,
} from 'semantic-ui-react';
import Select from 'react-select';
import 'react-dates/initialize';
import { SingleDatePicker } from 'react-dates';
import ReactDOM from 'react-dom';
import { toast } from 'react-toastify';
import CopyToClipboard from '../../Elements/CopyToClipboard';
import PlanService from '../../../Services/PlanService';
import history from '../../../history';
import Helpers from '../../Utils/Helpers';
import CategoryIcon from '../../Utils/CategoryIcon';
import UserCategories from '../../Elements/UserCategories';
import ProfileService from '../../../Services/ProfileService';
import DesktopBanner from '../../Elements/DesktopBanner';
import { TrackEvent } from '../../../Services/TrackEvent';

import './Plan.scss';
import Loading from '../../Loading';

const TYPES = {
  CATEGORY: 'category',
  BUDDY: 'buddy',
  YOU: 'you',
};

class Plan extends Component {
  static convert24to12(time) {
    let [hours, minutes] = time.split(':');
    const modifier = +hours < 12 ? 'AM' : 'PM';
    hours = +hours % 12 || 12;
    if (hours < 10) hours = `0${hours}`;
    return `${hours}:${minutes} ${modifier}`;
  }

  static convert12to24(time12h) {
    const [time, modifier] = time12h.split(' ');
    let [hours, minutes] = time.split(':');
    if (hours === '12') hours = '00';
    if (modifier === 'PM') hours = parseInt(hours, 10) + 12;
    return `${hours}:${minutes}`;
  }

  createEvent = debounce(() => {
    if (!this.validateForm('event') || this.state.saving) return;
    this.setState({ saving: true });
    const that = this;
    let timeUTC = this.state.time;
    if (this.state.calendarOptions.timeFormat === 'hh:mm A') {
      timeUTC = Plan.convert12to24(timeUTC);
    }
    const start_date = moment(
      this.state.date
        .hours(timeUTC.split(':')[0])
        .minutes(timeUTC.split(':')[1])
    )
      .utc(false)
      .format('YYYY-MM-DDTHH:mm:ss', true);
    const event = {
      habit: this.state.habit,
      session_duration: this.state.sessionDuration,
      session_unit: this.state.sessionUnit.value,
      start_date: `${start_date}Z`,
      location: this.state.location,
    };

    if (this.state.edit) {
      PlanService.updateEvent(event, this.state.event_pk).then(
        (data) => {
          that.updateEvents(data.events);
          Helpers.createToast(data);
          TrackEvent('plan-event-add');
        },
        (data) => {
          that.setState({ saving: false });
          Helpers.createToast(data);
        }
      );
    } else {
      PlanService.createEvent(event, this.state.event_pk).then(
        (data) => {
          that.updateEvents(data.events);
          Helpers.createToast(data);
          TrackEvent('plan-added-event');
        },
        (data) => {
          that.setState({ saving: false });
          Helpers.createToast(data);
        }
      );
    }
  }, 250);

  clickedEvent = (calEvent) => {
    /** calEvent Params
     * @param calEvent.id
     * @param calEvent.userID
     */
    if (calEvent.start < moment() || calEvent.userID !== this.props.user.pk)
      return;
    this.eventEditor(calEvent.id);
  };

  dayClick = (date) => {
    if (moment() <= moment(date).set({ hour: 23, minute: 59, second: 59 })) {
      this.toggleMode('one-off');
      this.setState({ date: moment(date) });
    }
  };

  clearPlan = debounce(() => {
    if (this.state.saving) return;
    const that = this;

    const sessionUnit =
      this.state.sessionDuration > 1
        ? this.state.sessionUnit.label
        : this.state.sessionUnit.label.slice(0, -1);
    this.setState({ saving: true });
    PlanService.clearPlan(this.state.event_pk)
      .then((data) => {
        that.updateEvents(data.events);
        toast.success(
          `Plan successfully cleared: ${that.state.habit.label} for ${that.state.sessionDuration} ${sessionUnit}`
        );
        TrackEvent('plan-deleted');
      })
      .catch((error) => {
        that.setState({ saving: false });
        console.error(error);
      });
  }, 250);

  toggleMode = (mode, edit = false, event) => {
    if (edit === false) {
      this.resetForm();
    }
    this.setState({
      mode,
      edit,
    });
    window.scrollTo(0, 0);

    event =
      event ||
      (mode === 'new-plan'
        ? 'plan-clicked-create-plan'
        : 'plan-clicked-create-event');

    TrackEvent(event);
  };

  setHabit = (habit) => {
    let otherSelected = false;
    if (habit.value === 'other') otherSelected = true;
    this.setState({
      habit,
      otherSelected,
    });
  };

  setSessionUnit = (sessionUnit) => {
    this.setState({
      sessionUnit,
    });
  };

  setTimeFormat = (timeFormat) => {
    const calendarOptions = this.state.calendarOptions;
    calendarOptions.timeFormat = timeFormat;
    localStorage.setItem('calendarTimeFormat', timeFormat);
    this.changeFormTimeFormats();
    this.forceUpdate();
  };

  setDateFormat = (dateFormat) => {
    const calendarOptions = this.state.calendarOptions;
    calendarOptions.dateFormat = dateFormat;
    localStorage.setItem('calendarDateFormat', dateFormat);
    this.forceUpdate();
  };

  setStartingDay = (startingDay) => {
    const calendarOptions = this.state.calendarOptions;
    calendarOptions.startingDay = startingDay;
    localStorage.setItem('calendarStartingDay', startingDay);
    this.forceUpdate();
  };

  selectCheckbox = (key) => {
    const checkbox = this.state.checkbox;

    let count = 0;

    const stateChanges = {};
    checkbox[key].selected = !checkbox[key].selected;
    stateChanges.checkbox = checkbox;
    for (const i in checkbox) {
      if (checkbox.hasOwnProperty(i) && checkbox[i].selected) {
        count++;
      }
    }
    if (count !== this.state.noOfTimes) {
      stateChanges.noOfTimes = count;
    }

    if (this.state.sameTime) {
      for (const i in checkbox) {
        if (checkbox.hasOwnProperty(i) && checkbox[i].selected) {
          checkbox[i].time = this.state.time;
        }
      }
    }

    if (this.state.samePlace) {
      for (const i in checkbox) {
        if (checkbox.hasOwnProperty(i) && checkbox[i].selected) {
          checkbox[i].location = this.state.location;
        }
      }
    }
    this.setState(stateChanges);
  };

  changeTime = (value, day) => {
    if (
      this.state.calendarOptions.timeFormat === 'hh:mm A' &&
      value.split(' ')[0].split(':')[0] > 12
    )
      return;
    if (day === 'time') {
      this.setState({ time: value });
    } else {
      const checkbox = this.state.checkbox;
      checkbox[day].time = value;
      this.setState({ checkbox });
    }
  };

  setSameTime = (value) => {
    const days = [
      'Monday',
      'Tuesday',
      'Wednesday',
      'Thursday',
      'Friday',
      'Saturday',
      'Sunday',
    ];
    const checkbox = this.state.checkbox;
    for (const day of days) {
      checkbox[day].time = value;
    }
    this.setState({ checkbox, time: value });
  };

  setSameLocation = (event) => {
    const value = event.target.value;

    const days = [
      'Monday',
      'Tuesday',
      'Wednesday',
      'Thursday',
      'Friday',
      'Saturday',
      'Sunday',
    ];

    const checkbox = this.state.checkbox;
    for (const day of days) {
      checkbox[day].location = value;
    }
    this.setState({ checkbox, location: value });
  };

  static getDefaultTime(timeFormat) {
    return timeFormat === 'hh:mm A' ? '12:00 AM' : '12:00';
  }

  clearEvent = debounce(() => {
    if (this.state.saving) return;
    const that = this;

    const sessionUnit =
      this.state.sessionDuration > 1
        ? this.state.sessionUnit.label
        : this.state.sessionUnit.label.slice(0, -1);
    this.setState({ saving: true });
    PlanService.clearEvent(this.state.event_pk)
      .then((data) => {
        that.updateEvents(data.events);
        TrackEvent('plan-event-delete');
        toast.success(
          `Event successfully cleared: ${that.state.habit.label} for ${that.state.sessionDuration} ${sessionUnit}`
        );
      })
      .catch((error) => {
        that.setState({ saving: false });
        console.error(error);
      });
  }, 250);

  createPlan = debounce(() => {
    if (this.state.saving) return;
    if (!this.validateForm('plan')) return;
    this.setState({ saving: true });
    const that = this;
    const checkbox = this.state.checkbox;
    const days = {};
    for (const i in checkbox) {
      if (checkbox.hasOwnProperty(i) && checkbox[i].selected) {
        let timeUTC = this.state.checkbox[i].time;
        if (this.state.calendarOptions.timeFormat === 'hh:mm A') {
          timeUTC = Plan.convert12to24(timeUTC);
        }
        // timeUTC = moment().hours(timeUTC.split(':')[0]).minutes(timeUTC.split(':')[1]).utc(false).format('HH:mm');
        days[i] = {
          time: timeUTC,
          location: this.state.samePlace
            ? this.state.location
            : this.state.checkbox[i].location,
        };
      }
    }
    const plan = {
      habit: this.state.habit.value,
      sessionDuration: this.state.sessionDuration,
      sessionUnit: this.state.sessionUnit.value,
      endDate: this.state.date,
      timezone: moment.tz.guess(),
      days,
    };
    const sessionUnit =
      this.state.sessionDuration > 1
        ? this.state.sessionUnit.label
        : this.state.sessionUnit.label.slice(0, -1);
    PlanService.createPlan(plan)
      .then((data) => {
        that.updateEvents(data.events);
        toast.success(
          `Plan successfully saved: ${that.state.habit.label} for ${that.state.sessionDuration} ${sessionUnit}`
        );
        TrackEvent('plan-added-plan');
      })
      .catch((error) => {
        this.setState({ saving: false });
        console.error(error);
      });
  }, 250);

  constructor(props) {
    super(props);
    const timeFormat = localStorage.getItem('calendarTimeFormat') || 'hh:mm A';
    this.state = {
      active_categories: [],
      categories: [],
      sessionDuration: 1,
      active: [],
      errors: {
        mondayTime: false,
        mondayLocation: false,
        tuesdayTime: false,
        tuesdayLocation: false,
        wednesdayTime: false,
        wednesdayLocation: false,
        thursdayTime: false,
        thursdayLocation: false,
        fridayTime: false,
        fridayLocation: false,
        saturdayTime: false,
        saturdayLocation: false,
        sundayTime: false,
        sundayLocation: false,
      },
      userHabits: [],
      CurrentCategories: [],
      habitCategory: undefined,
      habitName: undefined,
      habits: [],
      otherSelected: false,
      habit: null,
      sessionUnits: [
        {
          value: 1,
          label: 'minutes',
        },
        {
          value: 0,
          label: 'hours',
        },
      ],
      event_pk: null,
      plan_pk: false,
      sessionUnit: {
        value: 0,
        label: 'hours',
      },
      mode: 'default',
      perOptions: [
        {
          value: 'week',
          label: 'week',
        },
      ],
      noOfTimes: 1,
      per: {
        value: 'week',
        label: 'week',
      },
      time_options: [
        { key: 'am', text: 'AM', value: 'am' },
        { key: 'pm', text: 'PM', value: 'pm' },
      ],
      repeat_options: [
        { key: 'weekly', value: 'weekly', label: 'Repeat weekly until' },
      ],
      repeatUntil: null,
      checkbox: {
        Monday: {
          selected: false,
          time: Plan.getDefaultTime(timeFormat),
          location: '',
        },
        Tuesday: {
          selected: false,
          time: Plan.getDefaultTime(timeFormat),
          location: '',
        },
        Wednesday: {
          selected: false,
          time: Plan.getDefaultTime(timeFormat),
          location: '',
        },
        Thursday: {
          selected: false,
          time: Plan.getDefaultTime(timeFormat),
          location: '',
        },
        Friday: {
          selected: false,
          time: Plan.getDefaultTime(timeFormat),
          location: '',
        },
        Saturday: {
          selected: false,
          time: Plan.getDefaultTime(timeFormat),
          location: '',
        },
        Sunday: {
          selected: false,
          time: Plan.getDefaultTime(timeFormat),
          location: '',
        },
      },
      sameTime: false,
      samePlace: false,
      time: Plan.getDefaultTime(timeFormat),
      location: '',
      date: '',
      events: [],
      loading: true,
      calendarOptions: {
        startingDay: localStorage.getItem('calendarStartingDay') || '1',
        timeFormat,
        dateFormat: localStorage.getItem('calendarDateFormat') || 'MM/DD/YYYY',
      },
    };
    this.handleChange = this.handleChange.bind(this);
  }

  resetForm() {
    this.setState({
      sessionDuration: 1,
      errors: {},
      habit: null,
      sessionUnit: {
        value: 0,
        label: 'hours',
      },
      noOfTimes: 1,
      repeatUntil: null,
      checkbox: {
        Monday: {
          selected: false,
          time: Plan.getDefaultTime(this.state.calendarOptions.timeFormat),
          location: '',
        },
        Tuesday: {
          selected: false,
          time: Plan.getDefaultTime(this.state.calendarOptions.timeFormat),
          location: '',
        },
        Wednesday: {
          selected: false,
          time: Plan.getDefaultTime(this.state.calendarOptions.timeFormat),
          location: '',
        },
        Thursday: {
          selected: false,
          time: Plan.getDefaultTime(this.state.calendarOptions.timeFormat),
          location: '',
        },
        Friday: {
          selected: false,
          time: Plan.getDefaultTime(this.state.calendarOptions.timeFormat),
          location: '',
        },
        Saturday: {
          selected: false,
          time: Plan.getDefaultTime(this.state.calendarOptions.timeFormat),
          location: '',
        },
        Sunday: {
          selected: false,
          time: Plan.getDefaultTime(this.state.calendarOptions.timeFormat),
          location: '',
        },
      },
      sameTime: false,
      samePlace: false,
      time: Plan.getDefaultTime(this.state.calendarOptions.timeFormat),
      location: '',
      date: '',
    });
  }

  changeFormTimeFormats() {
    const days = [
      'Monday',
      'Tuesday',
      'Wednesday',
      'Thursday',
      'Friday',
      'Saturday',
      'Sunday',
    ];
    const checkbox = this.state.checkbox;
    for (const day of days) {
      checkbox[day].time =
        this.state.calendarOptions.timeFormat === 'hh:mm A'
          ? Plan.convert24to12(this.state.checkbox[day].time)
          : Plan.convert12to24(this.state.checkbox[day].time);
    }
    this.setState({
      checkbox,
      time:
        this.state.calendarOptions.timeFormat === 'hh:mm A'
          ? Plan.convert24to12(this.state.time)
          : Plan.convert12to24(this.state.time),
    });
  }

  eventRender = (event, element, view) => {
    function getEventIconClass() {
      let iconClass = `tooltipster calendar-icon ${event.className.join(' ')}`;
      const diffDate = moment().diff(event.start, 'minutes');
      if (!event.checkedIn && diffDate >= 1) {
        iconClass += ' unchecked';
      } else if (event.checkedIn) {
        iconClass += ' checked';
      } else if (
        parseInt(event.intention, 10) === 0 ||
        moment() > moment(event.checkInWindowEnd)
      ) {
        iconClass += ` dull ${
          parseInt(event.intention, 10) === 0 ? 'not-ready' : ''
        }`;
      }

      return iconClass;
    }

    /** Event parameters.
     * @param event.checkInWindowEnd
     * @param event.notes
     * @param event.userName
     * @param event.className
     * @param event.intention */

    const icon = (
      <i
        className={getEventIconClass()}
        data-tooltip-content={`#event-${event.id}`}
      />
    );
    const intNote = find(event.notes, ['noteType', 'before']);
    const chkNote = find(event.notes, ['noteType', 'after']);
    const notCompleted =
      !event.checkedIn && moment() > moment(event.checkInWindowEnd);
    const monthEvent = (
      <Popup trigger={icon} position="top center" className="event-tooltip">
        <div>
          <div className="event-tooltip-header">
            <div className="start-time">
              {event.start.format(this.state.calendarOptions.timeFormat)}
            </div>
            <div className="start-date">{event.start.format('ddd D')}</div>
            <div className="user">{event.userName}</div>
          </div>
          <div className="event-tooltip-body">
            <div className="content">
              {CategoryIcon.renderBlackWhiteIcon(event.category.name)}
              <span className="event-title">{event.title}</span>
            </div>
            {(intNote || chkNote) && (
              <div className="notes">
                <h5>
                  {event.userName === 'You' ? 'Your' : event.userName} notes:
                </h5>
                {intNote && (
                  <div className="note">
                    <b>Int: </b>
                    {get(intNote, 'createdAt', '')
                      ? `${moment(get(intNote, 'createdAt', '')).format(
                          'hh:mm a'
                        )} | `
                      : ''}
                    {get(intNote, 'intentionPercentage', 0) === 100
                      ? 'Yes'
                      : 'No'}
                    {get(intNote, 'note', false) ? ` | ${intNote.note}` : ''}
                  </div>
                )}
                {chkNote && (
                  <div className="note">
                    <b>Chk: </b>
                    {get(chkNote, 'createdAt', '')
                      ? `${moment(get(chkNote, 'createdAt', '')).format(
                          'hh:mm a'
                        )} | `
                      : ''}
                    {get(chkNote, 'checkInPercentage', false)
                      ? `${chkNote.checkInPercentage}%`
                      : '0%'}
                    {get(chkNote, 'note', false) ? ` | ${chkNote.note}` : ''}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </Popup>
    );

    const weekEvent = (
      <Popup
        trigger={
          <div className={`week_event ${notCompleted ? 'dull' : ''}`}>
            <div className="event_top_line" />
            <div className="start-time">
              {event.start.format(this.state.calendarOptions.timeFormat)}
            </div>
            <div className="user">
              {CategoryIcon.renderBlackWhiteIcon(event.category.name, {
                fontSize: 17,
                ...(!event.checkedIn && { opacity: 0.3 }),
              })}{' '}
              <p>{event.userName}</p>
            </div>
            <p className="event-title">{event.title}</p>
          </div>
        }
        position="top center"
        className="event-tooltip"
      >
        <div style={{ width: 200 }}>
          <div className="event-tooltip-body">
            <div className="notes">
              <h5>
                {event.userName === 'You' ? 'Your' : event.userName} notes:
              </h5>
              {intNote || chkNote ? (
                <>
                  {intNote && (
                    <div className="note">
                      <b>Int: </b>
                      {get(intNote, 'createdAt', '')
                        ? `${moment(get(intNote, 'createdAt', '')).format(
                            'hh:mm a'
                          )} | `
                        : ''}
                      {get(intNote, 'intentionPercentage', 0) === 100
                        ? 'Yes'
                        : 'No'}
                      {get(intNote, 'note', false) ? ` | ${intNote.note}` : ''}
                    </div>
                  )}
                  {chkNote && (
                    <div className="note">
                      <b>Chk: </b>
                      {get(chkNote, 'createdAt', '')
                        ? `${moment(get(chkNote, 'createdAt', '')).format(
                            'hh:mm a'
                          )} | `
                        : ''}
                      {get(chkNote, 'checkInPercentage', false)
                        ? `${chkNote.checkInPercentage}%`
                        : '0%'}
                      {get(chkNote, 'note', false) ? ` | ${chkNote.note}` : ''}
                    </div>
                  )}
                </>
              ) : (
                'No note.'
              )}
            </div>
          </div>
        </div>
      </Popup>
    );

    const currentView = view.name;

    switch (currentView) {
      case 'month':
        ReactDOM.render(monthEvent, element[0]);
        break;
      case 'basicWeek':
        ReactDOM.render(weekEvent, element[0]);
        break;
      case 'agendaDay':
        ReactDOM.render(monthEvent, element[0]);
        break;
      default:
        ReactDOM.render(monthEvent, element[0]);
    }
  };

  handleChange(event) {
    if (event.target.id === 'noOfTimes') {
      this.setState({
        noOfTimes: event.target.value,
      });
    } else if (event.target.id === 'date') {
      this.setState({
        date: event.target.value,
      });
    } else if (event.target.id === 'sessionDuration') {
      this.setState({
        sessionDuration: event.target.value,
      });
    } else if (event.target.id === 'location') {
      this.setState({
        location: event.target.value,
      });
    } else if (event.target.id === 'time') {
      this.setState({
        time: event.target.value,
      });
    } else {
      const checkbox = this.state.checkbox;
      checkbox[event.target.id].location = event.target.value;
      this.setState({
        checkbox,
      });
    }
  }

  validateForm(type) {
    const days = [
      'Monday',
      'Tuesday',
      'Wednesday',
      'Thursday',
      'Friday',
      'Saturday',
      'Sunday',
    ];
    const errors = {};
    const checkbox = this.state.checkbox;
    if (this.state.habit === null || this.state.habit === '') {
      errors.habit = 'Please select a habit.';
    }
    if (this.state.sessionUnit === null || this.state.sessionUnit === '') {
      errors.sessionUnit = 'Please set session unit.';
    }
    if (
      this.state.sessionDuration === null ||
      this.state.sessionDuration === ''
    ) {
      errors.sessionDuration = 'Please set session duration.';
    }
    if (this.state.date === null || this.state.date === '') {
      errors.date = 'Please set a date.';
    }
    if (type === 'event') {
      if (this.state.location === null || this.state.location === '') {
        errors.location = 'Please set a location.';
      }
    } else if (type === 'plan') {
      if (this.state.noOfTimes === null || this.state.noOfTimes === '') {
        errors.noOfTimes = 'Please set number of times.';
      }
      for (const day of days) {
        if (
          (checkbox[day].time === null || checkbox[day].time === '') &&
          checkbox[day].selected
        ) {
          errors[`${day.toLowerCase()}Time`] = `Please set ${day}'s time.`;
        }
        if (
          (checkbox[day].location === null || checkbox[day].location === '') &&
          checkbox[day].selected
        ) {
          errors[
            `${day.toLowerCase()}Location`
          ] = `Please set ${day}'s location.`;
        }
      }
      let count = 0;
      for (const i in checkbox) {
        if (checkbox.hasOwnProperty(i) && checkbox[i].selected) {
          count++;
        }
      }
      if (count !== parseInt(this.state.noOfTimes, 10)) {
        errors.noOfTimes =
          'Oops! The amount of days you selected is different than your plan.';
        toast.error(errors.noOfTimes);
      }
    }
    this.setState({ errors });
    const valid = Object.keys(errors).length === 0;
    if (!valid) toast.error('Please fill out all highlighted fields.');
    return valid;
  }

  planEditor(event_id) {
    const that = this;
    TrackEvent('plan-edit-start');
    PlanService.getPlanConfiguration(event_id)
      .then((data) => {
        const times = [];

        const locations = [];
        Object.keys(data.days).forEach((key) => {
          let time = data.days[key].time;

          const location = data.days[key].location;
          time = moment
            .utc()
            .set({ h: data.time.split(':')[0], m: data.time.split(':')[1] })
            .local()
            .format(that.state.calendarOptions.timeFormat);

          that.state.checkbox[key].selected = true;
          that.state.checkbox[key].time = time;
          that.state.checkbox[key].location = location;
          times.push(time);
          locations.push(location);
        });
        const same_time = times.every((val, i, arr) => val === arr[0]);

        const same_location = locations.every((val, i, arr) => val === arr[0]);
        that.setState({
          event_pk: data.pk,
          plan_pk: data.plan,
          habit: data.habit,
          sessionUnit: data.session_unit,
          noOfTimes: data.no_times,
          date: moment(data.repeated_until),
          sessionDuration: data.session_duration,
          sameTime: same_time,
          samePlace: same_location,
          location: same_location ? locations[0] : '',
          time: same_time
            ? times[0]
            : Plan.getDefaultTime(that.state.calendarOptions.timeFormat),
        });
        that.toggleMode('new-plan', true);
      })
      .catch((e) => {
        console.error(e);
      });
  }

  eventEditor(event_id) {
    const that = this;
    PlanService.getPlanConfiguration(event_id)
      .then((data) => {
        /** @namespace data.habit * */
        /** @namespace data.plan * */
        /** @namespace data.session_unit * */
        /** @namespace data.no_times * */
        /** @namespace data.repeated_until * */
        /** @namespace data.session_duration * */
        const timeUTC = moment
          .utc()
          .set({ h: data.time.split(':')[0], m: data.time.split(':')[1] })
          .local()
          .format(that.state.calendarOptions.timeFormat);
        that.setState({
          event_pk: data.pk,
          plan_pk: !!data.plan,
          habit: data.habit,
          sessionUnit: data.session_unit,
          noOfTimes: data.no_times,
          sessionDuration: data.session_duration,
          location: data.location,
          date: moment.utc(data.datetime).local(),
          time: timeUTC,
        });
        that.toggleMode('one-off', true);
      })
      .catch(() => {
        toast.error('The requested event could not be found.');
        history.push('/plan');
        that.toggleMode('default');
      });
  }

  componentDidMount() {
    const { user, match } = this.props;
    const that = this;
    Promise.all([
      PlanService.getUserHabit(),
      PlanService.getHabits(),
      ProfileService.getUserCategoriesAndBuddies(user.pk),
    ])
      .then(([userHabits, cats, CurrentCategories]) => {
        const data = cats;
        const categories = data.map((e) => ({ value: e.pk, label: e.label }));
        data.push({
          label: 'Other',
          options: [{ value: 'other', label: 'Other' }],
        });
        that.setState({
          userHabits,
          habits: data,
          categories,
          CurrentCategories,
          loading: false,
        });
        if (match.params.id !== undefined) {
          if (isNaN(match.params.id)) {
            this.toggleMode(match.params.id);
          } else {
            this.eventEditor(match.params.id);
          }
        }
      })
      .catch((error) => {
        console.error(error);
      });
  }

  updateEvents(__, canChangeMode = true) {
    /** @param events.buddy_name */
    /** @param events.buddy_pk */
    const data = {
      saving: false,
    };
    if (canChangeMode) data.mode = 'default';
    this.setState(data);
  }

  onChangeActive = (active) => {
    this.setState((prevState) => ({
      active: prevState.active.includes(active)
        ? prevState.active.filter((e) => e !== active)
        : [...prevState.active, active],
    }));
  };

  handleHabitInputChange(event) {
    const habit = this.state.habit;
    habit.name = event.target.value;
    this.setState({ habit });
  }

  handleHabitCategoryChange(value) {
    const habit = this.state.habit;
    habit.category = value;
    this.setState({ habit });
  }

  getFiltered = (data, active) =>
    data.filter(
      (e) =>
        !active.some((filter) => {
          const [type, value] = filter.split('/');
          const parsedValue = value
            .replace('&', '-')
            .replace(/\s/g, '')
            .toLowerCase();
          switch (type) {
            case TYPES.BUDDY:
              return e.userName === value;
            case TYPES.CATEGORY:
              return e.category.name === parsedValue;
            case TYPES.YOU:
              return e.category.name === parsedValue && e.userName === 'You';
            default:
              return false;
          }
        })
    );

  getEvents = async (start, end, tz, callback) => {
    const { active } = this.state;
    const formatedStart = start.format('YYYY-MM-DD');
    const formatedEnd = end.format('YYYY-MM-DD');
    try {
      const res = await PlanService.getPlans(formatedStart, formatedEnd);
      const filtered = this.getFiltered(res, active);
      callback(filtered);
    } catch (e) {
      callback([]);
    }
  };

  render() {
    const { CurrentCategories, loading, mode, active } = this.state;
    if (loading) return <Loading />;
    return (
      <div
        id="plan"
        className="bg grey plan"
        style={{ paddingTop: '0px', paddingBottom: '0px' }}
      >
        <DesktopBanner />
        <div className="page">
          <h2 className="title">Your Plan</h2>
          <Container className="header-container">
            <UserCategories
              activeCategories={CurrentCategories}
              onChangeActive={this.onChangeActive}
              active={active}
            />
            <p
              style={{ display: mode === 'default' ? '' : 'none' }}
              className="center create-plan"
            >
              <Button
                onClick={() => this.toggleMode('new-plan')}
                color="orange"
              >
                Create a Plan
              </Button>{' '}
              or{' '}
              <Button onClick={() => this.toggleMode('one-off')} color="orange">
                Create an Event
              </Button>
            </p>
          </Container>
          <Container>
            <Segment
              style={{
                display: this.state.mode === 'one-off' ? '' : 'none',
                position: 'relative',
              }}
              className="portlet"
            >
              <form
                onSubmit={(evt) => {
                  evt.preventDefault();
                }}
              >
                <Grid>
                  <Grid.Column tablet={16} className="event">
                    <div
                      className="clickable"
                      onClick={() => this.setState({ mode: 'default' })}
                      style={{
                        position: 'absolute',
                        top: '15px',
                        right: '25px',
                      }}
                    >
                      <i className="fas fa-times" />
                    </div>
                    <h3 style={{ textAlign: 'center' }}>
                      {this.state.edit && (
                        <React.Fragment>Edit a one off event</React.Fragment>
                      )}
                      {!this.state.edit && (
                        <React.Fragment>Create a one off event</React.Fragment>
                      )}
                    </h3>

                    <h3 className="inline small">
                      What habit do you intend to do?
                      <div className="want">
                        <h3 className="inline">I want to </h3>
                        <div className="select-holder inline">
                          <Select
                            className={`small ${
                              this.state.errors.habit && 'is-invalid'
                            }`}
                            value={this.state.habit}
                            onChange={this.setHabit}
                            options={this.state.habits}
                          />
                        </div>
                        {this.state.otherSelected ? (
                          <React.Fragment>
                            <div className="select-holder inline">
                              <label htmlFor="name">Custom habit name: </label>{' '}
                              <input
                                type="text"
                                id="name"
                                value={this.state.habitName}
                                onChange={(event) =>
                                  this.handleHabitInputChange(event)
                                }
                              />
                            </div>
                            <div className="select-holder inline">
                              <label htmlFor="category">
                                Custom habit category:{' '}
                              </label>{' '}
                              <Select
                                id="category"
                                value={this.state.habitCategory}
                                onChange={this.handleHabitCategoryChange.bind(
                                  this
                                )}
                                options={this.state.categories}
                              />
                            </div>
                          </React.Fragment>
                        ) : (
                          <React.Fragment />
                        )}
                        <h3 className="inline">for</h3>

                        <input
                          id="sessionDuration"
                          className={`inline ${
                            this.state.errors.habit && 'is-invalid'
                          }`}
                          type="number"
                          min="1"
                          value={this.state.sessionDuration}
                          onChange={this.handleChange}
                        />

                        <div className="select-holder inline hours">
                          <Select
                            className={`small ${
                              this.state.errors.sessionUnit && 'is-invalid'
                            }`}
                            value={this.state.sessionUnit}
                            onChange={this.setSessionUnit}
                            options={this.state.sessionUnits}
                          />
                        </div>
                      </div>
                    </h3>

                    <div>
                      <h3 className="inline">
                        When do you intend to it?
                        <span>
                          <span
                            className={
                              this.state.errors.date && 'is-invalid-child'
                            }
                          >
                            <SingleDatePicker
                              date={this.state.date || null}
                              onDateChange={(date) => this.setState({ date })}
                              focused={this.state.focused}
                              displayFormat={
                                this.state.calendarOptions.dateFormat
                              }
                              onFocusChange={({ focused }) =>
                                this.setState({ focused })
                              }
                              id="eventDate"
                              placeholder="Select a date"
                              firstDayOfWeek={parseInt(
                                this.state.calendarOptions.startingDay,
                                10
                              )}
                              small
                              showDefaultInputIcon
                            />
                          </span>
                          <div className="ui input">
                            <TimeInput
                              id="time"
                              className={cx(
                                'location',
                                this.state.errors.time && 'is-invalid-child'
                              )}
                              type="time"
                              closable
                              timeFormat="AMPM"
                              style={{ marginLeft: '30px' }}
                              value={Plan.convert12to24(this.state.time)}
                              onChange={(_, { value }) =>
                                this.changeTime(value, 'time')
                              }
                            />
                          </div>
                        </span>
                      </h3>
                    </div>

                    <div className="event-where">
                      <h3 className="inline where-title">Where?</h3>
                      <span className="where-location">
                        <Input
                          className={
                            this.state.errors.location && 'is-invalid-child'
                          }
                          id="location"
                          placeholder="In the park... at home..."
                          value={this.state.location}
                          onChange={this.handleChange}
                        />
                      </span>
                    </div>

                    <Button
                      disabled={this.state.saving && 'disabled'}
                      style={{ float: 'right' }}
                      onClick={() => this.createEvent()}
                      color="orange"
                    >
                      Add Event
                    </Button>
                    {this.state.edit && (
                      <React.Fragment>
                        <Button
                          disabled={this.state.saving && 'disabled'}
                          style={{ float: 'right' }}
                          onClick={() => this.clearEvent()}
                          color="orange"
                        >
                          <i className="fas fa-trash-alt" /> Delete Event
                        </Button>
                      </React.Fragment>
                    )}
                    {this.state.edit && this.state.plan_pk && (
                      <React.Fragment>
                        <Button
                          style={{ float: 'right' }}
                          onClick={() => this.planEditor(this.state.event_pk)}
                          color="orange"
                        >
                          Edit Plan
                        </Button>
                      </React.Fragment>
                    )}
                  </Grid.Column>
                </Grid>
              </form>
            </Segment>

            <Segment
              style={{
                display: this.state.mode === 'new-plan' ? '' : 'none',
                position: 'relative',
              }}
              className="portlet"
            >
              <form
                onSubmit={(evt) => {
                  evt.preventDefault();
                }}
              >
                <h3 style={{ textAlign: 'center' }}>
                  {this.state.edit && <React.Fragment>Edit</React.Fragment>}
                  {!this.state.edit && (
                    <React.Fragment>Create</React.Fragment>
                  )}{' '}
                  a plan
                </h3>
                <div
                  className="clickable"
                  onClick={() => this.setState({ mode: 'default' })}
                  style={{ position: 'absolute', top: '15px', right: '25px' }}
                >
                  <i className="fas fa-times" />
                </div>
                <h3>What habit do you intend to do?</h3>
                <div className="want">
                  <div className="intent_block">
                    <p className="inline">I intend to </p>
                    <div className="select-holder inline">
                      <Select
                        className={this.state.errors.habit && 'is-invalid'}
                        value={this.state.habit}
                        onChange={this.setHabit}
                        options={this.state.userHabits}
                      />
                    </div>
                  </div>
                  <div className="intent_block">
                    <input
                      id="noOfTimes"
                      className={`inline ${
                        this.state.errors.noOfTimes && 'is-invalid'
                      }`}
                      type="number"
                      min="1"
                      value={this.state.noOfTimes}
                      onChange={this.handleChange}
                    />
                    <p className="inline">times per week for</p>
                  </div>
                  <div className="intent_block">
                    <input
                      id="sessionDuration"
                      className={`inline ${
                        this.state.errors.sessionDuration && 'is-invalid'
                      }`}
                      type="number"
                      min="1"
                      value={this.state.sessionDuration}
                      onChange={this.handleChange}
                    />
                    <div className="select-holder inline">
                      <Select
                        className={`hours ${
                          this.state.errors.sessionUnit && 'is-invalid'
                        }`}
                        value={this.state.sessionUnit}
                        onChange={this.setSessionUnit}
                        options={this.state.sessionUnits}
                      />
                    </div>
                    <p className="inline">per session.</p>
                  </div>
                  <div className="time-divider" />
                </div>

                <h3 className="inline when-intend">
                  When do you intend to do it?
                  <span className="where">Where?</span>
                </h3>

                <Grid className="when-days">
                  <Grid.Column tablet={11}>
                    <div className="same">
                      <div>
                        <Checkbox
                          label="Same time every day"
                          onClick={() =>
                            this.setState({ sameTime: !this.state.sameTime })
                          }
                          checked={this.state.sameTime}
                        />
                        <div
                          style={{ display: this.state.sameTime ? '' : 'none' }}
                        >
                          <TimeInput
                            id="time"
                            type="time"
                            className="location"
                            closable
                            value={Plan.convert12to24(this.state.time)}
                            timeFormat="AMPM"
                            onChange={(_, { value }) => this.setSameTime(value)}
                          />
                        </div>
                      </div>
                      <div>
                        <Checkbox
                          label="Same place every day"
                          onClick={() =>
                            this.setState({ samePlace: !this.state.samePlace })
                          }
                          checked={this.state.samePlace}
                        />
                        <Input
                          style={{
                            display: this.state.samePlace ? '' : 'none',
                          }}
                          id="location"
                          className="location"
                          placeholder="type in a place..."
                          value={this.state.location}
                          onChange={this.setSameLocation}
                        />
                      </div>

                      <div className="time-divider" />
                    </div>
                    <table className="table table-borderless">
                      <tbody>
                        <tr>
                          <td className="day">
                            <Checkbox
                              label="Monday"
                              onClick={() => this.selectCheckbox('Monday')}
                              checked={this.state.checkbox.Monday.selected}
                              className={
                                this.state.errors.noOfTimes &&
                                'is-invalid-checkbox'
                              }
                            />
                          </td>
                          <td
                            className="when-where-info"
                            style={{
                              display: this.state.checkbox.Monday.selected
                                ? ''
                                : 'none',
                            }}
                          >
                            <div className="ui input">
                              <TimeInput
                                id="Monday"
                                timeFormat="AMPM"
                                className={cx(
                                  'location',
                                  this.state.errors.mondayTime
                                    ? 'is-invalid-child'
                                    : ''
                                )}
                                type="time"
                                closable
                                value={Plan.convert12to24(
                                  this.state.checkbox.Monday.time
                                )}
                                onChange={(_, { value }) =>
                                  this.changeTime(value, 'Monday')
                                }
                              />
                            </div>
                            <Input
                              className={
                                this.state.errors.mondayLocation
                                  ? 'is-invalid-child'
                                  : ''
                              }
                              id="Monday"
                              placeholder="type in a place..."
                              value={this.state.checkbox.Monday.location}
                              onChange={this.handleChange}
                            />
                          </td>
                        </tr>
                        <tr>
                          <td className="day">
                            <Checkbox
                              label="Tuesday"
                              onClick={() => this.selectCheckbox('Tuesday')}
                              checked={this.state.checkbox.Tuesday.selected}
                              className={
                                this.state.errors.noOfTimes &&
                                'is-invalid-checkbox'
                              }
                            />
                          </td>
                          <td
                            className="when-where-info"
                            style={{
                              display: this.state.checkbox.Tuesday.selected
                                ? ''
                                : 'none',
                            }}
                          >
                            <div className="ui input">
                              <TimeInput
                                id="Tuesday"
                                timeFormat="AMPM"
                                className={cx(
                                  'location',
                                  this.state.errors.tuesdayTime
                                    ? 'is-invalid-child'
                                    : ''
                                )}
                                type="time"
                                closable
                                value={Plan.convert12to24(
                                  this.state.checkbox.Tuesday.time
                                )}
                                onChange={(_, { value }) =>
                                  this.changeTime(value, 'Tuesday')
                                }
                              />
                            </div>
                            <Input
                              id="Tuesday"
                              className={
                                this.state.errors.tuesdayLocation
                                  ? 'is-invalid-child'
                                  : ''
                              }
                              placeholder="type in a place..."
                              value={this.state.checkbox.Tuesday.location}
                              onChange={this.handleChange}
                            />
                          </td>
                        </tr>
                        <tr>
                          <td className="day">
                            <Checkbox
                              label="Wednesday"
                              onClick={() => this.selectCheckbox('Wednesday')}
                              checked={this.state.checkbox.Wednesday.selected}
                              className={
                                this.state.errors.noOfTimes &&
                                'is-invalid-checkbox'
                              }
                            />
                          </td>
                          <td
                            className="when-where-info"
                            style={{
                              display: this.state.checkbox.Wednesday.selected
                                ? ''
                                : 'none',
                            }}
                          >
                            <div className="ui input">
                              <TimeInput
                                id="Wednesday"
                                closable
                                timeFormat="AMPM"
                                className={cx(
                                  'location',
                                  this.state.errors.wednesdayTime
                                    ? 'is-invalid-child'
                                    : ''
                                )}
                                type="time"
                                value={Plan.convert12to24(
                                  this.state.checkbox.Wednesday.time
                                )}
                                onChange={(_, { value }) =>
                                  this.changeTime(value, 'Wednesday')
                                }
                              />
                            </div>
                            <Input
                              id="Wednesday"
                              className={
                                this.state.errors.wednesdayLocation
                                  ? 'is-invalid-child'
                                  : ''
                              }
                              placeholder="type in a place..."
                              value={this.state.checkbox.Wednesday.location}
                              onChange={this.handleChange}
                            />
                          </td>
                        </tr>
                        <tr>
                          <td className="day">
                            <Checkbox
                              label="Thursday"
                              onClick={() => this.selectCheckbox('Thursday')}
                              checked={this.state.checkbox.Thursday.selected}
                              className={
                                this.state.errors.noOfTimes &&
                                'is-invalid-checkbox'
                              }
                            />
                          </td>
                          <td
                            className="when-where-info"
                            style={{
                              display: this.state.checkbox.Thursday.selected
                                ? ''
                                : 'none',
                            }}
                          >
                            <div className="ui input">
                              <TimeInput
                                id="Thursday"
                                timeFormat="AMPM"
                                className={cx(
                                  'location',
                                  this.state.errors.thursdayTime
                                    ? 'is-invalid-child'
                                    : ''
                                )}
                                type="time"
                                closable
                                value={Plan.convert12to24(
                                  this.state.checkbox.Thursday.time
                                )}
                                onChange={(_, { value }) =>
                                  this.changeTime(value, 'Thursday')
                                }
                              />
                            </div>
                            <Input
                              id="Thursday"
                              className={
                                this.state.errors.thursdayLocation
                                  ? 'is-invalid-child'
                                  : ''
                              }
                              placeholder="type in a place..."
                              value={this.state.checkbox.Thursday.location}
                              onChange={this.handleChange}
                            />
                          </td>
                        </tr>
                        <tr>
                          <td className="day">
                            <Checkbox
                              label="Friday"
                              onClick={() => this.selectCheckbox('Friday')}
                              checked={this.state.checkbox.Friday.selected}
                              className={
                                this.state.errors.noOfTimes &&
                                'is-invalid-checkbox'
                              }
                            />
                          </td>
                          <td
                            className="when-where-info"
                            style={{
                              display: this.state.checkbox.Friday.selected
                                ? ''
                                : 'none',
                            }}
                          >
                            <div className="ui input">
                              <TimeInput
                                id="Friday"
                                timeFormat="AMPM"
                                className={cx(
                                  'location',
                                  this.state.errors.fridayTime
                                    ? 'is-invalid-child'
                                    : ''
                                )}
                                type="time"
                                closable
                                value={Plan.convert12to24(
                                  this.state.checkbox.Friday.time
                                )}
                                onChange={(_, { value }) =>
                                  this.changeTime(value, 'Friday')
                                }
                              />
                            </div>
                            <Input
                              id="Friday"
                              className={
                                this.state.errors.fridayLocation
                                  ? 'is-invalid-child'
                                  : ''
                              }
                              placeholder="type in a place..."
                              value={this.state.checkbox.Friday.location}
                              onChange={this.handleChange}
                            />
                          </td>
                        </tr>
                        <tr>
                          <td className="day">
                            <Checkbox
                              label="Saturday"
                              onClick={() => this.selectCheckbox('Saturday')}
                              checked={this.state.checkbox.Saturday.selected}
                              className={
                                this.state.errors.noOfTimes &&
                                'is-invalid-checkbox'
                              }
                            />
                          </td>
                          <td
                            className="when-where-info"
                            style={{
                              display: this.state.checkbox.Saturday.selected
                                ? ''
                                : 'none',
                            }}
                          >
                            <div className="ui input">
                              <TimeInput
                                id="Saturday"
                                timeFormat="AMPM"
                                className={cx(
                                  'location',
                                  this.state.errors.saturdayTime
                                    ? 'is-invalid-child'
                                    : ''
                                )}
                                type="time"
                                closable
                                value={Plan.convert12to24(
                                  this.state.checkbox.Saturday.time
                                )}
                                onChange={(_, { value }) =>
                                  this.changeTime(value, 'Saturday')
                                }
                              />
                            </div>
                            <Input
                              id="Saturday"
                              className={
                                this.state.errors.saturdayLocation
                                  ? 'is-invalid-child'
                                  : ''
                              }
                              placeholder="type in a place..."
                              value={this.state.checkbox.Saturday.location}
                              onChange={this.handleChange}
                            />
                          </td>
                        </tr>
                        <tr>
                          <td className="day">
                            <Checkbox
                              label="Sunday"
                              onClick={() => this.selectCheckbox('Sunday')}
                              checked={this.state.checkbox.Sunday.selected}
                              className={
                                this.state.errors.noOfTimes &&
                                'is-invalid-checkbox'
                              }
                            />
                          </td>
                          <td
                            className="when-where-info"
                            style={{
                              display: this.state.checkbox.Sunday.selected
                                ? ''
                                : 'none',
                            }}
                          >
                            <div className="ui input">
                              <TimeInput
                                id="Sunday"
                                timeFormat="AMPM"
                                className={cx(
                                  'location',
                                  this.state.errors.sundayTime
                                    ? 'is-invalid-child'
                                    : ''
                                )}
                                type="time"
                                closable
                                value={Plan.convert12to24(
                                  this.state.checkbox.Sunday.time
                                )}
                                onChange={(_, { value }) =>
                                  this.changeTime(value, 'Sunday')
                                }
                              />
                            </div>
                            <Input
                              id="Sunday"
                              className={
                                this.state.errors.sundayLocation
                                  ? 'is-invalid-child'
                                  : ''
                              }
                              placeholder="type in a place..."
                              value={this.state.checkbox.Sunday.location}
                              onChange={this.handleChange}
                            />
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </Grid.Column>
                </Grid>
                <div className="how-long">
                  <div className="time-divider" />
                  <div
                    className={this.state.errors.date ? 'is-invalid-child' : ''}
                  >
                    <h3>Until when do you want to try this plan?</h3>
                    <SingleDatePicker
                      date={this.state.date || null}
                      onDateChange={(date) => this.setState({ date })}
                      focused={this.state.focused2}
                      openDirection="up"
                      displayFormat={this.state.calendarOptions.dateFormat}
                      onFocusChange={({ focused: focused2 }) =>
                        this.setState({ focused2 })
                      }
                      small
                      showDefaultInputIcon
                      id="planDate"
                      numberOfMonths={1}
                      placeholder="Select a date"
                      firstDayOfWeek={parseInt(
                        this.state.calendarOptions.startingDay,
                        10
                      )}
                    />
                    <div>
                      <span className="info-text">
                        This information will be shown only to your buddy
                      </span>
                    </div>
                    <Button
                      disabled={this.state.saving && 'disabled'}
                      style={{ float: 'right' }}
                      onClick={() => this.createPlan()}
                      color="orange"
                    >
                      {this.state.edit && (
                        <React.Fragment>
                          <i className="fas fa-pencil-alt" /> Save Plan
                        </React.Fragment>
                      )}
                      {!this.state.edit && (
                        <React.Fragment>
                          <i className="fas fa-plus-circle" /> Add Plan
                        </React.Fragment>
                      )}
                    </Button>
                    {this.state.edit && (
                      <React.Fragment>
                        <Button
                          disabled={this.state.saving && 'disabled'}
                          style={{ float: 'right' }}
                          onClick={() => this.clearPlan()}
                          color="orange"
                        >
                          <i className="fas fa-trash-alt" /> Delete Plan
                        </Button>
                      </React.Fragment>
                    )}
                  </div>
                </div>
                <div
                  className={cx(
                    'create-plan-bottom-warning',
                    this.state.errors.date && 'is-invalid-child'
                  )}
                >
                  <span className="info-text">
                    You may only edit your future planned events.
                  </span>
                </div>
              </form>
            </Segment>
            <p
              style={{
                display: this.state.mode === 'new-plan' ? '' : 'none',
                textAlign: 'right',
              }}
              className="center create-plan"
            >
              or{' '}
              <Button onClick={() => this.toggleMode('one-off')} color="orange">
                Create an Event
              </Button>
            </p>
            <p
              style={{
                display: this.state.mode === 'one-off' ? '' : 'none',
                textAlign: 'right',
              }}
              className="center create-plan"
            >
              or{' '}
              <Button
                onClick={() =>
                  this.toggleMode('new-plan', false, 'plan-event-create-plan')
                }
                color="orange"
              >
                Create a Plan
              </Button>
            </p>

            {this.state.mode === 'default' && (
              <Segment className="portlet" id="calendar_container">
                <div className="dropdown calendarOptions">
                  <Dropdown
                    icon={<Icon name="cog" className="optionToggleIcon" />}
                    upward={false}
                    floating
                    className="icon"
                  >
                    <Dropdown.Menu direction="left">
                      <Dropdown.Header content="Week start on:" />
                      <Dropdown.Item>
                        <Button
                          className={`${
                            this.state.calendarOptions.startingDay === '1' &&
                            'active'
                          }`}
                          onClick={() => this.setStartingDay('1')}
                        >
                          Monday
                        </Button>
                        <Button
                          className={`${
                            this.state.calendarOptions.startingDay === '0' &&
                            'active'
                          }`}
                          onClick={() => this.setStartingDay('0')}
                        >
                          Sunday
                        </Button>
                      </Dropdown.Item>
                      <Dropdown.Header content="Date format:" />
                      <Dropdown.Item>
                        <Button
                          className={`${
                            this.state.calendarOptions.dateFormat ===
                              'DD/MM/YYYY' && 'active'
                          }`}
                          onClick={() => this.setDateFormat('DD/MM/YYYY')}
                        >
                          Day/Month/Year
                        </Button>
                      </Dropdown.Item>
                      <Dropdown.Item>
                        <Button
                          className={`${
                            this.state.calendarOptions.dateFormat ===
                              'MM/DD/YYYY' && 'active'
                          }`}
                          onClick={() => this.setDateFormat('MM/DD/YYYY')}
                        >
                          Month/Day/Year
                        </Button>
                      </Dropdown.Item>
                      <Dropdown.Item>
                        <Button
                          className={`${
                            this.state.calendarOptions.dateFormat ===
                              'YYYY.MM.DD.' && 'active'
                          }`}
                          onClick={() => this.setDateFormat('YYYY.MM.DD.')}
                        >
                          Year.Month.Day.
                        </Button>
                      </Dropdown.Item>
                      <Dropdown.Header content="Time format:" />
                      <Dropdown.Item>
                        <Button
                          className={`${
                            this.state.calendarOptions.timeFormat ===
                              'hh:mm A' && 'active'
                          }`}
                          onClick={() => this.setTimeFormat('hh:mm A')}
                        >
                          12-hour
                        </Button>
                        <Button
                          className={`${
                            this.state.calendarOptions.timeFormat === 'HH:mm' &&
                            'active'
                          }`}
                          onClick={() => this.setTimeFormat('HH:mm')}
                        >
                          24-hour
                        </Button>
                      </Dropdown.Item>
                    </Dropdown.Menu>
                  </Dropdown>
                </div>
                <div className="ical-feed">
                  <CopyToClipboard
                    toCopy={this.props.user.ical_feed}
                    Success={
                      <span className="copied-link">
                        Copied to clipboard
                        <br />
                        <a
                          href="https://mcb.berkeley.edu/academic-programs/seminars/ical-feed-instructions"
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          Instructions how to use
                        </a>
                      </span>
                    }
                  >
                    <Button color="orange">Add GMB to Your Calendar</Button>
                  </CopyToClipboard>
                  <br />
                </div>
                <FullCalendar
                  id="plan-calendar"
                  timezone="local"
                  firstDay={this.state.calendarOptions.startingDay}
                  timeFormat={this.state.calendarOptions.timeFormat}
                  dayClick={this.dayClick}
                  contentHeight="auto"
                  header={{
                    left: 'basicWeek,month',
                    center: 'prev,title,next',
                    right: '',
                  }}
                  views={{
                    month: {
                      // name of view
                      titleFormat: 'MMMM YYYY',
                      // other view-specific options here
                    },
                    basicWeek: {
                      // name of view
                      titleFormat: 'DD MMM YYYY',
                      columnFormat: 'ddd',
                      height: 650,
                      // other view-specific options here
                    },
                    agendaDay: {
                      // name of view
                      titleFormat: 'dddd DD, MMM',
                      column: 'dddd',
                      // other view-specific options here
                    },
                  }}
                  eventRender={this.eventRender}
                  eventClick={this.clickedEvent}
                  navLinks
                  events={this.getEvents}
                />
              </Segment>
            )}
          </Container>
        </div>
      </div>
    );
  }
}

export default Plan;
