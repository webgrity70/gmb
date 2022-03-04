import React, { useState, Fragment } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Button } from 'semantic-ui-react';
import InfiniteScroll from 'react-infinite-scroller';
import isIOs from '../../../utils/isIos';
import {
  getPPMNext,
  loadingPPM,
  getPPMembers,
} from '../../../selectors/groups';
import Loading from '../../Loading';
import {
  fetchPendingPrivateMembers as fetchPendingPrivateMembersAction,
  changePPMStatus as changePPMStatusAction,
} from '../../../Actions/actions_groups';
import Table from '../../Elements/Table/Table';

import columns from './columns';

const DIRECTIONS = {
  ASCENDING: 'ascending',
  DESCENDING: 'descending',
};

const MembersTable = ({
  groupId,
  members,
  fetchPendingPrivateMembers,
  nextPage,
  changePPMStatus,
  loading,
}) => {
  const [sorted, setSorted] = useState(null);
  const [direction, setDirection] = useState(null);
  function onSortBy(column) {
    if (column !== sorted) {
      setSorted(column);
      setDirection(DIRECTIONS.ASCENDING);
      fetchPendingPrivateMembers(groupId, { order: column }, nextPage);
      return;
    }
    const sortedWithDirection =
      direction === DIRECTIONS.ASCENDING ? `-${column}` : column;
    setDirection(
      direction === DIRECTIONS.ASCENDING
        ? DIRECTIONS.DESCENDING
        : DIRECTIONS.ASCENDING
    );
    setSorted(sortedWithDirection);
    fetchPendingPrivateMembers(groupId, { order: sortedWithDirection });
  }
  function getMore() {
    const filters = sorted && { order: sorted };
    fetchPendingPrivateMembers(groupId, filters, nextPage);
  }
  function onAccept(userId) {
    changePPMStatus({ userId, groupId, condition: true });
  }
  function onReject(userId) {
    changePPMStatus({ userId, groupId, condition: false });
  }
  function renderList() {
    return (
      <Table
        dataSource={members}
        columns={columns({
          onAccept,
          loading,
          onReject,
        })}
        onSortBy={onSortBy}
        direction={direction}
        currentOrder={sorted}
      />
    );
  }
  function renderInfinite() {
    return (
      <InfiniteScroll
        pageStart={0}
        loadMore={getMore}
        hasMore={!!nextPage}
        loader={<Loading />}
        threshold={400}
      >
        {renderList()}
      </InfiniteScroll>
    );
  }
  function renderNormal() {
    return (
      <Fragment>
        {renderList()}
        {nextPage && (
          <div className="flex justify-center mt-8 mb-8 padded-container">
            <Button color="orange" onClick={getMore}>
              Load more
            </Button>
          </div>
        )}
      </Fragment>
    );
  }
  if (isIOs) return renderNormal();
  return renderInfinite();
};

const mapStateToProps = (state) => ({
  nextPage: getPPMNext(state),
  members: getPPMembers(state),
  loading: loadingPPM(state),
});

MembersTable.propTypes = {
  groupId: PropTypes.number,
  members: PropTypes.arrayOf(PropTypes.shape({})),
  fetchPendingPrivateMembers: PropTypes.func,
  loading: PropTypes.arrayOf(PropTypes.number),
  nextPage: PropTypes.oneOfType([PropTypes.number, PropTypes.oneOf([null])]),
};

export default connect(mapStateToProps, {
  fetchPendingPrivateMembers: fetchPendingPrivateMembersAction,
  changePPMStatus: changePPMStatusAction,
})(MembersTable);
