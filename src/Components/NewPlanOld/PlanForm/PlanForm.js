/* eslint-disable max-len */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/anchor-is-valid */
import React, {
  useState,
  useContext,
  Fragment, // useMemo,
} from 'react';
// import queryString from 'query-string';
import withSizes from 'react-sizes';
import PropTypes from 'prop-types';
import { compose } from 'redux';
import InfiniteScroll from 'react-infinite-scroller';
import { connect } from 'react-redux';
import moment from 'moment';
import isEmpty from 'lodash/isEmpty';
import flatMap from 'lodash/flatMap';
import get from 'lodash/get';
import cx from 'classnames';
import {
  Button,
  Icon,
  Radio,
  Checkbox,
  Input,
  Popup,
  Dropdown,
} from 'semantic-ui-react';
import BEMHelper from 'react-bem-helper';
import { Formik } from 'formik';
import {
  getPlanInitialValues,
  planValidation,
  getWeekInitialValues,
  getWeeks,
  getWeeksArrNum,
  getPlanStartDate,
  getPlanEndDate,
  convertWeekToEvents,
  getNextInstanceDay,
} from '../utils';
import DatePicker from '../DatePicker';
import {
  /* getMyGroupsLoading, */ getDeletePlanLoading,
} from '../../../selectors/requests';
import Week from '../Week';
// import { fetchMyGroups as fetchMyGroupsAction } from '../../../Actions/actions_profile';
import PlanContext from '../../Plan/PlanContext';
// import useActionOnCondition from '../../../hooks/use-action-on-condition';
// import { getHasReachedMyGroupsPaginationEnd, getMyAdminGroups } from '../../../selectors/profile';
import { getDraftPlan } from '../../../reducers/session/selectors';
// import { getGroup } from '../../../selectors/groups';
import { fetchGroup as fetchGroupAction } from '../../../Actions/actions_groups';
import './PlanForm.scss';

const baseShareOptions = [
  { key: 'private', value: 0, text: 'Keep it only for myself' },
  { key: 'public', value: 1, text: 'Share it with everyone' },
];

const bem = BEMHelper({ name: 'PlanForm', outputIsString: true });

const PlanForm = ({
  profileId,
  isMobile,
  onSubmit,
  // groupData,
  myGroups,
  groupId,
  draftPlan,
  loading,
  loadingDelete,
  myGroupsHasReachedEnd,
  // fetchGroup,
  loadingMyGroups,
  fetchMyGroups,
  initialValues,
  onDelete,
}) => {
  const { timeFormat, startingDay } = useContext(PlanContext);
  const planInitialValues = getPlanInitialValues(
    { initialValues: initialValues || draftPlan },
    !!groupId
  );
  const [weeks, setWeek] = useState(getWeeksArrNum(planInitialValues));
  /* useActionOnCondition(
    () => fetchMyGroups({ usePagination: false, pageSize: 100 }),
    !groupId && myGroups && myGroups.length === 0,
  );
   useActionOnCondition(
    () => fetchGroup(groupId, false),
    !groupData && groupId,
  );
  const groupOptions = useMemo(
    () => myGroups
      && myGroups.map(({ name, id }) => ({
        key: id,
        value: id,
        text: `Share it in ${name} (Group)`,
      })),
    [myGroups],
  );
*/
  const shareOptions = baseShareOptions;
  /* !groupId ? [...baseShareOptions, ...groupOptions]: [
    { key: 'private', value: 0, text: 'Share it with the group only.' },
    { key: 'public', value: 1, text: 'Share it with the group and everyone else.' },
  ]; */
  function loadMoreMyGroups() {
    fetchMyGroups({ usePagination: true, pageSize: 10 });
  }
  return (
    <Formik
      enableReinitialize
      validate={planValidation}
      initialValues={planInitialValues}
      onSubmit={(
        {
          goal,
          date,
          group,
          createTemplate,
          createEvents,
          globalTemplate,
          templateName,
          ...rest
        },
        { setSubmitting }
      ) => {
        setSubmitting(false);
        const weeksValues = Object.keys(rest)
          .filter((field) => /week/.test(field))
          .map((field) => rest[field]);
        const weeksDaysDate = convertWeekToEvents(weeksValues, date);
        onSubmit({
          name: goal,
          startDate: moment.utc(date).format('YYYY-MM-DD'),
          weeks: weeksDaysDate.length,
          events: flatMap(weeksDaysDate),
          createTemplate,
          createEvents,
          globalTemplate: Boolean(globalTemplate),
          ...(!!group && { group }),
          ...(!!templateName && { templateName }),
        });
      }}
    >
      {(form) => {
        const startDate = getPlanStartDate(form.values);
        const endDate = getPlanEndDate(form.values);
        const setFieldValue = (week) => (field, value) =>
          form.setFieldValue(`week_${week}.${field}`, value);
        function getShareOptionSelected() {
          const selected = shareOptions.find(
            ({ value }) =>
              value === form.values.group ||
              value === form.values.globalTemplate
          );
          return selected ? selected.text : 'Select';
        }
        function haveEventsFilleds() {
          const weeksValues = Object.keys(form.values)
            .filter((field) => /week/.test(field))
            .map((field) => form.values[field]);
          return weeksValues.some(({ days }) =>
            Object.values(days).some(({ checked }) => checked)
          );
        }
        const haveEvents = haveEventsFilleds();
        function getSaveWarningText() {
          if (!haveEvents) return 'No plan to save.';
          return 'Please correct the fields highlighted in red.';
        }
        function SaveButton() {
          const invalidNew = !form.isValid && isEmpty(initialValues);
          const disabled =
            invalidNew || loading || !haveEvents || loadingDelete;
          if (disabled) {
            return (
              <Popup
                content={getSaveWarningText()}
                trigger={
                  <div className="flex justify-end">
                    <Button
                      color="orange"
                      type="button"
                      disabled
                      className="w-full"
                      loading={loading}
                    >
                      <Icon name="add circle" />
                      Save Plan
                    </Button>
                  </div>
                }
              />
            );
          }
          return (
            <Button
              color="orange"
              type="button"
              onClick={form.submitForm}
              loading={loading}
            >
              <Icon name="add circle" />
              Save Plan
            </Button>
          );
        }
        function onAddWeek() {
          const lastWeek = weeks[weeks.length - 1];
          const newKey = lastWeek + 1;
          form.setFieldValue(`week_${newKey}`, getWeekInitialValues());
          setWeek([...weeks, newKey]);
        }
        function onChangeNormalGlobalTemplate(_, { value }) {
          const selectedGroup = myGroups.find(({ id }) => id === value);
          if (selectedGroup) {
            form.setFieldValue('group', value);
            if (!form.values.globalTemplate)
              form.setFieldValue('globalTemplate', true);
          } else {
            form.setFieldValue('globalTemplate', !form.values.globalTemplate);
          }
        }
        function onChangeGlobalTemplateGroup(_, { value }) {
          form.setFieldValue('globalTemplate', value);
        }
        function removeWeek(week) {
          setWeek(weeks.filter((e) => e !== week));
          form.setFieldValue(`week_${week}`, undefined);
        }
        function onChangeGoal(_, { value }) {
          form.setFieldValue('templateName', value);
          form.setFieldValue('goal', value);
        }
        function onChangeDate(date) {
          form.setFieldValue('date', date);
        }
        function onChangeStarsOn(e, { value }) {
          if (value === 'this') onChangeDate(moment().day(startingDay));
          else if (value === 'next') {
            const nextStarting = getNextInstanceDay(startingDay);
            onChangeDate(nextStarting);
          }
          form.setFieldValue('startsOn', value);
        }
        function onChangeTemplateName(_, { value }) {
          form.setFieldValue('templateName', value);
        }
        function onChangeSaveTemplate() {
          if (!form.values.createTemplate && groupId)
            form.setFieldValue('group', groupId);
          form.setFieldValue('createTemplate', !form.values.createTemplate);
        }
        function onRepeatPreviousWeek(week) {
          const previousWeek = form.values[`week_${week - 1}`].days;
          form.setFieldValue(`week_${week}.days`, previousWeek);
        }
        /* function openNotifications() {
          window.open(
            `${window.location.origin}/settings/notifications?section=calendar`,
            'sharer',
            'toolbar=0,status=0,width=800,height=500',
          );
        } */
        function clearPlan() {
          const values = getPlanInitialValues({});
          Object.keys(values).forEach((field) =>
            form.setFieldValue(field, values[field])
          );
          setWeek([1]);
        }
        function onSelectTemplate(request) {
          const data = getWeeks({ initialValues: request, timeFormat });
          Object.keys(data).forEach((key, index) => {
            const week = data[key];
            form.setFieldValue(`week_${index + 1}`, week);
          });
          form.setFieldValue('goal', request.name);
          setWeek(Object.keys(data).map((_, index) => index + 1));
        }
        return (
          <form className={bem()}>
            <div className={cx(bem('header'), 'flex')}>
              <div className={cx('flex flex-col items-center', bem('goal'))}>
                <div className="flex justify-center items-center mb-4">
                  <h1 className="mr-2">
                    What’s your goal with this Plan?
                    <Popup
                      trigger={<i className="far fa-question-circle mb-2" />}
                      on="click"
                      hoverable
                      inverted
                    >
                      Goals related to meaningful relationships, personal
                      growth, and community contribution are positively
                      correlated with mental health.
                      <a
                        className="more-popup"
                        href="https://www.getmotivatedbuddies.com/goals/"
                        rel="noopener noreferrer"
                        target="_blank"
                      >
                        more
                      </a>
                    </Popup>
                  </h1>
                </div>
                <Input
                  name="goal"
                  placeholder="Lose 5 pounds in three weeks"
                  onChange={onChangeGoal}
                  value={form.values.goal}
                  error={form.errors.goal && form.dirty}
                  required
                />
              </div>
              <div className={cx('flex justify-start', bem('until'))}>
                <h1>This plan starts: </h1>
                <div className="flex flex-col">
                  <Radio
                    label="This Week"
                    value="this"
                    checked={form.values.startsOn === 'this'}
                    onChange={onChangeStarsOn}
                  />
                  <Radio
                    label="Next Week"
                    value="next"
                    checked={form.values.startsOn === 'next'}
                    onChange={onChangeStarsOn}
                  />
                  <div>
                    <Radio
                      label="On"
                      value="select"
                      checked={form.values.startsOn === 'select'}
                      onChange={onChangeStarsOn}
                    />
                    <DatePicker
                      onChange={onChangeDate}
                      value={form.values.date}
                      error={!!form.errors.date}
                      openDirection={draftPlan ? 'down' : 'up'}
                      {...(form.values.startsOn !== 'select' && {
                        className: 'hide',
                      })}
                    />
                  </div>
                </div>
              </div>
            </div>
            {form.values.date && (
              <Fragment>
                {weeks.map((val) => (
                  <Week
                    key={`week-${val}`}
                    profileId={profileId}
                    startDate={form.values.date}
                    week={val}
                    removeWeek={removeWeek}
                    onRepeatPrevious={onRepeatPreviousWeek}
                    form={{
                      setFieldValue: setFieldValue(val),
                      errors: get(form.errors, `week_${val}`, {}),
                      values: form.values[`week_${val}`],
                      setFieldError: form.setFieldError,
                    }}
                    timeFormat={timeFormat}
                    isMobile={isMobile}
                    shouldAllowRepeatWeek={val > 1}
                    onSelectTemplate={onSelectTemplate}
                  />
                ))}
                {weeks.length < 12 && (
                  <div className={bem('add')} onClick={onAddWeek}>
                    <Icon name="plus circle" />
                    ADD ANOTHER WEEK
                  </div>
                )}
              </Fragment>
            )}
            {form.values.date && (
              <div className={cx('flex items-center', bem('templates'))}>
                <div className={cx(bem('save-template'), 'mb-2')}>
                  <Checkbox
                    checked={form.values.createTemplate}
                    onChange={onChangeSaveTemplate}
                    label="Save Plan as a Template"
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
                <div className="flex flex-col flex-1">
                  <Input
                    name="templateName"
                    placeholder="Lose 5 pounds in three weeks"
                    onChange={onChangeTemplateName}
                    value={form.values.templateName}
                    error={form.errors.templateName && form.dirty}
                  />
                </div>
                {form.values.createTemplate ? (
                  <Dropdown
                    fluid
                    key="private"
                    text={getShareOptionSelected()}
                    className="selection"
                  >
                    <Dropdown.Menu>
                      {groupId ? (
                        <Fragment>
                          {shareOptions.map((opt) => (
                            <Dropdown.Item
                              {...opt}
                              onClick={onChangeGlobalTemplateGroup}
                              className={cx({
                                active:
                                  opt.value === form.values.globalTemplate,
                              })}
                            />
                          ))}
                        </Fragment>
                      ) : (
                        <InfiniteScroll
                          pageStart={0}
                          loadMore={loadMoreMyGroups}
                          hasMore={!myGroupsHasReachedEnd && !loadingMyGroups}
                          useWindow={false}
                        >
                          {shareOptions.map((opt) => (
                            <Dropdown.Item
                              {...opt}
                              onClick={onChangeNormalGlobalTemplate}
                              className={cx({
                                active:
                                  opt.value === form.values.globalTemplate,
                              })}
                            />
                          ))}
                        </InfiniteScroll>
                      )}
                    </Dropdown.Menu>
                  </Dropdown>
                ) : (
                  <div className="flex flex-1" />
                )}
              </div>
            )}
            <div
              className={cx(
                'flex items-baseline',
                bem('save-container'),
                'justify-end'
              )}
            >
              <div className="flex items-start flex-wrap justify-end">
                {startDate && (
                  <div className={bem('scheduled')}>
                    <h1 className="ml-2">
                      {weeks.length} {weeks.length > 1 ? 'Weeks' : 'Week'}
                    </h1>
                    <h1 className="ml-2">|</h1>
                    <h1 className="ml-2">
                      {startDate} {endDate ? `- ${endDate}` : ''}
                    </h1>
                  </div>
                )}
                <Button
                  basic
                  color="orange"
                  onClick={clearPlan}
                  type="button"
                  className="clear"
                  disabled={loadingDelete || loading}
                >
                  Clear Plan
                </Button>
                {onDelete && (
                  <Button
                    loading={loadingDelete}
                    disabled={loading || loadingDelete}
                    onClick={onDelete}
                    type="button"
                    className="mr-4 delete"
                  >
                    <Icon name="trash" />
                    Delete Plan
                  </Button>
                )}
                <div className={cx('flex flex-col', bem('save'))}>
                  <SaveButton />
                </div>
              </div>
            </div>
          </form>
        );
      }}
    </Formik>
  );
};

PlanForm.propTypes = {
  onSubmit: PropTypes.func,
  onDelete: PropTypes.func,
  loading: PropTypes.bool,
  draftPlan: PropTypes.oneOfType([PropTypes.shape(), PropTypes.oneOf([null])]),
  // groupData: PropTypes.oneOfType([PropTypes.shape(), PropTypes.oneOf([null])]),
  groupId: PropTypes.oneOfType([PropTypes.number, PropTypes.oneOf([null])]),
  profileId: PropTypes.number,
  fetchMyGroups: PropTypes.func,
  isMobile: PropTypes.bool,
  fetchGroup: PropTypes.func,
  myGroupsHasReachedEnd: PropTypes.oneOfType([
    PropTypes.bool,
    PropTypes.oneOf([null]),
  ]),
  loadingMyGroups: PropTypes.oneOfType([
    PropTypes.bool,
    PropTypes.oneOf([null]),
  ]),
  loadingDelete: PropTypes.oneOfType([PropTypes.bool, PropTypes.oneOf([null])]),
  myGroups: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.shape()),
    PropTypes.oneOf([null]),
  ]),
  initialValues: PropTypes.oneOfType([
    PropTypes.shape(),
    PropTypes.oneOf([null]),
  ]),
};

const mapStateToProps = (state) => {
  const baseProps = {
    draftPlan: getDraftPlan(state),
    loadingDelete: getDeletePlanLoading(state),
  };
  /* const { group: groupId } = queryString.parse(state.router.location.search);
  if (groupId) {
    // const groupData = getGroup(state, { groupId });
    return {
      ...baseProps,
      // groupData,
      groupId,
    };
  } */
  return {
    ...baseProps,
    // myGroups: getMyAdminGroups(state),
    // loadingMyGroups: getMyGroupsLoading(state),
    // myGroupsHasReachedEnd: getHasReachedMyGroupsPaginationEnd(state),
  };
};

export default compose(
  withSizes(({ width }) => ({
    isMobile: width < 768,
  })),
  connect(mapStateToProps, {
    /* fetchMyGroups: fetchMyGroupsAction, */ fetchGroup: fetchGroupAction,
  })
)(PlanForm);
