import React from 'react';
import { connect } from 'react-redux';
import cx from 'classnames';
import { compose } from 'redux';
import PropTypes from 'prop-types';
import { withGroups } from '../../../HoCs';
import {
  getOrderDirection,
  getPaginationOrderName,
} from '../../../../selectors/groups';
import Table from '../../../Elements/Table';
import { changeGroupsOrder as changeGroupsOrderAction } from '../../../../Actions/actions_groups';
import columns from './columns';
import './ResultsList.scss';

function ResultsList({ groups, order, direction, changeGroupsOrder }) {
  const mapedGroups = groups.map((e) => ({
    ...e,
    className: cx({ featured: e && e.featured }),
  }));
  return (
    <div className="GroupsResultsList table-responsive">
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
  order: PropTypes.oneOfType([PropTypes.string, PropTypes.oneOf([null])]),
  direction: PropTypes.oneOfType([PropTypes.string, PropTypes.oneOf([null])]),
};

const mapStateToProps = (state) => ({
  direction: getOrderDirection(state),
  order: getPaginationOrderName(state),
});

export default compose(
  connect(mapStateToProps, { changeGroupsOrder: changeGroupsOrderAction }),
  withGroups({ alwaysFetchOnMount: true })
)(ResultsList);
