import React from 'react';
import moment from 'moment';
import PropTypes from 'prop-types';
import isEmpty from 'lodash/isEmpty';
import { connect } from 'react-redux';
import cx from 'classnames';
import { getGroupMessageById } from '../../../../selectors/groupChat';
import { getMyProfileId } from '../../../../selectors/profile';
import SelfMessage from '../../../ChatThreads/SelfMessage';
import UserMessage from '../../../ChatThreads/UserMessage';
import './Message.scss';

function Message({ message, prevMessage, userId }) {
  if (!message) {
    return null;
  }

  let groupPrevious = false;
  const isSameUserPrevious = prevMessage
    ? prevMessage.sentBy.id === message.sentBy.id
    : false;
  if (isSameUserPrevious) {
    groupPrevious =
      moment(message.sentOn).diff(prevMessage.sentOn, 'minutes') <= 10;
  }
  if (userId === message.sentBy.id || isEmpty(message.sentBy)) {
    return (
      <SelfMessage
        className={cx(
          'mr-2 pb-2 GroupChatMessage__self-msg',
          groupPrevious ? 'pt-2' : 'mt-2'
        )}
        timestamp={message.sentOn}
        user={message.sentBy}
        message={message.message}
        showAvatar={!isEmpty(message.sentBy)}
        groupPrevious={groupPrevious}
      />
    );
  }

  return (
    <UserMessage
      className={cx(
        'mr-2 pb-2 GroupChatMessage__user-msg',
        groupPrevious ? 'pt-2' : 'mt-2'
      )}
      timestamp={message.sentOn}
      user={message.sentBy}
      message={message.message}
      groupPrevious={groupPrevious}
    />
  );
}

Message.propTypes = {
  message: PropTypes.shape({}),
  prevMessage: PropTypes.shape({}),
  nextMessage: PropTypes.shape({}),
  userId: PropTypes.number,
};

const mapStateToProps = (state, props) => ({
  message: getGroupMessageById(state, props),
  prevMessage: getGroupMessageById(state, {
    groupId: props.groupId,
    messageId: props.prevMessageId,
  }),
  userId: getMyProfileId(state),
});

const ConnectedMessage = connect(mapStateToProps, {})(Message);

ConnectedMessage.propTypes = {
  groupId: PropTypes.number,
  messageId: PropTypes.number,
  prevMessageId: PropTypes.number,
};
export default ConnectedMessage;
