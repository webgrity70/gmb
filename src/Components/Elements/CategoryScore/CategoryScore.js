import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import CategoryIcon from '../../Utils/CategoryIcon';

import './CategoryScore.scss';

function CategoryScore({ categoryLevel }) {
  return (
    <div
      className={cx('CategoryScore', categoryLevel.slug, {
        dull: categoryLevel.points === 0,
      })}
    >
      {CategoryIcon.renderCircleIcon(categoryLevel.slug)}
      <span className="ml-3">{categoryLevel.points}</span>
    </div>
  );
}

CategoryScore.propTypes = {
  categoryLevel: PropTypes.shape({
    slug: PropTypes.string,
    points: PropTypes.number,
  }).isRequired,
};

export default CategoryScore;
