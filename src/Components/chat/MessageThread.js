/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */
import React, {
  useState,
  useCallback,
  useRef,
  useContext,
  useMemo,
  useEffect,
} from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import cx from 'classnames';
import InfiniteScroll from 'react-infinite-scroller';
import { DynamicSizeList as List } from 'react-window';
import AutoSizer from 'react-virtualized-auto-sizer';
import { Link } from 'react-router-dom';
import { Icon } from 'semantic-ui-react';
import BuddiesService from '../../Services/BuddiesService';
import ChatNotificationMessage from './ChatNotificationMessage';
import MessageBox from './MessageBox';
import ThreadItem from './ThreadItem';
import {
  getBuddyForThread,
  isExpired,
  getCurrentUserForThread,
} from '../../utils/Chat';
import {
  getSelectedThread,
  getChatThreadHistoryMessages,
  getHasReachedChatThreadEnd,
  getChatThreadUnreadCount,
} from '../../selectors/chat';
import { getCurrentUserId } from '../../reducers/session/selectors';
import * as chatActions from '../../Actions/action_chat';
import useInterval from '../../hooks/use-interval';
import useReverseScroll from '../../hooks/useReverseScroll';
import BottomScrollListener from '../Utils/BottomScrollListener';
import { buddyHasAccepted as buddyHasAcceptedAction } from '../../Actions/action_buddy_request';

const INTERVAL_TO_POLL = 10 * 1000;

const ChatContext = React.createContext();

const MessageListItem = React.forwardRef(({ data, index, style }, ref) => {
  const chatContext = useContext(ChatContext);
  return (
    <div style={style} ref={ref}>
      <ThreadItem
        key={data[index]}
        messageId={data[index]}
        prevMessageId={index > 0 ? data[index - 1] : null}
        nextMessageId={index < data.length - 1 ? data[index + 1] : null}
        {...chatContext}
      />
    </div>
  );
});

MessageListItem.propTypes = {
  data: PropTypes.arrayOf(PropTypes.number),
  index: PropTypes.number,
  style: PropTypes.shape({}),
};

const MemoMessageListItem = React.memo(MessageListItem);

function MessageThread(props) {
  const {
    thread,
    messageIds = [],
    userId,
    showThreads,
    loading,
    hasReachedEnd,
    fetchThreadMessages,
    unreadCount,
    leaveChat,
    setThreadAsRead,
    buddyHasAccepted,
  } = props;

  const [infScrollEnabled, setInfScrollEnabled] = useState(false);
  const [buddyRequestDeclined, setBuddyRequestDeclined] = useState(false);
  const feedElem = useRef();
  const isLoadingHistory = useRef(false);
  const buddy = getBuddyForThread(thread, userId);
  const user = getCurrentUserForThread(thread, userId);
  const chatContextValue = useMemo(
    () => ({
      userId,
      buddy,
      user,
      threadId: thread.id,
    }),
    [userId, buddy, user, thread]
  );

  const { onItemsRendered } = useReverseScroll({
    data: messageIds,
    ref: feedElem.current,
  });

  useEffect(() => {
    if (!messageIds.length) {
      fetchThreadMessages(thread.id);
    }
  }, []);
  const isBuddyChat = thread.type === 'Buddy Chat';
  const participantMissingAccept =
    thread && (!thread.participantA.accepted || !thread.participantB.accepted);
  const intervalDelay = participantMissingAccept ? INTERVAL_TO_POLL : null;
  const checkRequestStatus = useCallback(() => {
    if (thread && isBuddyChat) {
      BuddiesService.getById(thread.buddyRequest)
        .then(({ data }) => {
          if (data.status === 'declined') {
            setBuddyRequestDeclined(true);
          }
          if (data.status === 'match') {
            buddyHasAccepted({ ...thread, myUserId: userId });
          }
        })
        .catch((e) => {
          console.error(e);
        });
    }
  }, [thread]);

  useInterval(checkRequestStatus, intervalDelay);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setInfScrollEnabled(true);
    }, 200);

    return () => {
      clearTimeout(timeoutId);
    };
  }, []);

  function handleChatBottomReached() {
    if (unreadCount > 0) {
      setThreadAsRead(thread.id);
    }
  }
  function onLeaveChat() {
    leaveChat({ threadId: thread.id });
  }
  async function loadMoreHistory() {
    if (isLoadingHistory.current) {
      return;
    }
    isLoadingHistory.current = true;
    await fetchThreadMessages(thread.id);
    isLoadingHistory.current = false;
  }

  const myInformationInThread = getBuddyForThread(thread, buddy.id);

  const isThreadExpired = isExpired(thread.expiring);
  const withNotificationClass = !(
    buddy.accepted && myInformationInThread.accepted
  );
  return (
    <React.Fragment>
      <div className="sidebar-header">
        <div className="ui float-left chat">
          Chat with
          <Link to={`/profile/${buddy.id}`}>{buddy.name}</Link>
          {thread.category && (
            <i className={`chat-icon gmb-category-${thread.category.slug}`} />
          )}
          {thread.group && (
            <Link to={`/groups/${thread.group.id}`} className="group">
              <img src={thread.group.icon} alt={thread.group.name} />
              <div>{thread.group.name}</div>
            </Link>
          )}
        </div>
        <Icon
          className="orange float-right clickable"
          name="chevron left"
          onClick={() => showThreads()}
        />
      </div>
      {!isBuddyChat && (
        <div className="flex header-actions">
          {buddy.description && <div>{buddy.description}</div>}
          <div onClick={onLeaveChat} className="leave">
            <Icon name="sign-out" />
            <span>Leave Chat</span>
          </div>
        </div>
      )}
      <div className="sidebar-content">
        <div
          className={cx('messages', {
            withNotification: withNotificationClass && isBuddyChat,
            acceptedByBuddy: buddy.accepted,
          })}
          id="messages"
        >
          <ChatContext.Provider value={chatContextValue}>
            <AutoSizer>
              {({ width, height }) => (
                <BottomScrollListener
                  onBottom={handleChatBottomReached}
                  offset={5}
                >
                  {(scrollRef) => (
                    <InfiniteScroll
                      isReverse
                      pageStart={0}
                      loadMore={loadMoreHistory}
                      hasMore={(infScrollEnabled || true) && !hasReachedEnd}
                      loader={null}
                      threshold={100}
                      useWindow={false}
                      getScrollParent={() => {
                        if (scrollRef) {
                          return scrollRef.current;
                        }
                        return undefined;
                      }}
                    >
                      <List
                        className={cx({ invisible: !infScrollEnabled })}
                        ref={feedElem}
                        width={width}
                        height={height}
                        itemCount={messageIds.length}
                        itemData={messageIds}
                        onItemsRendered={onItemsRendered}
                        outerRef={scrollRef}
                      >
                        {MemoMessageListItem}
                      </List>
                    </InfiniteScroll>
                  )}
                </BottomScrollListener>
              )}
            </AutoSizer>
          </ChatContext.Provider>

          {loading && <p>Loading...</p>}

          {isBuddyChat && (
            <ChatNotificationMessage
              loading={loading}
              thread={thread}
              buddyRequestDeclined={buddyRequestDeclined}
              buddy={buddy}
              myInformationInThread={myInformationInThread}
              messageCount={messageIds.length}
            />
          )}
        </div>
        <MessageBox
          date={buddyRequestDeclined ? null : thread.expiring}
          disabled={isThreadExpired || buddyRequestDeclined}
          buddy_request={thread.buddyRequest}
        />
      </div>
    </React.Fragment>
  );
}

MessageThread.propTypes = {
  loading: PropTypes.bool,
  messageIds: PropTypes.arrayOf(PropTypes.number),
  showThreads: PropTypes.func,
  thread: PropTypes.shape(),
  userId: PropTypes.number,
  hasReachedEnd: PropTypes.bool,
  fetchThreadMessages: PropTypes.func.isRequired,
  unreadCount: PropTypes.number,
  setThreadAsRead: PropTypes.func.isRequired,
  buddyHasAccepted: PropTypes.func,
  leaveChat: PropTypes.func,
};

function mapStateToProps(state) {
  const thread = getSelectedThread(state);
  const userId = parseInt(getCurrentUserId(state), 10);
  if (!thread) {
    return {
      userId,
    };
  }
  return {
    userId,
    thread,
    messageIds: getChatThreadHistoryMessages(state, { threadId: thread.id }),
    hasReachedEnd: getHasReachedChatThreadEnd(state, { threadId: thread.id }),
    unreadCount: getChatThreadUnreadCount(state, { threadId: thread.id }),
  };
}

export default connect(mapStateToProps, {
  showThreads: chatActions.showThreads,
  fetchThreadMessages: chatActions.fetchThreadMessages,
  setThreadAsRead: chatActions.setThreadAsRead,
  buddyHasAccepted: buddyHasAcceptedAction,
  leaveChat: chatActions.leaveChat,
})(MessageThread);
