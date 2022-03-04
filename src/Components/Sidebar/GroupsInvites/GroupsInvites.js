import React, { useMemo, useEffect } from 'react';
import { connect } from 'react-redux';
import InfiniteScroll from 'react-infinite-scroller';
import PropTypes from 'prop-types';
import { bem } from './index';
import Invitation from './Invitation';
import {
  getMyGroupsInvites,
  getMyProfileId,
  getHasReachedGroupsInvitesPaginationEnd,
} from '../../../selectors/profile';
import { fetchGroupsInvites } from '../../../Actions/actions_user';
import { getGroupsInvitesLoading } from '../../../selectors/requests';
import './GroupsInvites.scss';

const GroupsInvites = ({
  myId,
  invites,
  loading,
  hasReachedEnd,
  fetchInvites,
  hasNewInvites,
  markGroupInvitationsSeen,
}) => {
  useEffect(() => {
    if (hasNewInvites) {
      markGroupInvitationsSeen();
    }
  }, [hasNewInvites]);

  const memoizedInvites = useMemo(
    () => invites.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)),
    [invites]
  );
  function loadMore() {
    fetchInvites({ usePagination: true });
  }
  if (!invites.length && loading) {
    return <p className={bem('loading')}>Loading...</p>;
  }
  return (
    <div className={bem()}>
      <InfiniteScroll
        pageStart={0}
        loadMore={loadMore}
        hasMore={!hasReachedEnd && !loading}
        useWindow={false}
        threshold={100}
      >
        {memoizedInvites.map((invitation) => (
          <Invitation {...invitation} key={invitation.id} myId={myId} />
        ))}
      </InfiniteScroll>
    </div>
  );
};

const mapStateToProps = (state) => ({
  invites: getMyGroupsInvites(state),
  myId: getMyProfileId(state),
  loading: getGroupsInvitesLoading(state),
  hasReachedEnd: getHasReachedGroupsInvitesPaginationEnd(state),
});

GroupsInvites.propTypes = {
  loading: PropTypes.bool,
  invites: PropTypes.arrayOf(PropTypes.shape()),
  hasReachedEnd: PropTypes.bool,
  fetchInvites: PropTypes.func,
  myId: PropTypes.number,
  hasNewInvites: PropTypes.bool,
  markGroupInvitationsSeen: PropTypes.func.isRequired,
};

export default connect(mapStateToProps, {
  fetchInvites: fetchGroupsInvites,
})(GroupsInvites);
