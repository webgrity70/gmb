import React, { Fragment } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import InfiniteScroll from 'react-infinite-scroller';
import PropTypes from 'prop-types';
import { Icon, Label, List, Button } from 'semantic-ui-react';
import {
  getChatGroupsThreadsList,
  getAreChatGroupsThreadsLoading,
  getAreChatJoinableGroupsThreadsLoading,
  getGroupThreadUnreadCountFromProps,
  getHasReachedGroupsPaginationEnd,
  getHasReachedJoinableGroupsPaginationEnd,
} from '../../selectors/groupChat';
import isIos from '../../utils/isIos';
import { getCurrentUserId } from '../../reducers/session/selectors';
import * as groupChatActions from '../../Actions/action_group_chat';
import { GROUP_STAFF } from '../../constants';

function Thread({ unreadCount, initThread, joinChat, thread }) {
  const showRightContent =
    (!!thread.expiring || unreadCount > 0) && !thread.canJoin;
  const isStaff = GROUP_STAFF.includes(thread.permission);
  return (
    <List.Item
      className="thread clickable"
      key={thread.id}
      onClick={() => initThread(thread.id)}
    >
      <List.Content className="thread-name">
        <img alt={thread.name} src={thread.icon} />
        <span>
          {thread.name}
          {isStaff && (
            <span className="permission">{`  ${thread.permission}`}</span>
          )}
        </span>
      </List.Content>
      {showRightContent && (
        <List.Content floated="right">
          {!!thread.expiring && <Icon name="clock outline" color="orange" />}
          {unreadCount > 0 && <Label color="orange">{unreadCount}</Label>}
        </List.Content>
      )}
      {thread.canJoin && (
        <Button className="can-join" onClick={() => joinChat(thread.id)}>
          JOIN
        </Button>
      )}
    </List.Item>
  );
}

Thread.propTypes = {
  unreadCount: PropTypes.number,
  initThread: PropTypes.func,
  joinChat: PropTypes.func,
  thread: PropTypes.shape(),
};

const ConnectedThread = connect(
  (state, props) => ({
    unreadCount: getGroupThreadUnreadCountFromProps(state, {
      groupId: props.thread.id,
    }),
    userId: getCurrentUserId(state),
  }),
  {
    initThread: groupChatActions.initThread,
    joinChat: groupChatActions.joinChat,
  }
)(Thread);

const GroupsThreadsList = ({
  threads,
  loading,
  hasJoinableGroupsReachedEnd,
  hasGroupsReachedEnd,
  fetchGroupsThreads,
  fetchJoinableGroupsThreads,
}) => {
  const hasMoreGroups = !hasGroupsReachedEnd && !loading;
  const hasMoreJoinableGroups = !hasJoinableGroupsReachedEnd && !loading;
  const hasMore = hasMoreGroups || hasMoreJoinableGroups;
  async function loadMoreHistory() {
    await fetchGroupsThreads({ usePagination: true });
  }
  async function loadMoreJoinableHistory() {
    await fetchJoinableGroupsThreads({ usePagination: true });
  }
  const loadMoreFunc = !hasJoinableGroupsReachedEnd
    ? loadMoreJoinableHistory
    : loadMoreHistory;
  function renderList() {
    if (threads.length > 0) {
      return (
        <List celled>
          {threads.map((thread) => (
            <ConnectedThread thread={thread} key={thread.id} />
          ))}
        </List>
      );
    }
    return (
      <div className="text-center mt-8">
        You have no groups. <Link to="/groups">Join one!</Link>
      </div>
    );
  }
  function renderInfinite() {
    return (
      <InfiniteScroll
        pageStart={0}
        loadMore={loadMoreFunc}
        hasMore={hasMore}
        loader={null}
        useWindow={false}
        getScrollParent={() => {
          const containers = document.getElementsByClassName(
            'TabsContainer__body'
          );
          return containers[containers.length - 1];
        }}
      >
        {renderList()}
      </InfiniteScroll>
    );
  }
  function renderNormal() {
    return (
      <Fragment>
        {renderList()}
        {hasMore && (
          <div className="flex justify-center mt-8 mb-8 padded-container">
            <Button color="orange" onClick={loadMoreFunc}>
              Load more
            </Button>
          </div>
        )}
      </Fragment>
    );
  }
  function conditionalRender() {
    if (isIos) return renderNormal();
    return renderInfinite();
  }
  return (
    <React.Fragment>
      <div className="sidebar-content">
        {threads.length === 0 && (
          <p className="text-center">{loading ? 'Loading...' : null}</p>
        )}
        {conditionalRender()}
      </div>
    </React.Fragment>
  );
};

GroupsThreadsList.propTypes = {
  loading: PropTypes.bool,
  hasGroupsReachedEnd: PropTypes.bool,
  hasJoinableGroupsReachedEnd: PropTypes.bool,
  fetchGroupsThreads: PropTypes.func,
  fetchJoinableGroupsThreads: PropTypes.func,
  threads: PropTypes.arrayOf(PropTypes.shape()),
};

function mapStateToProps(state, props) {
  return {
    threads: getChatGroupsThreadsList(state),
    loading:
      getAreChatGroupsThreadsLoading(state) ||
      getAreChatJoinableGroupsThreadsLoading(state),
    hasGroupsReachedEnd: getHasReachedGroupsPaginationEnd(state, props),
    hasJoinableGroupsReachedEnd: getHasReachedJoinableGroupsPaginationEnd(
      state,
      props
    ),
  };
}
const mapDispatchToProps = {
  fetchGroupsThreads: groupChatActions.fetchGroupsThreads,
  fetchJoinableGroupsThreads: groupChatActions.fetchJoinableGroupsThreads,
};

export default connect(mapStateToProps, mapDispatchToProps)(GroupsThreadsList);
