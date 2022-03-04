import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import cx from 'classnames';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { getChatThreadMessageById } from '../../selectors/chat';
import SelfMessage from '../ChatThreads/SelfMessage';
import UserMessage from '../ChatThreads/UserMessage';

import './ThreadItem.scss';

const ThreadItem = ({ message, prevMessage, user, userId, buddy }) => {
  if (!message) {
    return null;
  }

  let groupPrevious = false;
  const isSameUserPrevious = prevMessage
    ? prevMessage.sentBy === message.sentBy
    : false;
  if (isSameUserPrevious) {
    groupPrevious =
      moment(message.sentOn).diff(prevMessage.sentOn, 'minutes') <= 10;
  }

  if (userId === message.sentBy || !message.sentBy) {
    return (
      <div className="d-flex">
        <SelfMessage
          className={cx(
            'pb-2 ThreadItem__self-msg',
            groupPrevious ? 'pt-2' : 'mt-2'
          )}
          timestamp={message.sentOn}
          user={user}
          showAvatar={!!message.sentBy}
          message={message.message}
          groupPrevious={groupPrevious}
        />
      </div>
    );
  }

  return (
    <div className="d-flex">
      <UserMessage
        className={cx(
          'pb-2 ThreadItem__user-msg',
          groupPrevious ? 'pt-2' : 'mt-2'
        )}
        timestamp={message.sentOn}
        user={buddy}
        message={message.message}
        groupPrevious={groupPrevious}
      />
    </div>
  );
};

ThreadItem.propTypes = {
  buddy: PropTypes.shape({}),
  message: PropTypes.shape({}),
  prevMessage: PropTypes.shape({}),
  nextMessage: PropTypes.shape({}),
  history: PropTypes.shape({}),
  user: PropTypes.shape({}),
  userId: PropTypes.number,
};

function mapStateToProps(state, props) {
  return {
    message: getChatThreadMessageById(state, props),
    prevMessage: getChatThreadMessageById(state, {
      threadId: props.threadId,
      messageId: props.prevMessageId,
    }),
  };
}

export default connect(mapStateToProps)(withRouter(ThreadItem));
