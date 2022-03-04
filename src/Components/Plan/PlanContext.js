import React, { useState, createContext } from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import { VIEWS } from './Toolbar/utils';

const defaultStartingDay = localStorage.getItem('calendarStartingDay') || 1;
const defaultState = {
  inactiveCategories: [],
  startingDay: Number(defaultStartingDay),
  timeFormat: localStorage.getItem('calendarTimeFormat') || 'hh:mm a',
  dateFormat: localStorage.getItem('calendarDateFormat') || 'MM/DD/YYYY',
  defaultView: localStorage.getItem('calendarView') || VIEWS.month,
  view: localStorage.getItem('calendarView') || VIEWS.month,
  openFilters: false,
  openOptions: false,
  openNotifications: false,
};

moment.updateLocale('en', {
  week: {
    dow: defaultState.startingDay,
  },
});
const PlanContext = createContext({
  ...defaultState,
  onChangeView: () => {},
  toggleOpenFilters: () => {},
  toggleOpenOptions: () => {},
  toggleOpenNotifications: () => {},
  onChangeActiveFilter: () => {},
  onChangeStartingDay: () => {},
  onChangeDateFormat: () => {},
  onChangeTimeFormat: () => {},
  onChangeDefaultView: () => {},
});

export const Provider = ({ children }) => {
  const [startingDay, setStartingDay] = useState(defaultState.startingDay);
  const [dateFormat, setDateFormat] = useState(defaultState.dateFormat);
  const [defaultView, setDefaultView] = useState(defaultState.defaultView);
  const [timeFormat, setTimeFormat] = useState(defaultState.timeFormat);
  const [openFilters, setOpenFilters] = useState(defaultState.openFilters);
  const [openNotifications, setOpenNotifications] = useState(
    defaultState.openNotifications
  );
  const [openOptions, setOpenOptions] = useState(defaultState.openOptions);
  const [view, setView] = useState(defaultState.view);
  const [inactiveCategories, setInactiveCategories] = useState(
    defaultState.inactiveCategories
  );

  function onChangeDefaultView(newView) {
    localStorage.setItem('calendarView', newView);
    setDefaultView(newView);
  }
  function onChangeView(newView) {
    setView(newView);
  }
  function toggleOpenFilters() {
    setOpenFilters(!openFilters);
  }
  function toggleOpenNotifications() {
    setOpenNotifications(!openNotifications);
  }
  function toggleOpenOptions() {
    setOpenOptions(!openOptions);
  }
  function onChangeActiveFilter(active) {
    const cats = inactiveCategories.includes(active)
      ? inactiveCategories.filter((e) => e !== active)
      : [...inactiveCategories, active];
    setInactiveCategories(cats);
  }
  function onChangeStartingDay(day) {
    if (day !== startingDay) {
      moment.updateLocale('en', {
        week: {
          dow: day,
        },
      });
      localStorage.setItem('calendarStartingDay', day);
      setStartingDay(day);
    }
  }
  function onChangeDateFormat(format) {
    if (format !== dateFormat) {
      localStorage.setItem('calendarDateFormat', format);
      setDateFormat(format);
    }
  }
  function onChangeTimeFormat(format) {
    if (format !== timeFormat) {
      localStorage.setItem('calendarTimeFormat', format);
      setTimeFormat(format);
    }
  }
  function getContextValue() {
    return {
      startingDay,
      dateFormat,
      timeFormat,
      openFilters,
      openOptions,
      openNotifications,
      view,
      defaultView,
      inactiveCategories,
      onChangeView,
      toggleOpenFilters,
      toggleOpenOptions,
      toggleOpenNotifications,
      onChangeActiveFilter,
      onChangeStartingDay,
      onChangeDateFormat,
      onChangeTimeFormat,
      onChangeDefaultView,
    };
  }
  return (
    <PlanContext.Provider value={getContextValue()}>
      {children}
    </PlanContext.Provider>
  );
};

Provider.propTypes = {
  children: PropTypes.node,
};

export default PlanContext;
