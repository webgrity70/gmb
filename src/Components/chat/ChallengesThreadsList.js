import React, { Fragment } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import InfiniteScroll from 'react-infinite-scroller';
import PropTypes from 'prop-types';
import { Icon, Label, List, Button } from 'semantic-ui-react';
import {
  getChatChallengesThreadsList,
  getAreChatChallengesThreadsLoading,
  getChallengeThreadUnreadCountFromProps,
  getHasReachedChallengesPaginationEnd,
} from '../../selectors/challengesChat';
import isIos from '../../utils/isIos';
import defaultChallenge from '../../Assets/images/challenge.png';
import { getCurrentUserId } from '../../reducers/session/selectors';
import { GROUP_STAFF } from '../../constants';
import * as challengeChatActions from '../../Actions/actions_challenges_chat';

function Thread({ unreadCount, initThread, thread }) {
  const showRightContent = !!thread.expiring || unreadCount > 0;
  const isStaff = GROUP_STAFF.includes(thread.permission);
  return (
    <List.Item
      className="thread clickable"
      key={thread.id}
      onClick={() => initThread(thread.id)}
    >
      <List.Content className="thread-name">
        <img alt={thread.name} src={thread.icon || defaultChallenge} />
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
    </List.Item>
  );
}

Thread.propTypes = {
  unreadCount: PropTypes.number,
  initThread: PropTypes.func,
  thread: PropTypes.shape(),
};

const ConnectedThread = connect(
  (state, props) => ({
    unreadCount: getChallengeThreadUnreadCountFromProps(state, {
      challengeId: props.thread.id,
    }),
    userId: getCurrentUserId(state),
  }),
  {
    initThread: challengeChatActions.initThread,
  }
)(Thread);

const ChallengesThreadsList = ({
  threads,
  loading,
  hasChallengesReachedEnd,
  fetchChallengesThreads,
}) => {
  const hasMore = !hasChallengesReachedEnd && !loading;
  async function loadMoreHistory() {
    await fetchChallengesThreads({ usePagination: true });
  }
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
        You haven’t joined any challenges.{' '}
        <Link to="/challenges">Join one!</Link>
      </div>
    );
  }
  function renderInfinite() {
    return (
      <InfiniteScroll
        pageStart={0}
        loadMore={loadMoreHistory}
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
            <Button color="orange" onClick={loadMoreHistory}>
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
        {threads.length === 0 && loading && (
          <p className="text-center">{loading ? 'Loading...' : null}</p>
        )}
        {conditionalRender()}
      </div>
    </React.Fragment>
  );
};

ChallengesThreadsList.propTypes = {
  loading: PropTypes.bool,
  hasChallengesReachedEnd: PropTypes.bool,
  fetchChallengesThreads: PropTypes.func,
  threads: PropTypes.arrayOf(PropTypes.shape()),
};

function mapStateToProps(state, props) {
  return {
    threads: getChatChallengesThreadsList(state),
    loading: getAreChatChallengesThreadsLoading(state),
    hasChallengesReachedEnd: getHasReachedChallengesPaginationEnd(state, props),
  };
}
const mapDispatchToProps = {
  fetchChallengesThreads: challengeChatActions.fetchChallengesThreads,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ChallengesThreadsList);
