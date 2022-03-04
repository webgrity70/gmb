import React, { Fragment, useEffect } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Button, Grid, Icon } from 'semantic-ui-react';
import InfiniteScroll from 'react-infinite-scroller';
import {
  getNextMembersPage,
  getGroupMembersParams,
  getMembersOrderDirection,
  getMembersPaginationOrderName,
} from '../../../selectors/groups';

import { contactMember as contactMemberAction } from '../../../Actions/actions_groups';
import { selectThread as selectThreadAction } from '../../../Actions/action_chat';

import { getMyProfileId } from '../../../selectors/profile';
import Loading from '../../Loading';
import {
  fetchMembers as fetchMembersAction,
  kickUserFromGroup as kickUserFromGroupAction,
  changeMembersOrder,
} from '../../../Actions/actions_groups';
import Table from '../../Elements/Table/Table';
import columns from './columns';
import ProfileCard from '../../Elements/ProfileCard';
import { getGroupMembersLoading } from '../../../selectors/requests';
import './MembersTable.scss';
import { compose } from 'recompose';
import withSizes from 'react-sizes';

const MembersTable = ({
  id,
  members,
  changeOrder,
  fetchMembers,
  hasPermission,
  isPrivate,
  myId,
  order,
  direction,
  nextPage,
  loading,
  params,
  isAdmin,
  kickUserFromGroup,
  isMobile,
  selectThread,
  contactMember,
}) => {
  const isIOs =
    !!window.navigator.platform && /iPad|iPhone|iPod/.test(navigator.platform);
  useEffect(() => {
    fetchMembers(id, params, nextPage);
  }, [params]);
  function getMore() {
    if (nextPage && nextPage > 1) fetchMembers(id, params, nextPage);
  }
  function onEject(userId) {
    kickUserFromGroup({ groupId: id, userId });
  }

  async function openChat(event, { userId }) {
    try {
      const { thread } = await contactMember({ userId, groupId: id });
      if (thread) selectThread({ threadId: thread });
    } catch (e) {
      console.error(e);
    }
  }

  function renderList() {
    if (isMobile) {
      return (
        <Grid columns={2} padded stackable>
          {members.map((buddy) => {
            const canOpenChat = isAdmin && buddy.id !== myId;
            return (
              <Grid.Column key={buddy.id}>
                <ProfileCard
                  buddy={buddy}
                  actionsSection={
                    <div className="flex">
                      {canOpenChat ? (
                        <button
                          className="GroupMembersTable__ProfileCardChat"
                          onClick={(event) =>
                            openChat(event, { userId: buddy.id })
                          }
                        >
                          <Icon name="comment" />
                          <span>Open Chat</span>
                        </button>
                      ) : (
                        <span />
                      )}
                    </div>
                  }
                />
              </Grid.Column>
            );
          })}
        </Grid>
      );
    }
    return (
      <Table
        dataSource={members}
        columns={columns({
          myId,
          isAdmin,
          onEject,
          groupId: id,
          isPrivate,
          hasPermission,
        })}
        onSortBy={changeOrder}
        direction={direction}
        currentOrder={order}
      />
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
  return (
    <InfiniteScroll
      pageStart={0}
      loadMore={getMore}
      hasMore={!!nextPage && !loading}
      loader={<Loading />}
      threshold={400}
    >
      {renderList()}
    </InfiniteScroll>
  );
};

const mapStateToProps = (state) => {
  const myId = getMyProfileId(state);
  return {
    nextPage: getNextMembersPage(state),
    myId,
    direction: getMembersOrderDirection(state),
    order: getMembersPaginationOrderName(state),
    params: getGroupMembersParams(state),
    loading: getGroupMembersLoading(state),
  };
};

MembersTable.propTypes = {
  id: PropTypes.number,
  isAdmin: PropTypes.bool,
  isPrivate: PropTypes.bool,
  hasPermission: PropTypes.bool,
  myId: PropTypes.number,
  kickUserFromGroup: PropTypes.func,
  members: PropTypes.arrayOf(PropTypes.shape({})),
  fetchMembers: PropTypes.func,
  params: PropTypes.shape(),
  changeOrder: PropTypes.func,
  loading: PropTypes.bool,
  order: PropTypes.oneOfType([PropTypes.string, PropTypes.oneOf([null])]),
  direction: PropTypes.oneOfType([PropTypes.string, PropTypes.oneOf([null])]),
  nextPage: PropTypes.oneOfType([PropTypes.number, PropTypes.oneOf([null])]),
  isMobile: PropTypes.bool,
  contactMember: PropTypes.func,
  selectThread: PropTypes.func,
};

export default compose(
  withSizes(({ width }) => ({
    isMobile: width < 768,
  })),
  connect(mapStateToProps, {
    fetchMembers: fetchMembersAction,
    kickUserFromGroup: kickUserFromGroupAction,
    changeOrder: changeMembersOrder,
    contactMember: contactMemberAction,
    selectThread: selectThreadAction,
  })
)(MembersTable);
