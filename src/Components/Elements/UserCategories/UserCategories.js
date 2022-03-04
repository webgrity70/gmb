/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import React from 'react';
import cx from 'classnames';
import PropTypes from 'prop-types';
import { Icon } from 'semantic-ui-react';
import { CategoryIcon } from '../CategoriesIcons';
import './UserCategories.scss';

const handleActive = (val) =>
  val.replace('&', '-').replace(/\s/g, '').toLowerCase();

const UserCategories = ({ activeCategories, inactive, onChangeActive }) => {
  const activesValue = inactive.map((e) => handleActive(e));
  return (
    <div className="UserCategories">
      <div className="UserCategories__title">
        <span>You</span>
        <div className="flex flex-col">
          <span>Your</span>
          <span>Buddy</span>
        </div>
      </div>
      <div className="UserCategories__content">
        {activeCategories.map((category) => {
          const includeMe = activesValue.includes(
            handleActive(`you/${category.slug}`)
          );
          const includeCategory = activesValue.includes(
            handleActive(`category/${category.slug}`)
          );
          const includeBuddy =
            category.buddy &&
            activesValue.includes(handleActive(`buddy/${category.buddy.name}`));
          const categoryClass = cx('category', category.slug, 'active');
          const meActive = !includeMe && !includeCategory;
          const meClass = cx('you', category.slug, meActive && 'active');
          const buddyActive =
            !includeBuddy && !includeCategory && category.buddy;
          const buddyClass = cx(
            'buddy',
            category.slug,
            buddyActive && 'active'
          );
          return (
            <div key={category.slug} className="flex">
              <div className={categoryClass}>
                <CategoryIcon
                  slug={category.slug}
                  active={category.active}
                  name={category.name}
                  colorNoCircle
                />
                <span>{category.name}</span>
              </div>
              <div className={meClass}>
                <Icon
                  name={meActive ? 'eye' : 'eye slash outline'}
                  onClick={() => onChangeActive(`you/${category.slug}`)}
                />
              </div>
              <div className={buddyClass}>
                <Icon
                  name={buddyActive ? 'eye' : 'eye slash outline'}
                  onClick={() =>
                    category.buddy &&
                    onChangeActive(`buddy/${category.buddy.name}`)
                  }
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

UserCategories.propTypes = {
  activeCategories: PropTypes.arrayOf(PropTypes.shape({})),
  onChangeActive: PropTypes.func,
  inactive: PropTypes.arrayOf(PropTypes.string),
};

export default UserCategories;
