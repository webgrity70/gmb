import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import TextareaAutosize from 'react-autosize-textarea';
import withSizes from 'react-sizes';
import { toast } from 'react-toastify';
import { Button } from 'semantic-ui-react';

import Countdown from 'react-countdown';
import Counter from '../Dashboard/Counter';
import { TrackEvent } from '../../Services/TrackEvent';
import { isExpired } from '../../utils/Chat';
import * as chatActions from '../../Actions/action_chat';
import {
  getSelectedThreadId,
  getChatThreadMessageDraft,
} from '../../selectors/chat';
import EmojiPicker from '../Elements/EmojiPicker';
import { sendMessage } from '../../Services/SideBarService';

class MessageBox extends Component {
  constructor(props) {
    super(props);
    this.renderTime = this.renderTime.bind(this);
    this.state = {
      loading: false,
    };
  }

  handleChange = (event) => {
    if (event.key === 'Enter') return;
    const { onMessageDraftChanged, threadId } = this.props;
    onMessageDraftChanged({ message: event.target.value, threadId });
  };

  onSelectEmoji = ({ native }) => {
    const { onMessageDraftChanged, messageText, threadId } = this.props;
    onMessageDraftChanged({ message: `${messageText}${native}`, threadId });
  };

  handleKeyPress = (event) => {
    const { messageText } = this.props;
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      event.stopPropagation();
      return this.send(messageText);
    }
  };

  async send(message) {
    const { threadId, onMessageDraftChanged } = this.props;
    if (this.loading || !message) {
      return;
    }
    this.setState({ loading: true });
    let messageSent = false;
    try {
      this.loading = true;
      await sendMessage(threadId, message);
      messageSent = true;
    } catch (e) {
      toast.error("We couldn't deliver last message, try again");
    }
    this.loading = false;
    this.setState({ loading: false });
    if (messageSent) {
      TrackEvent('chat-message-sent');
      onMessageDraftChanged({ message: '', threadId });
    }
  }

  renderTime = (time) => (
    <span className="timer">
      <Counter {...time} showOnlyHours /> left
    </span>
  );

  render() {
    const { date, disabled, isMobile, messageText } = this.props;
    const { loading } = this.state;
    return (
      <div>
        <div className="message-form">
          <div>
            <TextareaAutosize
              placeholder="Type something"
              style={{ resize: 'none' }}
              disabled={disabled}
              value={messageText}
              onChange={this.handleChange}
              {...(!isMobile && { onKeyPress: this.handleKeyPress })}
            />
            <EmojiPicker onSelect={this.onSelectEmoji} />
          </div>
          <span className="options">
            <Button
              className="gmb-primary float-right"
              circular
              disabled={disabled || loading}
              onClick={() => this.send(messageText)}
              icon="send"
            />
          </span>
        </div>
        <span>
          {date &&
            (!isExpired(date) ? (
              <Countdown
                date={date}
                renderer={this.renderTime}
                className="counter"
              />
            ) : (
              'No more time left!'
            ))}
        </span>
      </div>
    );
  }
}

MessageBox.propTypes = {
  date: PropTypes.instanceOf(Date).isRequired,
  disabled: PropTypes.bool.isRequired,
  threadId: PropTypes.number,
  isMobile: PropTypes.bool,
  onMessageDraftChanged: PropTypes.func.isRequired,
  messageText: PropTypes.string,
};

function mapStateToProps(state) {
  const threadId = getSelectedThreadId(state);
  return {
    threadId,
    messageText: getChatThreadMessageDraft(state, { threadId }) || '',
  };
}

const Connected = connect(mapStateToProps, {
  onMessageDraftChanged: chatActions.messageDraftChanged,
})(MessageBox);

export default withSizes(({ width }) => ({
  isMobile: width < 768,
}))(Connected);
