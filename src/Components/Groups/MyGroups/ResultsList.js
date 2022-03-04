import React from 'react';
import cx from 'classnames';
import PropTypes from 'prop-types';
import Table from '../../Elements/Table';
import columns from '../Search/ResultsList/columns';

function ResultsList({
  className,
  groups,
  order,
  direction,
  changeGroupsOrder,
}) {
  const mapedGroups = groups.map((e) => ({
    ...e,
    className: cx({ featured: e && e.featured }),
  }));
  return (
    <div className={className}>
      <Table
        dataSource={mapedGroups}
        columns={columns}
        onSortBy={changeGroupsOrder}
        direction={direction}
        currentOrder={order}
      />
    </div>
  );
}

ResultsList.propTypes = {
  groups: PropTypes.arrayOf(PropTypes.object),
  changeGroupsOrder: PropTypes.func,
  className: PropTypes.string,
  order: PropTypes.oneOfType([PropTypes.string, PropTypes.oneOf([null])]),
  direction: PropTypes.oneOfType([PropTypes.string, PropTypes.oneOf([null])]),
};

export default ResultsList;
