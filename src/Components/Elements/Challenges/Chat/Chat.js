/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */
import React, { useState, useRef, useEffect, useContext } from 'react';
import PropTypes from 'prop-types';
import withSizes from 'react-sizes';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import cx from 'classnames';
import InfiniteScroll from 'react-infinite-scroller';
import { DynamicSizeList as List } from 'react-window';
import AutoSizer from 'react-virtualized-auto-sizer';
import BEMHelper from 'react-bem-helper';
import { connect } from 'react-redux';
import BottomScrollListener from 'react-bottom-scroll-listener';
import { Button, Icon } from 'semantic-ui-react';
import TextareaAutosize from 'react-autosize-textarea';
import defaultChallenge from '../../../../Assets/images/challenge.png';
import EmojiPicker from '../../EmojiPicker';
import Message from './Message';

import * as challengesChatActions from '../../../../Actions/actions_challenges_chat';
import {
  getChallengeThreadHistoryMessages,
  getHasReachedChallengeThreadEnd,
  getSelectedChallengeThread,
  getChallengeThreadLastReadMessageId,
} from '../../../../selectors/challengesChat';
import useReverseScroll from '../../../../hooks/useReverseScroll';
import './Chat.scss';

const bem = BEMHelper({ name: 'ChallengeChat', outputIsString: true });
const ChallengeContext = React.createContext();

const MessageListItem = React.forwardRef(({ data, index, style }, ref) => {
  const challengeId = useContext(ChallengeContext);
  return (
    <div style={style} ref={ref}>
      <Message
        key={data[index]}
        challengeId={challengeId}
        messageId={data[index]}
        prevMessageId={index > 0 ? data[index - 1] : null}
        nextMessageId={index < data.length - 1 ? data[index + 1] : null}
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

function Chat({
  messageIds = [],
  hasReachedEnd,
  fetchThreadMessages,
  sendMessage,
  thread,
  isMobile,
  setLastReadMessage,
  showThreads,
  lastReadMessageId,
  muteChat,
  leaveChat,
}) {
  const [newMessage, setNewMessage] = useState('');
  const [infScrollEnabled, setInfScrollEnabled] = useState(false);
  const feedElem = useRef();
  const isLoadingHistory = useRef(false);
  const [isSendingMessage, setIsSendingMessage] = useState(false);
  const isSendingMessageRef = useRef(false);
  const { onItemsRendered } = useReverseScroll({
    data: messageIds,
    ref: feedElem.current,
  });
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setInfScrollEnabled(true);
    }, 200);

    return () => {
      clearTimeout(timeoutId);
    };
  }, []);
  function handleChatBottomReached() {
    const lastMessageId = messageIds[messageIds.length - 1];
    if (lastReadMessageId !== lastMessageId) {
      setLastReadMessage({ challengeId: thread.id, messageId: lastMessageId });
    }
  }

  useEffect(() => {
    if (feedElem.current && feedElem.current.state.scrollOffset === 0) {
      handleChatBottomReached();
    }
  }, [feedElem.current, thread.unreadMessages]);

  async function handleSendMessage() {
    if (newMessage.length > 0 && !isSendingMessageRef.current) {
      let messageSent = false;
      try {
        isSendingMessageRef.current = true;
        setIsSendingMessage(true);
        await sendMessage({ challengeId: thread.id, message: newMessage });
        messageSent = true;
      } catch (e) {
        toast.error("We couldn't deliver last message, try again");
      }
      isSendingMessageRef.current = false;
      setIsSendingMessage(false);
      if (messageSent) {
        setNewMessage('');
      }
    }
  }

  function handleKeyPress(e) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      e.stopPropagation();
      return handleSendMessage();
    }
  }

  async function loadMoreHistory() {
    if (isLoadingHistory.current) {
      return;
    }
    isLoadingHistory.current = true;
    await fetchThreadMessages(thread.id);
    isLoadingHistory.current = false;
  }

  function onSelectEmoji({ native }) {
    setNewMessage(`${newMessage}${native}`);
  }
  function onMuteChat() {
    muteChat({ challengeId: thread.id, muted: thread.muted });
  }
  function onLeaveChat() {
    leaveChat({ challengeId: thread.id });
  }
  const link =
    thread.type === 'Flash'
      ? `/challenges/flash/${thread.id}`
      : `/challenges/${thread.id}`;
  return (
    <div className={bem()}>
      <div className="sidebar-header flex flex-col">
        <div className="title">
          <div className="ui float-left chat">
            <img alt={thread.name} src={thread.icon || defaultChallenge} />
            <Link className="mr-2" to={link}>
              {thread.name}
            </Link>
          </div>
          <Icon
            className="orange float-right clickable"
            name="chevron left"
            onClick={() => showThreads()}
          />
        </div>
        <div className="flex actions">
          <div className={cx({ active: thread.muted })} onClick={onMuteChat}>
            <Icon name={thread.muted ? 'comment' : 'bell slash'} />
            <span>{thread.muted ? 'Unmute' : 'Mute'} Chat</span>
          </div>
          <div onClick={onLeaveChat}>
            <Icon name="sign-out" />
            <span>Leave Chat</span>
          </div>
        </div>
      </div>
      <ChallengeContext.Provider value={thread.id}>
        <AutoSizer className={bem('list-container')}>
          {({ width, height }) => (
            <BottomScrollListener onBottom={handleChatBottomReached} offset={5}>
              {(scrollRef) => (
                <InfiniteScroll
                  isReverse
                  pageStart={0}
                  loadMore={loadMoreHistory}
                  hasMore={infScrollEnabled && !hasReachedEnd}
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
                    className={cx(bem('list'), {
                      invisible: !infScrollEnabled,
                    })}
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
      </ChallengeContext.Provider>
      <div className="message-form">
        <div>
          <TextareaAutosize
            placeholder="Type something"
            style={{ resize: 'none' }}
            onChange={(e) => setNewMessage(e.target.value)}
            value={newMessage}
            {...(!isMobile && { onKeyPress: handleKeyPress })}
          />
          <EmojiPicker onSelect={onSelectEmoji} />
        </div>
        <span className="options">
          <Button
            className="gmb-primary float-right"
            circular
            disabled={!newMessage.length || isSendingMessage}
            onClick={handleSendMessage}
            icon="send"
          />
        </span>
      </div>
    </div>
  );
}

Chat.propTypes = {
  messageIds: PropTypes.arrayOf(PropTypes.number),
  fetchThreadMessages: PropTypes.func.isRequired,
  muteChat: PropTypes.func,
  hasReachedEnd: PropTypes.bool,
  thread: PropTypes.shape(),
  setLastReadMessage: PropTypes.func.isRequired,
  isMobile: PropTypes.bool,
  showThreads: PropTypes.func,
  leaveChat: PropTypes.func,
  sendMessage: PropTypes.func,
  lastReadMessageId: PropTypes.number,
};

const mapStateToProps = (state, props) => ({
  thread: getSelectedChallengeThread(state, props),
  messageIds: getChallengeThreadHistoryMessages(state, props),
  lastReadMessageId: getChallengeThreadLastReadMessageId(state, props),
  hasReachedEnd: getHasReachedChallengeThreadEnd(state, props),
});

const mapDispatchToProps = {
  fetchThreadMessages: challengesChatActions.fetchThreadMessages,
  setLastReadMessage: challengesChatActions.setLastReadMessage,
  showThreads: challengesChatActions.showThreads,
  muteChat: challengesChatActions.muteChat,
  leaveChat: challengesChatActions.leaveChat,
  sendMessage: challengesChatActions.sendMessage,
};

const ConnectedChat = connect(mapStateToProps, mapDispatchToProps)(Chat);

export default withSizes(({ width }) => ({
  isMobile: width < 768,
}))(ConnectedChat);
