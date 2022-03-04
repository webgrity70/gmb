import React from 'react';
import PropTypes from 'prop-types';

const SortableHeader = ({
  label,
  currentOrder,
  orderBy,
  order,
  onOrderChange,
}) => (
  <th
    className={`sortable clickable ${
      currentOrder === orderBy ? 'selected' : ''
    } ${order}`}
    onClick={() => onOrderChange(orderBy)}
  >
    {' '}
    {label}{' '}
  </th>
);

SortableHeader.propTypes = {
  label: PropTypes.string.isRequired,
  currentOrder: PropTypes.string.isRequired,
  orderBy: PropTypes.string.isRequired,
  onOrderChange: PropTypes.func.isRequired,
  order: PropTypes.string.isRequired,
};

export default SortableHeader;
