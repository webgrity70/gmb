import React from 'react';
import PropTypes from 'prop-types';

import './FilterSection.scss';

function FilterSection({ title, children, ...props }) {
  return (
    <div {...props} className="BuddyFilters__FilterSection">
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
