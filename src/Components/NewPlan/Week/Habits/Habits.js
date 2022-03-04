import React from 'react';
import { Icon } from 'semantic-ui-react';
import PropTypes from 'prop-types';
import BEMHelper from 'react-bem-helper';
import CategoryIcon from '../../../Elements/CategoriesIcons/CategoryIcon';
import showdown from 'showdown';
import './Habits.scss';

const bem = BEMHelper({ name: 'CurrentWeekHabits', outputIsString: true });

function Habits({ habits, editing, onOpenDelete, onOpenMultiEditModal }) {
  return (
    <div className="px-3 pt-0 md:pt-12">
      {habits.length
        ? habits.map(({ habit }, index) => (
            <div
              className={bem('', { editing })}
              key={`habits-${index + 1}-${habit.value}`}
            >
              <CategoryIcon
                name={habit.category}
                slug={habit.slug}
                active
                fullColor
              />
              <span>{habit.habit}</span>
              <Icon name="trash" onClick={() => onOpenDelete(habit)} />
              <Icon
                name="pencil"
                onClick={() => {
                  let converter = new showdown.Converter();
                  let tempHabit = {
                    ...habit,
                    description: converter.makeHtml(habit.description),
                  };
                  onOpenMultiEditModal(tempHabit);
                }}
              />
            </div>
          ))
        : null}
    </div>
  );
}

Habits.propTypes = {
  habits: PropTypes.arrayOf(PropTypes.shape()),
  onOpenMultiEditModal: PropTypes.func,
  onOpenDelete: PropTypes.func,
  editing: PropTypes.bool,
};

export default Habits;
