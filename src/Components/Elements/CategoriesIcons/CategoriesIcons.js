/* eslint-disable react/no-array-index-key */
import React from 'react';
import PropTypes from 'prop-types';
import CategoryIcon from './CategoryIcon';

const CategoriesIcons = ({ fullColor, categories, onClick, className }) =>
  categories.map((cat, index) => (
    <CategoryIcon
      key={`cat-${index}`}
      {...(cat.category || cat)}
      active={cat.active}
      fullColor={fullColor}
      onClick={() => {
        if (onClick) {
          onClick(cat);
        }
      }}
      customClassName={className}
    />
  ));

CategoriesIcons.propTypes = {
  onClick: PropTypes.func,
  className: PropTypes.string,
  categories: PropTypes.arrayOf(
    PropTypes.shape({
      active: PropTypes.bool,
      category: PropTypes.shape({
        pk: PropTypes.number,
        slug: PropTypes.string,
        name: PropTypes.string,
      }),
    })
  ),
};

export default CategoriesIcons;
