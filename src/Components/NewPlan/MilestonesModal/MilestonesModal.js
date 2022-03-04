/* eslint-disable jsx-a11y/anchor-is-valid */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable react/no-unescaped-entities */
/* eslint-disable no-unused-vars */
import React, { useMemo, useState } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import BEMHelper from 'react-bem-helper';
import groupBy from 'lodash/groupBy';
import cx from 'classnames';
import { Modal, Icon, Dropdown } from 'semantic-ui-react';
import { formValueSelector, change } from 'redux-form';
import { CheckBox, Input } from '../../ReduxForm';
import { CategoryIcon } from '../../Elements/CategoriesIcons';
import convertMeridiem from '../../../utils/convertMeridiem';
import './MilestonesModal.scss';

const bem = BEMHelper({ name: 'MilestonesModal', outputIsString: true });

function MilestonesModal({
  open,
  events,
  habits,
  onClose,
  changeFormValue,
  formName,
}) {
  const baseProps = {
    dimmer: 'inverted',
    closeIcon: { name: 'close', color: 'grey' },
    open,
    onClose,
    size: 'small',
    closeOnDimmerClick: false,
    className: cx(bem()),
  };
  if (!open) return <Modal {...baseProps} />;
  const [selected, setSelected] = useState(
    events[0] ? events[0].habit.value : null
  );
  // We should use useReducer, this component needs refactor
  const [copyEvents, setCopyEvents] = useState(
    events.reduce((prev, current) => {
      const dayUnix = current.date
        .clone()
        .set({
          minutes: Number(current.time.minutes),
          hours: convertMeridiem({
            hour: current.time.hours,
            format: current.time.format,
          }),
          seconds: 0,
          milliseconds: 0,
        })
        .format('X');
      const key = `${current.habit.value}/${dayUnix}`;
      return {
        ...prev,
        [key]: {
          habit: current.habit,
          milestone: current.milestone,
          date: current.date,
          key,
        },
      };
    }, {})
  );
  const [onlyMilestone, setOnlyMilestone] = useState(false);
  const weeks = useMemo(() => {
    const habitEvents = Object.values(copyEvents).filter(
      ({ habit, milestone }) => {
        const sameHabit = habit.value === selected;
        return sameHabit && (onlyMilestone ? milestone.active : true);
      }
    );
    const group = groupBy(habitEvents, (e) => e.date.clone().week());
    return Object.values(group)
      .sort((a, b) => a[0].date.valueOf() - b[0].date.valueOf())
      .map((week) => week.sort((a, b) => a.date.valueOf() - b.date.valueOf()));
  }, [selected, copyEvents, onlyMilestone]);

  function onCheckDay(day) {
    const newMilestoneValue = {
      ...day.milestone,
      active: !day.milestone.active,
    };
    setCopyEvents({
      ...copyEvents,
      [day.key]: {
        ...day,
        milestone: newMilestoneValue,
      },
    });
  }

  function onChangeDescrpition(value, day) {
    const newMilestoneValue = {
      ...day.milestone,
      description: !value ? '' : value,
    };
    setCopyEvents({
      ...copyEvents,
      [day.key]: {
        ...day,
        milestone: newMilestoneValue,
      },
    });
  }

  function getIsInvalid() {
    return (
      Object.values(copyEvents).filter(
        (e) => e.milestone.active && !e.milestone.description
      ).length > 0
    );
  }

  function onSave() {
    Object.values(copyEvents).forEach((event) => {
      changeFormValue(
        formName,
        `events.${event.key}.milestone`,
        event.milestone
      );
    });
    onClose();
  }

  const isInvalid = getIsInvalid();
  return (
    <Modal {...baseProps}>
      <Modal.Content>
        <h3 className={bem('title')}>Milestones</h3>
        <span className={bem('description')}>Select behavior</span>
        <Dropdown
          fluid
          selection
          value={selected}
          onChange={(e, { value }) => setSelected(value)}
          options={habits.map((e) => ({
            key: e.habit.value,
            text: e.label,
            value: e.habit.value,
            content: (
              <div className={bem('habit')}>
                <div>
                  <CategoryIcon fullColor slug={e.habit.slug} />
                </div>
                <span>{e.label}</span>
              </div>
            ),
          }))}
        />
        <div
          className={bem('milestone', { active: onlyMilestone })}
          onClick={() => setOnlyMilestone(!onlyMilestone)}
        >
          <Icon name={onlyMilestone ? 'check' : 'minus'} />
          <span>Show milestone only</span>
        </div>
        <div>
          {weeks.map((week, index) => (
            <div key={`milestones-week-${index + 1}`}>
              <div className="flex items-center mt-4 mb-5">
                <span className={bem('week')}>Week {index + 1}</span>
                <div className={bem('divider')} />
              </div>
              <div className="flex flex-col">
                {week.map((day, dayIndex) => (
                  <div
                    className="flex flex-col mb-4"
                    key={`mw-day-${dayIndex + 1}`}
                  >
                    <CheckBox
                      label={day.date.clone().format('ddd, MMM D')}
                      value={day.milestone.active}
                      onChange={() => onCheckDay(day)}
                    />
                    {day.milestone.active && (
                      <Input
                        autoFocus
                        className="mt-2"
                        placeholder="e.g., Race Day!"
                        value={day.milestone.description}
                        onChange={(value) => onChangeDescrpition(value, day)}
                      />
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </Modal.Content>
      <Modal.Actions>
        <a className="pointer" onClick={onClose}>
          Cancel
        </a>
        <a
          className={cx('pointer', { [bem('disabled')]: isInvalid })}
          {...(!isInvalid && { onClick: () => onSave() })}
        >
          Save
        </a>
      </Modal.Actions>
    </Modal>
  );
}

MilestonesModal.propTypes = {
  open: PropTypes.bool,
  onClose: PropTypes.func,
  events: PropTypes.arrayOf(PropTypes.shape()),
  habits: PropTypes.arrayOf(PropTypes.shape()),
  changeFormValue: PropTypes.func,
  formName: PropTypes.string,
  startDate: PropTypes.shape(),
  endDate: PropTypes.shape(),
};

const mapStateToProps = (state, { formName }) => {
  const selector = formValueSelector(formName);
  const events = selector(state, 'events');
  if (!events) return { events: [], habits: [] };
  const eventsArr = Object.values(events);
  const groups = Object.values(groupBy(eventsArr, (e) => e.habit.value));
  return {
    events: eventsArr,
    habits: groups.map((group) => {
      const weeks = group.sort((a, b) => a.date.valueOf() - b.date.valueOf());
      return {
        habit: group[0].habit,
        label: `${group[0].habit.habit} (${weeks[0].date
          .clone()
          .format('MMM D')} -
          ${weeks[weeks.length - 1].date.clone().format('MMM D')}) -
          ${weeks.length} occurence${weeks.length !== 1 ? 's' : ''}
        `,
      };
    }),
  };
};

export default connect(mapStateToProps, { changeFormValue: change })(
  MilestonesModal
);
