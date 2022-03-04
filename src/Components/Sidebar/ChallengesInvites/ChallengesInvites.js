import React, { useMemo, useEffect } from 'react';
import { connect } from 'react-redux';
import InfiniteScroll from 'react-infinite-scroller';
import PropTypes from 'prop-types';
import { bem } from './utils';
import Invitation from './Invitation';
import {
  getMyChallengesInvites,
  getMyProfileId,
  getHasReachedChallengesInvitesPaginationEnd,
} from '../../../selectors/profile';
import { fetchChallengesInvites } from '../../../Actions/actions_user';
import { getChallengesInvitesLoading } from '../../../selectors/requests';
import './ChallengesInvites.scss';

const ChallengesInvites = ({
  myId,
  invites,
  loading,
  hasReachedEnd,
  fetchInvites,
  closeSidebarFunction,
  hasNewInvites,
  markChallengeInvitationsSeen,
}) => {
  useEffect(() => {
    if (hasNewInvites) {
      markChallengeInvitationsSeen();
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
          <Invitation
            {...invitation}
            key={invitation.id}
            closeSidebarFunction={closeSidebarFunction}
            myId={myId}
          />
        ))}
      </InfiniteScroll>
    </div>
  );
};

const mapStateToProps = (state) => ({
  invites: getMyChallengesInvites(state),
  myId: getMyProfileId(state),
  loading: getChallengesInvitesLoading(state),
  hasReachedEnd: getHasReachedChallengesInvitesPaginationEnd(state),
});

ChallengesInvites.propTypes = {
  loading: PropTypes.bool,
  invites: PropTypes.arrayOf(PropTypes.shape()),
  hasReachedEnd: PropTypes.bool,
  closeSidebarFunction: PropTypes.func,
  fetchInvites: PropTypes.func,
  myId: PropTypes.number,
  hasNewInvites: PropTypes.bool,
  markChallengeInvitationsSeen: PropTypes.func.isRequired,
};

export default connect(mapStateToProps, {
  fetchInvites: fetchChallengesInvites,
})(ChallengesInvites);
