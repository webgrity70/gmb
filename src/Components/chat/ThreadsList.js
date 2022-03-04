import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Icon, Label, List } from 'semantic-ui-react';
import { getBuddyForThread } from '../../utils/Chat';
import {
  getAreChatThreadsLoading,
  getChatThreadsList,
  getChatThreadUnreadCount,
} from '../../selectors/chat';
import { getCurrentUserId } from '../../reducers/session/selectors';
import * as chatActions from '../../Actions/action_chat';

function Thread({ unreadCount, selectThread, thread, userId }) {
  const buddy = getBuddyForThread(thread, parseInt(userId, 10));
  const isOnline = buddy.lastOnline === null;
  const showRightContent = !!thread.expiring || unreadCount > 0 || isOnline;
  return (
    <List.Item
      className="thread clickable"
      key={thread.id}
      onClick={() => selectThread({ threadId: thread.id })}
    >
      <List.Content className="thread-name">
        {thread.category && (
          <i
            className={`icon gmb-category-${thread.category.slug} ${
              unreadCount > 0 ? 'active' : ''
            }`}
          />
        )}
        {thread.group && (
          <img src={thread.group.icon} alt={thread.group.icon} />
        )}
        <span>{buddy.name}</span>
      </List.Content>

      {showRightContent && (
        <List.Content
          floated="right"
          className="flex justify-center items-center"
        >
          {isOnline && <div className="thread-online" />}
          {!!thread.expiring && <Icon name="clock outline" color="orange" />}
          {unreadCount > 0 && <Label color="orange">{unreadCount}</Label>}
        </List.Content>
      )}
    </List.Item>
  );
}

Thread.propTypes = {
  unreadCount: PropTypes.number,
  selectThread: PropTypes.func,
  thread: PropTypes.shape(),
  userId: PropTypes.string,
};

const ConnectedThread = connect(
  (state, props) => ({
    unreadCount: getChatThreadUnreadCount(state, { threadId: props.thread.id }),
    userId: getCurrentUserId(state),
  }),
  {
    selectThread: chatActions.selectThread,
  }
)(Thread);

const ThreadsList = ({ threads, loading }) => (
  <React.Fragment>
    <div className="sidebar-content">
      {threads.length === 0 && (
        <p className="text-center">
          {loading ? 'Loading...' : 'There are no buddies.'}
        </p>
      )}
      <List celled>
        {threads.map((thread) => (
          <ConnectedThread thread={thread} key={thread.id} />
        ))}
      </List>
    </div>
  </React.Fragment>
);

ThreadsList.propTypes = {
  loading: PropTypes.bool,
  threads: PropTypes.arrayOf(PropTypes.shape()),
};

function buddiesMapStateToProps(state) {
  return {
    threads: getChatThreadsList(state),
    loading: getAreChatThreadsLoading(state),
  };
}

export default connect(buddiesMapStateToProps)(ThreadsList);
