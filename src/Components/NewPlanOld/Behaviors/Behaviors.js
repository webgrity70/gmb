import React, { Fragment } from 'react';
import { compose } from 'redux';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Checkbox, Popup } from 'semantic-ui-react';
import { withoutCategories } from '../../Pages/Onboarding/questions/Habits';
import { withCategories } from '../../HoCs';
import './Behaviors.scss';
import 'easymde/dist/easymde.min.css';
import { getHabitsLoading } from '../../../selectors/requests';

const Habits = withoutCategories;

const Behaviors = ({
  onChangeHabit,
  habits,
  categories,
  values,
  onCheckRepeat,
  showHeader,
  repeat,
  canRepeat,
  errors,
}) => (
  <div className="flex-1 PlanBehaviors">
    {showHeader && (
      <div>
        <h3>Behavior</h3>
        <Popup
          trigger={<i className="far fa-question-circle mb-2" />}
          on="click"
          hoverable
          inverted
        >
          A behavior is an action. An action is a verb. Make your verb specific
          to increase the chances of it happening.
          <a
            className="more-popup"
            href="https://www.getmotivatedbuddies.com/verbs/"
            rel="noopener noreferrer"
            target="_blank"
          >
            more
          </a>
        </Popup>
      </div>
    )}
    {canRepeat && (
      <Checkbox checked={repeat} onChange={onCheckRepeat} label="repeat" />
    )}
    {(repeat === undefined || repeat) && (
      <Fragment>
        <Habits
          onChange={onChangeHabit}
          value={values.habit}
          habits={habits}
          showHeader={false}
          selectError={errors.habit}
          categories={categories}
        />
      </Fragment>
    )}
  </div>
);

Behaviors.propTypes = {
  habits: PropTypes.arrayOf(PropTypes.shape()),
  onChangeHabit: PropTypes.func,
  values: PropTypes.shape(),
  canRepeat: PropTypes.bool,
  onCheckRepeat: PropTypes.func,
  repeat: PropTypes.oneOfType([PropTypes.bool, PropTypes.oneOf([null])]),
  showHeader: PropTypes.bool,
  errors: PropTypes.shape(),
  categories: PropTypes.arrayOf(PropTypes.shape()),
};

Behaviors.defaultProps = {
  showHeader: true,
};

const mapHabitsAndCats = (state, { categories }) => ({
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

export const BehaviorsWHOC = compose(
  withCategories({
    paramsSelector: () => true,
    fetchingSelector: getHabitsLoading,
  }),
  connect(mapHabitsAndCats)
)(Behaviors);

export default connect(mapHabitsAndCats)(Behaviors);
