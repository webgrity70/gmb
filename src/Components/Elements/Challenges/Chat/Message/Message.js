import React from 'react';
import moment from 'moment';
import PropTypes from 'prop-types';
import isEmpty from 'lodash/isEmpty';
import { connect } from 'react-redux';
import cx from 'classnames';
import { getChallengeMessageById } from '../../../../../selectors/challengesChat';
import { getMyProfileId } from '../../../../../selectors/profile';
import SelfMessage from '../../../../ChatThreads/SelfMessage';
import UserMessage from '../../../../ChatThreads/UserMessage';
import './Message.scss';

function Message({ message, prevMessage, userId }) {
  if (!message) {
    return null;
  }

  let challengePrevious = false;
  const isSameUserPrevious = prevMessage
    ? prevMessage.sentBy.id === message.sentBy.id
    : false;
  if (isSameUserPrevious) {
    challengePrevious =
      moment(message.sentOn).diff(prevMessage.sentOn, 'minutes') <= 10;
  }
  if (userId === message.sentBy.id || isEmpty(message.sentBy)) {
    return (
      <SelfMessage
        className={cx(
          'mr-2 pb-2 ChallengeChatMessage__self-msg',
          challengePrevious ? 'pt-2' : 'mt-2'
        )}
        timestamp={message.sentOn}
        user={message.sentBy}
        message={message.message}
        showAvatar={!isEmpty(message.sentBy)}
        groupPrevious={challengePrevious}
      />
    );
  }

  return (
    <UserMessage
      className={cx(
        'mr-2 pb-2 ChallengeChatMessage__user-msg',
        challengePrevious ? 'pt-2' : 'mt-2'
      )}
      timestamp={message.sentOn}
      user={message.sentBy}
      message={message.message}
      groupPrevious={challengePrevious}
    />
  );
}

Message.propTypes = {
  message: PropTypes.shape(),
  prevMessage: PropTypes.shape(),
  userId: PropTypes.number,
};

const mapStateToProps = (state, props) => ({
  message: getChallengeMessageById(state, props),
  prevMessage: getChallengeMessageById(state, {
    challengeId: props.challengeId,
    messageId: props.prevMessageId,
  }),
  userId: getMyProfileId(state),
});

const ConnectedMessage = connect(mapStateToProps, {})(Message);

ConnectedMessage.propTypes = {
  challengeId: PropTypes.number,
  messageId: PropTypes.number,
  prevMessageId: PropTypes.number,
};
export default ConnectedMessage;
