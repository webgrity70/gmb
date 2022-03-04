/* eslint-disable react/sort-comp */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import { Button, Icon } from 'semantic-ui-react';
import { Link } from 'react-router-dom';
import withSizes from 'react-sizes';
import { toast } from 'react-toastify';
import { connect } from 'react-redux';
import Countdown from 'react-countdown';
import Avatar from '../../Elements/Avatar';
import WarningModal from '../../chat/WarningModal';
import BuddiesService from '../../../Services/BuddiesService';
import Helpers from '../../Utils/Helpers';
import CategoryIcon from '../../Utils/CategoryIcon';
import Counter from '../../Dashboard/Counter';
import { TrackEvent } from '../../../Services/TrackEvent';
import { isExpired } from '../../../utils/Chat';
import {
  getUserCategories,
  getUserCategoriesSlot,
} from '../../../selectors/profile';
import ProfileService from '../../../Services/ProfileService';
import { fetchUserCategories as fetchUserCategoriesAction } from '../../../Actions/actions_profile';
import './BuddyRequest.scss';

class BuddyRequest extends Component {
  constructor(props) {
    super(props);

    this.state = {
      processing: false,
      openWarningBuddyPopup: false,
      openWarningSlotsPopup: false,
      currentBuddyId: null,
    };

    this.decline = this.decline.bind(this);
    this.revoke = this.revoke.bind(this);
    this.onSuccess = this.onSuccess.bind(this);
    this.onError = this.onError.bind(this);
    this.acceptChat = this.acceptChat.bind(this);
    this.openChatWithBuddy = this.openChatWithBuddy.bind(this);
  }

  onChangeBuddy = (_, { value }) => {
    this.setState({
      currentBuddyId: value,
      openWarningBuddyPopup: true,
      openWarningSlotsPopup: false,
    });
  };

  onSuccess(response) {
    const { getBuddyRequests, fetchUserCategories, user } = this.props;
    Helpers.createToast(response.data || response);
    getBuddyRequests(true);
    fetchUserCategories(user.pk);

    this.setState({
      processing: false,
      currentBuddyId: null,
      openWarningBuddyPopup: false,
      openWarningSlotsPopup: false,
    });
    TrackEvent(this.intercomEvent);
  }

  onError(response) {
    this.setState({
      processing: false,
      currentBuddyId: null,
      openWarningBuddyPopup: false,
      openWarningSlotsPopup: false,
    });
    Helpers.createToast(response.data || response);
  }

  resetFlow = () => {
    this.setState({
      currentBuddyId: null,
      openWarningBuddyPopup: false,
      openWarningSlotsPopup: false,
    });
  };

  accept = async (category) => {
    const { request } = this.props;
    const { currentBuddyId } = this.state;
    const sameCategory = category.id === request.category.pk;
    if (!currentBuddyId || sameCategory) {
      this.intercomEvent = 'chat-buddy-accept';
      BuddiesService.accept(request.id).then(this.onSuccess, this.onError);
    } else {
      const removeResponse = await ProfileService.removeCategory({
        categoryId: category.id,
      });
      if (removeResponse.status === 200) {
        this.intercomEvent = 'chat-buddy-accept';
        BuddiesService.accept(request.id).then(this.onSuccess, this.onError);
      } else {
        toast.error(removeResponse.data.message);
        this.resetFlow();
      }
    }
  };

  decline() {
    const { request } = this.props;
    this.intercomEvent = 'chat-buddy-decline';
    this.setState({ processing: true });
    BuddiesService.decline(request.id).then(this.onSuccess, this.onError);
  }

  revoke() {
    const { request } = this.props;
    this.setState({ processing: true });
    this.intercomEvent = 'chat-buddy-revoke';
    BuddiesService.revoke(request.id).then(this.onSuccess, this.onError);
  }

  acceptChat() {
    const { request } = this.props;
    BuddiesService.acceptChat(request.id).then(() => {
      TrackEvent('chat-agree');
      this.openChatWithBuddy(request.id);
    }, this.onError);
  }

  openChatWithBuddy(buddyRequestId) {
    const { openChatWith } = this.props;
    openChatWith(buddyRequestId);
  }

  renderTime = (time) => (
    <span className="timer">
      <Counter {...time} showOnlyHours /> left
    </span>
  );

  toggleWarningBuddyPopup = () =>
    this.setState((state) => ({
      openWarningBuddyPopup: !state.openWarningBuddyPopup,
    }));

  toggleWarningSlotsPopup = () =>
    this.setState((state) => ({
      openWarningSlotsPopup: !state.openWarningSlotsPopup,
    }));

  getWarningModalProps = () => {
    const { buddy, haveSlots, request } = this.props;
    const {
      openWarningBuddyPopup,
      openWarningSlotsPopup,
      currentBuddyId,
    } = this.state;
    return {
      haveSlots,
      thread: request,
      openWarningBuddyPopup,
      openWarningSlotsPopup,
      currentBuddyId,
      buddy,
      toggleWarningSlotsPopup: this.toggleWarningSlotsPopup,
      toggleWarningBuddyPopup: this.toggleWarningBuddyPopup,
      onChangeBuddy: this.onChangeBuddy,
      onDeclineRequest: this.decline,
      onAcceptRequest: this.accept,
    };
  };

  renderBecomeButton = () => {
    const { isMobile, haveSlots, shouldShowBuddyWarning } = this.props;
    const {
      openWarningBuddyPopup,
      openWarningSlotsPopup,
      processing,
    } = this.state;
    const openPopup = openWarningBuddyPopup || openWarningSlotsPopup;
    const showWarning = !haveSlots || shouldShowBuddyWarning;
    const popupOnClick = showWarning
      ? this.toggleWarningSlotsPopup
      : this.toggleWarningBuddyPopup;
    const BecomeButton = ({ onClick }) => (
      <div className="flex justify-center">
        <Button
          disabled={processing}
          icon
          onClick={onClick}
          basic
          className="accept"
          data-tooltip="Accept match"
          data-position="top center"
        >
          <Icon name="check" /> Become Buddy
        </Button>
      </div>
    );
    if (!showWarning) {
      return <BecomeButton onClick={this.accept} />;
    }
    if (isMobile) {
      return (
        <WarningModal
          open={openPopup}
          popupTrigger={<BecomeButton onClick={popupOnClick} />}
          className="will-unmatch-container"
          isPopup
          {...this.getWarningModalProps()}
        />
      );
    }
    return <BecomeButton onClick={popupOnClick} />;
  };

  renderSentRequestFooter = () => {
    const { processing } = this.state;

    const { request } = this.props;
    const { chatStatus, sentToAccepted, chatExpiring } = request;

    if (sentToAccepted) {
      return (
        <>
          <div>
            <div className="chat-invite">
              Chat Request - <span className="accepted">Accepted!</span>
            </div>
          </div>
          <Button
            disabled={processing}
            icon
            className="gmb-primary"
            onClick={() => this.openChatWithBuddy(request.id)}
            data-tooltip={"See if you're compatible"}
            data-position="top center"
          >
            <Icon name="comment" /> Chat
          </Button>
        </>
      );
    }

    if (chatStatus === 'Pending') {
      return (
        <>
          <div className="chat-invite">
            Chat Invite - <span> {chatStatus}... </span>
          </div>
          <Button
            disabled={processing}
            icon
            className="gmb-primary"
            onClick={this.revoke}
          >
            <Icon name="undo alternate" /> Revoke
          </Button>
        </>
      );
    }

    if (chatStatus === 'Accepted') {
      return (
        <>
          <div>
            <div className="chat-invite">
              Chat Invite - <span className="accepted"> {chatStatus}! </span>
            </div>
            {chatExpiring && !isExpired(chatExpiring) && (
              <div>
                <Countdown
                  date={chatExpiring}
                  renderer={this.renderTime}
                  className="counter"
                />
              </div>
            )}
          </div>
          <Button
            disabled={processing}
            icon
            className="gmb-primary"
            onClick={() => this.openChatWithBuddy(request.id)}
            data-tooltip={"See if you're compatible"}
            data-position="top center"
          >
            <Icon name="comment" /> Chat
          </Button>
        </>
      );
    }

    return (
      <>
        <div>
          <div className="chat-invite">
            Chat Invite - <span> {chatStatus}.. </span>
          </div>
        </div>
      </>
    );
  };

  renderRequestReceivedFooter = () => {
    const { processing } = this.state;

    const { request } = this.props;
    const {
      status,
      chatStatus,
      sentToAccepted,
      sentByAccepted,
      chatExpiring,
    } = request;

    const isDeclined = status === 'declined';

    if (isDeclined) {
      return <span className="chat-invite status"> {status} </span>;
    }

    if (sentToAccepted) {
      return (
        <>
          <span className="chat-invite"> You have accepted the request. </span>
          <Button
            disabled={processing}
            icon
            className="gmb-primary"
            onClick={() => this.openChatWithBuddy(request.id)}
            data-tooltip={"See if you're compatible"}
            data-position="top center"
          >
            <Icon name="comment" /> Chat
          </Button>
        </>
      );
    }

    if (sentByAccepted) {
      return (
        <>
          <div>
            <div className="chat-invite">
              Chat Request - <span className="accepted"> Accepted! </span>
            </div>
          </div>
          <Button
            disabled={processing}
            icon
            className="gmb-primary"
            onClick={() => this.openChatWithBuddy(request.id)}
            data-tooltip={"See if you're compatible"}
            data-position="top center"
          >
            <Icon name="comment" /> Chat
          </Button>
        </>
      );
    }

    if (chatStatus === 'Pending') {
      return (
        <div className="flex justify-center flex-col w-full">
          <div className="flex">
            <Button
              disabled={processing}
              icon
              basic
              className="decline flex-1"
              onClick={this.decline}
              data-tooltip="Decline match"
              data-position="top right"
            >
              <Icon name="times" /> Decline Chat
            </Button>
            <Button
              disabled={processing}
              icon
              className="gmb-primary flex-1"
              onClick={this.acceptChat}
              data-tooltip={"See if you're compatible"}
              data-position="top center"
            >
              <Icon name="comment" /> Accept Chat
            </Button>
          </div>
          {this.renderBecomeButton()}
        </div>
      );
    }

    if (chatStatus === 'Accepted') {
      return (
        <>
          <div>
            <div className="chat-invite">
              Chat Invite - <span className="accepted"> {chatStatus}! </span>
            </div>
            <div>
              {chatExpiring && !isExpired(chatExpiring) && (
                <Countdown
                  date={chatExpiring}
                  renderer={this.renderTime}
                  className="counter"
                />
              )}
            </div>
          </div>
          <Button
            disabled={processing}
            icon
            className="gmb-primary"
            onClick={() => this.openChatWithBuddy(request.id)}
            data-tooltip={"See if you're compatible"}
            data-position="top center"
          >
            <Icon name="comment" /> Chat
          </Button>
        </>
      );
    }

    return <span className="chat-invite status"> {status} </span>;
  };

  render() {
    const {
      user,
      request,
      isMobile,
      haveSlots,
      shouldShowBuddyWarning,
    } = this.props;
    const { openWarningBuddyPopup, openWarningSlotsPopup } = this.state;
    const { sentBy, createdAt, category, sentTo, status } = request;

    const isRequestSentByUser = sentBy.id === user.pk;
    const { name, avatar } = sentBy;
    const showPopup = openWarningBuddyPopup || openWarningSlotsPopup;
    const popupOnClick = openWarningSlotsPopup
      ? this.toggleWarningSlotsPopup
      : this.toggleWarningBuddyPopup;
    const showWarning = !haveSlots || shouldShowBuddyWarning;
    return (
      <React.Fragment>
        <div className="buddy-request" id="buddy-request">
          <div>
            <div className="avatar">
              <Avatar avatar={avatar} />
            </div>
            <span className="name">
              <Link to={`/profile/${sentBy.id}`}>{name}</Link>
              <span className="buddy-request-time">
                {moment(createdAt).fromNow()}
              </span>
              {CategoryIcon.renderColorfulIcon(category.slug)}
            </span>
            {isRequestSentByUser ? (
              <React.Fragment>
                <div className="category">
                  You sent a Chat Request to{' '}
                  <Link to={`/profile/${sentTo.id}`}>{sentTo.name} </Link>
                </div>

                {['initiated', 'waiting'].indexOf(status) !== -1 ? (
                  <div className="options">
                    {this.renderSentRequestFooter()}
                  </div>
                ) : (
                  <div className="options">
                    <span className="chat-invite status"> {status} </span>
                  </div>
                )}
              </React.Fragment>
            ) : (
              <React.Fragment>
                <div className="category">Sent you a Chat Request. </div>
                <div className="orange options">
                  {this.renderRequestReceivedFooter()}
                </div>
              </React.Fragment>
            )}
          </div>
        </div>
        {!isMobile && showWarning && (
          <WarningModal
            open={showPopup}
            onClose={popupOnClick}
            className="will-unmatch"
            {...this.getWarningModalProps()}
          />
        )}
      </React.Fragment>
    );
  }
}

BuddyRequest.propTypes = {
  openChatWith: PropTypes.func.isRequired,
  getBuddyRequests: PropTypes.func.isRequired,
  myCategories: PropTypes.arrayOf(PropTypes.shape()),
  isMobile: PropTypes.bool,
  haveSlots: PropTypes.bool,
  shouldShowBuddyWarning: PropTypes.bool,
  buddy: PropTypes.shape(),
  fetchUserCategories: PropTypes.func,
  user: PropTypes.shape().isRequired, // TODO: Have the user props here
  request: PropTypes.shape().isRequired, // TODO: Have the request props here
};
const mapStateToProps = (state, { request, user }) => {
  const myCategories = getUserCategories(state, { profileId: user.pk }) || [];
  const availablesSlots = getUserCategoriesSlot(state, { profileId: user.pk });
  const activeBuddies = myCategories.filter((e) => e.buddy);
  const haveSlots = activeBuddies.length < availablesSlots;
  return {
    haveSlots,
    shouldShowBuddyWarning: myCategories.some(
      (e) => e.id === request.category.pk && e.buddy
    ),
    buddy: request.sentBy,
  };
};

const ConnectedBuddy = connect(mapStateToProps, {
  fetchUserCategories: fetchUserCategoriesAction,
})(BuddyRequest);

const BuddySizes = withSizes(({ width }) => ({
  isMobile: width < 768,
}))(ConnectedBuddy);

export default BuddySizes;
