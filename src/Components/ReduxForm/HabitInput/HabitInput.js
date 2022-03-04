/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import React, { useState } from 'react';
import omit from 'lodash/omit';
import { compose } from 'redux';
import PropTypes from 'prop-types';
import cx from 'classnames';
import { Icon } from 'semantic-ui-react';
import BEMHelper from 'react-bem-helper';
import { Field } from 'redux-form';
import { connect } from 'react-redux';
import FieldSetLayout from '../FieldSetLayout';
import { withoutCategories as Habits } from '../../Pages/Onboarding/questions/Habits';
import { withCategories } from '../../HoCs';
import { getHabitsLoading } from '../../../selectors/requests';
import MDEEditor from '../../Elements/MDEditor/MdeEditor';

import './HabitInput.scss';

const bem = BEMHelper({ name: 'HabitInput', outputIsString: true });

function InnerComp({
  input: { value, onChange },
  habits,
  categories,
  placeholder,
  meta,
  hideDetails,
  defaultValue,
  disabled,
  isNewEvent,
  newEventName,
}) {
  const [showDetails, _setShowDetails] = useState(false);

  function setShowDetails(bool) {
    onChange({ ...value, showDetails: bool });
    _setShowDetails(bool);
  }

  return (
    <FieldSetLayout meta={meta}>
      <div className={bem()}>
        <Habits
          onChange={(val) => onChange({ ...value, ...val })}
          value={
            omit(value, 'customPrompts', 'customizePrompts', 'description') ||
            {}
          }
          defaultValue={defaultValue}
          habits={habits}
          showHeader={false}
          categories={categories}
          placeholder={placeholder}
          isNewEvent={isNewEvent}
          newEventName={newEventName}
          disabled={disabled}
        />
        {!hideDetails && !showDetails && (
          <div
            className={cx(bem('trigger'), 'mt-1')}
            onClick={() => setShowDetails(true)}
          >
            <Icon name="plus circle" />
            <span>Add details</span>
          </div>
        )}
        {showDetails && (
          <div className={bem('content')}>
            <div className="flex items-center justify-between">
              <h4 className={bem('label')}>Event Description</h4>
              <div
                className={bem('trigger')}
                onClick={() => setShowDetails(false)}
              >
                <span>Hide</span>
              </div>
            </div>
            <MDEEditor
              value={value.description}
              onChange={(description) => onChange({ ...value, description })}
            />
          </div>
        )}
      </div>
    </FieldSetLayout>
  );
}

InnerComp.propTypes = {
  habits: PropTypes.arrayOf(PropTypes.shape()),
  input: PropTypes.shape(),
  meta: PropTypes.shape(),
  placeholder: PropTypes.string,
  categories: PropTypes.arrayOf(PropTypes.shape()),
  hideDetails: PropTypes.bool,
  defaultValue: PropTypes.shape(),
  isNewEvent: PropTypes.bool,
  disabled: PropTypes.bool,
  newEventName: PropTypes.string,
};

InnerComp.defaultProps = {
  placeholder: 'Select or type a behavior (e.g., Run, Meditate)',
};

const mapStateToProps = (state, { categories }) => ({
  habits: categories.map((cat) => ({
    pk: cat.pk,
    label: cat.name,
    options: cat.options,
  })),
  categories: categories.map((cat) => ({
    name: cat.name,
    slug: cat.slug,
  })),
});

const Habit = compose(
  withCategories({
    paramsSelector: () => true,
    fetchingSelector: getHabitsLoading,
  }),
  connect(mapStateToProps)
)(InnerComp);

const HabitInput = (props) => <Field {...props} component={Habit} />;

export default HabitInput;
