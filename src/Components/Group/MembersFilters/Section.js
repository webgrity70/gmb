import React from 'react';
import PropTypes from 'prop-types';
import { bem } from './utils';

function FilterSection({ title, children, ...props }) {
  return (
    <div {...props} className={bem('section')}>
      <h3>{title}</h3>
      {children}
    </div>
  );
}

FilterSection.propTypes = {
  children: PropTypes.node,
  title: PropTypes.string,
};

export default FilterSection;
