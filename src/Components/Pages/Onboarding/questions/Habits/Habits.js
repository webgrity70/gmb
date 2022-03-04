/* eslint-disable no-restricted-globals */
import React, { useState } from 'react';
import upperFirst from 'lodash/upperFirst';
import isEmpty from 'lodash/isEmpty';
import { compose } from 'redux';
import BEMHelper from 'react-bem-helper';
import cx from 'classnames';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Dropdown } from 'semantic-ui-react';

import { filterHabits } from '../../../../../Actions/signup';
import './Habits.scss';
import CategoryIcon from '../../../../Elements/CategoriesIcons/CategoryIcon';
import { withCategories } from '../../../../HoCs';
import { getSlug } from '../../../../NewPlan/utils';

const bem = BEMHelper({ name: 'SignupHabits', outputIsString: true });

const Habits = ({
  value,
  defaultValue,
  onChange,
  selectError,
  habits,
  allowNew,
  disabled,
  showHeader,
  categories,
  placeholder,
  isNewEvent,
  newEventName,
}) => {
  const [habitText, setHabitText] = useState(newEventName || null);
  const habitsArr = habits;
  function handleContent(label, slug) {
    return (
      <div className={bem('habit')}>
        {slug && (
          <div>
            <CategoryIcon fullColor slug={slug} />
          </div>
        )}
        <span>{upperFirst(label)}</span>
      </div>
    );
  }
  const habitOptions = habitsArr.reduce(
    (prev, current) => [
      ...prev,
      ...(current.options || []).map((opt) => {
        const slug = getSlug(current.label);
        return {
          category: current.label,
          slug,
          text: opt.label,
          key: opt.value,
          value: opt.value,
          content: handleContent(opt.label, slug),
        };
      }),
    ],
    []
  );
  if (habitText) {
    habitOptions.push({
      ...(habitText && {
        text: habitText,
        value: habitText,
        content: handleContent(habitText),
      }),
    });
  } else if (!isEmpty(value)) {
    const isCustomCreated =
      !habitOptions.some((e) => e.value === value.value) && !isNaN(value.value);
    const isCustomNew =
      !habitOptions.some((e) => e.text === value.value) && isNaN(value.value);
    if (isCustomNew || isCustomCreated) {
      habitOptions.push({
        ...value,
        text: upperFirst(value.text || value.habit),
        content: handleContent(value.text || value.habit, value.slug),
      });
    }
  }
  const categoriesOptions = categories.map((cat) => ({
    content: handleContent(cat.name, cat.slug),
    value: cat.name,
    text: cat.name,
  }));
  const categoryOptValue =
    !habitText || isNaN(value.value) ? value.category : null;
  function onAddOne({ value: val }) {
    setHabitText(val);
  }
  function onSelectCategory(e) {
    const newOne = {
      ...(habitText && {
        value: habitText,
        habit: habitText,
        text: habitText,
      }),
      ...(!habitText && value),
      category: e,
      slug: getSlug(e),
    };
    onChange(newOne);
    setHabitText(null);
  }
  function onHabitChange({ value: val }) {
    if (typeof val === 'number') {
      const element = habitOptions.find((e) => e.value === val);
      onChange({
        category: element.category,
        habit: element.text,
        slug: element.slug,
        value: val,
      });
      if (habitText) setHabitText(null);
    } else if (val === '') {
      onChange('');
      setHabitText(null);
    }
  }
  function tryToFindValue(val) {
    if (!isNaN(val.value)) return value.value;
    const hab = habits.reduce((prev, current) => {
      const match = current.options.find((e) => e.label === val.habit);
      if (match) return match;
      return prev;
    }, {});
    if (!isEmpty(hab)) return hab.value;
    if (value.value) return value.value;
    return null;
  }
  const selectValue = habitText || tryToFindValue(value);
  const selectDropdownError = selectError && !selectValue;
  const isNewHabit = value.value && isNaN(value.value);
  const showCategories = !!habitText || isNewHabit || isNewEvent; // (!isEmpty(value) && isNaN(value.value)) ||
  return (
    <div className={bem()}>
      {showHeader && (
        <div className="icons">
          {categories.map((category) => (
            <div
              className={`habit ${category.slug}`}
              key={`habit-${category.slug}`}
            >
              <div>
                <CategoryIcon colorNoCircle slug={category.slug} />
              </div>
              <p className="label"> {category.name} </p>
            </div>
          ))}
        </div>
      )}
      <div
        className={cx('habit-content', { full: showCategories && allowNew })}
      >
        <div className={bem('options')}>
          <Dropdown
            options={habitOptions}
            placeholder={placeholder}
            search
            selection
            fluid
            clearable
            disabled={disabled}
            error={selectDropdownError}
            allowAdditions={allowNew}
            value={selectValue}
            defaultValue={defaultValue}
            onAddItem={(e, data) => [e.stopPropagation(), onAddOne(data)]}
            onChange={(e, data) => [e.stopPropagation(), onHabitChange(data)]}
            selectOnBlur={false}
          />
          {showCategories && allowNew && !disabled && (
            <Dropdown
              options={categoriesOptions}
              placeholder="Select a category"
              search
              selection
              error={selectError}
              fluid
              value={categoryOptValue}
              onChange={(e, { value: val }) => [
                e.stopPropagation(),
                onSelectCategory(val),
              ]}
              selectOnBlur={false}
              allowAdditions={false}
            />
          )}
        </div>
      </div>
    </div>
  );
};

Habits.propTypes = {
  value: PropTypes.shape(),
  defaultValue: PropTypes.shape(),
  onChange: PropTypes.func,
  habits: PropTypes.arrayOf(PropTypes.shape()),
  allowNew: PropTypes.bool,
  showHeader: PropTypes.bool,
  selectError: PropTypes.oneOfType([PropTypes.bool, PropTypes.oneOf([null])]),
  disabled: PropTypes.oneOfType([PropTypes.bool, PropTypes.oneOf([null])]),
  categories: PropTypes.arrayOf(PropTypes.shape()),
  placeholder: PropTypes.string,
  isNewEvent: PropTypes.bool,
  newEventName: PropTypes.string,
};

Habits.defaultProps = {
  allowNew: true,
  showHeader: true,
  placeholder: 'Enter a habit',
  isNewEvent: false,
};

const mapStateToProps = (state) => ({
  habits: state.signup.habits,
});

export const withoutCategories = compose(connect(null, { filterHabits }))(
  Habits
);

export default compose(
  withCategories({
    paramsSelector: () => false,
  }),
  connect(mapStateToProps, { filterHabits })
)(Habits);
