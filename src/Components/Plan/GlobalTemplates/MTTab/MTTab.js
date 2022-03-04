/* eslint-disable max-len */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import React, { useMemo, useContext, useCallback, useState } from 'react';
import { Icon, Input } from 'semantic-ui-react';
import moment from 'moment-timezone';
import intersection from 'lodash/intersection';
import withSizes from 'react-sizes';
import { initialize, change } from 'redux-form';
import { connect } from 'react-redux';
import { compose } from 'redux';
import InputRange from 'react-input-range';
import PropTypes from 'prop-types';
import { getAllCategories } from '../../../../selectors/plans';
import CategoriesIcons from '../../../Elements/CategoriesIcons';
import FiltersModal from '../FiltersModals/FiltersModal';
import withPlansTemplates from '../../../HoCs/resources/withPlansTemplates';
import { bem } from './utils';
import TemplateDetail from '../../../NewPlan/EventTemplates/TemplateDetail';
import {
  convertEventsToWeeksForm,
  getWeeks,
  sortDays,
} from '../../../NewPlan/utils';
import PlanContext from '../../PlanContext';
import history from '../../../../history';
import './MTTab.scss';
import StartDateModal from '../../StartDateModal/StartDateModal';

function MTTab({
  templates,
  categories,
  isMobile,
  initializeForm,
  changeFormValue,
  isChallenge,
  onCloseModal,
}) {
  const [openFiltersModal, setOpenFiltersModal] = useState(false);
  const [filters, setFilters] = useState({
    input: '',
    weeksMin: 0,
    weeksMax: 12,
    categories: [],
  });
  const [openStartDateModal, setOpenStartDateModal] = useState(false);
  const [templateWeekEvents, setTemplateWeekEvents] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState(false);
  const { timeFormat, startingDay } = useContext(PlanContext);
  const closeStartDateModal = useCallback(() => {
    setOpenStartDateModal(false);
  }, [setOpenStartDateModal]);
  const memoCategories = useMemo(
    () =>
      categories.map((category) => ({
        category,
        active:
          filters.categories && filters.categories.includes(category.name),
      })),
    [categories, filters]
  );
  const filteredTemplates = templates.filter((template) => {
    const templateCategories = template.categories.map(({ name }) => name);
    const templateIncludesCategory =
      intersection(templateCategories, filters.categories).length === 0;
    if (filters.categories.length > 0 && templateIncludesCategory) return false;
    if (template.weeks > filters.weeksMax || template.weeks < filters.weeksMin)
      return false;
    if (!new RegExp(filters.input, 'ig').test(template.name)) return false;
    if (template.challengeID) return false;
    return true;
  });
  function onChangeValue({ target: { value } }) {
    setFilters({ ...filters, input: value });
  }
  function onChangeWeeks({ min: weeksMin, max: weeksMax }) {
    setFilters({ ...filters, weeksMin, weeksMax });
  }
  function onChangeCategory({ category }) {
    const newCategories = filters.categories.includes(category.name)
      ? filters.categories.filter((name) => name !== category.name)
      : [...filters.categories, category.name];
    setFilters({ ...filters, categories: newCategories });
  }
  const [editing, setEditable] = useState([]);
  function toggleEntryEdit(id) {
    const news = editing.includes(id)
      ? editing.filter((e) => e !== id)
      : [...editing, id];
    setEditable(news);
  }
  const onCloseFiltersModal = useCallback(() => {
    setOpenFiltersModal(false);
  }, [setOpenFiltersModal]);
  function renderFilters() {
    if (!isMobile) {
      return (
        <div className={bem('options')}>
          <div className="flex items-center flex-col md:flex-row">
            <Input
              value={filters.input}
              icon="search"
              spellCheck="false"
              autoCorrect="false"
              autoComplete="false"
              autoCapitalize="false"
              onChange={onChangeValue}
              className="flex-1 md:mr-8 mb-4 md:mb-0"
              placeholder="Find your plan"
            />
            <div className={bem('categories')}>
              <CategoriesIcons
                categories={memoCategories}
                onClick={onChangeCategory}
              />
            </div>
          </div>
          <div className="flex mt-4 justify-between flex-col md:flex-row">
            <div className={bem('range-field')}>
              <span>
                DURATION: {filters.weeksMin || 0} - {filters.weeksMax || 12}{' '}
                WEEKS
              </span>
              <InputRange
                maxValue={12}
                minValue={0}
                step={1}
                value={{ min: filters.weeksMin, max: filters.weeksMax }}
                onChange={onChangeWeeks}
              />
            </div>
          </div>
        </div>
      );
    }
    return (
      <div className={bem('options-mobile')}>
        <Input
          value={filters.input}
          icon="search"
          spellCheck="false"
          autoCorrect="false"
          autoComplete="false"
          autoCapitalize="false"
          onChange={onChangeValue}
          className="flex-1 md:mr-8 mb-4 mt-4 md:mt-0 md:mb-0"
          placeholder="Find your plan"
        />
        <Icon name="sliders" onClick={() => setOpenFiltersModal(true)} />
      </div>
    );
  }
  function onSelectTemplate(template, startPlanDate = moment()) {
    /*  const dates = template.events.map(({ date }) => new Date(date));
    const startDate = new Date(Math.min.apply(null, dates));
    const startPlanDate = getNextInstanceDay(startDate.getDay()); */
    const events = isChallenge
      ? convertEventsToWeeksForm({
          events: template.events,
          startDate: startPlanDate,
        })
      : convertEventsToWeeksForm({
          events: template.events,
          startDate: startPlanDate,
          timezone: template.timezone,
        });
    const eventsArr = Object.values(events);

    if (isChallenge) {
      changeFormValue('new-challenge', 'events', events);
      changeFormValue('new-challenge', 'date', {
        startDate: startPlanDate,
        endDate: eventsArr[eventsArr.length - 1].date,
      });

      changeFormValue('new-challenge', 'name', template.name);
      //Close date modal
      closeStartDateModal();
      //Close marketplace modal
      onCloseModal();
    } else {
      initializeForm('new-plan', {
        goal: template.name,
        date: {
          startDate: startPlanDate,
          endDate: eventsArr[eventsArr.length - 1].date,
        },
        timezone: moment.tz.guess(),
        timezoneRestriction: 'Global',
        createTemplate: false,
        templateName: '',
        globalTemplate: false,
        baseTemplate: template.id,
      });
      changeFormValue('new-plan', 'events', events);
      history.push('/plan/new');
    }
  }
  function onEditTemplate(startTime) {
    onSelectTemplate(selectedTemplate, startTime);
  }
  function onSelectStartDate(template) {
    const data = Object.values(
      getWeeks({ initialValues: template, timeFormat })
    );
    const weekEvents = data.map((week) => {
      const days = Object.keys(week.days)
        .map((day) => day)
        .filter((day) => {
          let dayHasCheckedEvent = false;
          week.days[day].map((currentDay) => {
            if (currentDay.checked) {
              dayHasCheckedEvent = true;
            }
          });
          return dayHasCheckedEvent;
        });
      const weekDays = sortDays({
        values: days,
        startingDay,
      }).map((day) => {
        let events = week.days[day]
          .map((event) => {
            const [hour, minute] = event.time.split(':').map((e) => Number(e));
            const time = moment().set({ hour, minute });
            return {
              ...event,
              time,
              timeObj: event.time,
            };
          })
          .filter((event) => event.checked);
        return {
          events: events,
          day,
        };
      });
      return weekDays;
    });
    setSelectedTemplate(template);
    setTemplateWeekEvents(weekEvents);
    setOpenStartDateModal(true);
  }
  return (
    <div className={bem()}>
      {renderFilters()}
      <div className={bem('list')}>
        {filteredTemplates.map((template) => (
          <TemplateDetail
            {...template}
            isEditOn={editing.includes(template.id)}
            onToggleEdit={toggleEntryEdit}
            key={template.id}
            onSelect={onSelectStartDate}
            isPremade
          />
        ))}
      </div>
      <FiltersModal
        onClose={onCloseFiltersModal}
        open={openFiltersModal}
        weeksMin={filters.weeksMin}
        featured={filters.featured}
        weeksMax={filters.weeksMax}
        categories={memoCategories}
        onChangeCategory={onChangeCategory}
        onChangeDuration={onChangeWeeks}
      />
      {templateWeekEvents && (
        <StartDateModal
          open={openStartDateModal}
          onClose={closeStartDateModal}
          weekEvents={templateWeekEvents}
          onEditTemplate={onEditTemplate}
          isChallenge={isChallenge}
        />
      )}
    </div>
  );
}

MTTab.propTypes = {
  templates: PropTypes.arrayOf(PropTypes.shape),
  initializeForm: PropTypes.func,
  changeFormValue: PropTypes.func,
  categories: PropTypes.arrayOf(PropTypes.shape()),
  isMobile: PropTypes.bool,
  isChallenge: PropTypes.bool,
  onCloseModal: PropTypes.func,
};

MTTab.defaultProps = {
  isChallenge: false,
};

const mapStateToPropss = (state) => ({
  categories: getAllCategories(state),
});
export default compose(
  withPlansTemplates({}),
  connect(mapStateToPropss, {
    initializeForm: initialize,
    changeFormValue: change,
  }),
  withSizes(({ width }) => ({
    isMobile: width < 768,
  }))
)(MTTab);
