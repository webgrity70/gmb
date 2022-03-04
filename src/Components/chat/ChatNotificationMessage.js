import React from 'react';
import { Button, Icon } from 'semantic-ui-react';
import PropTypes from 'prop-types';
import { toast } from 'react-toastify';
import withSizes from 'react-sizes';
import { connect } from 'react-redux';
import Pending from './notifications/Pending';
import Expired from './notifications/Expired';
import Declined from './notifications/Declined';
import AcceptedByBuddy from './notifications/AcceptedByBuddy';
import AcceptedByMe from './notifications/AcceptedByMe';
import Buddies from './notifications/Buddies';
import { isExpired } from '../../utils/Chat';
import * as buddyRequestActions from '../../Actions/action_buddy_request';
import {
  getUserCategories,
  getUserCategoriesSlot,
} from '../../selectors/profile';
import { fetchUserCategories as fetchUserCategoriesAction } from '../../Actions/actions_profile';
import ProfileService from '../../Services/ProfileService';
import WarningModal from './WarningModal';
import { TrackEvent } from '../../Services/TrackEvent';

const STATUSES = {
  PENDING: 'Pending',
  EXPIRED: 'Expired',
  DECLINED: 'Declined',
  ACCEPTED: 'Accepted',
  OPEN: 'Open',
  ACCEPTED_BY_ME: 'Accepted-by-me',
};

function getStatusBasedOnExpiring(expiringTime) {
  if (isExpired(expiringTime)) {
    return STATUSES.EXPIRED;
  }

  return STATUSES.PENDING;
}

class ChatNotificationMessage extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      closed: false,
      openWarningBuddyPopup: false,
      openWarningSlotsPopup: false,
      currentBuddyId: null,
    };

    this.onToggleClose = this.onToggleClose.bind(this);
  }

  UNSAFE_componentWillReceiveProps(nextProps, _nextContent) {
    if (
      nextProps.messageCount > 0 &&
      getStatusBasedOnExpiring(nextProps.thread.expiring) !== STATUSES.EXPIRED
    ) {
      this.setState({ closed: true });
    }
  }

  onToggleClose() {
    this.setState((state) => ({
      closed: !state.closed,
    }));
  }

  toggleWarningBuddyPopup = () =>
    this.setState((state) => ({
      openWarningBuddyPopup: !state.openWarningBuddyPopup,
    }));

  toggleWarningSlotsPopup = () =>
    this.setState((state) => ({
      openWarningSlotsPopup: !state.openWarningSlotsPopup,
    }));

  onDeclineRequest = () => {
    const { declineRequest, thread } = this.props;
    declineRequest(thread.buddyRequest);
    this.resetFlow();
  };

  resetFlow = () => {
    this.setState({
      currentBuddyId: null,
      openWarningBuddyPopup: false,
      openWarningSlotsPopup: false,
    });
  };

  acceptRequest = async () => {
    const {
      acceptRequest,
      fetchUserCategories,
      thread,
      myInformationInThread,
    } = this.props;
    await acceptRequest(thread.buddyRequest);
    await fetchUserCategories(myInformationInThread.id);
    TrackEvent('chat-buddy-accept');
    this.resetFlow();
  };

  onAcceptRequest = async (category) => {
    const { thread } = this.props;
    const sameCategory = category.id === thread.category.pk;
    const { currentBuddyId } = this.state;
    if (!currentBuddyId || sameCategory) {
      this.acceptRequest();
    } else {
      const removeResponse = await ProfileService.removeCategory({
        categoryId: category.id,
      });
      if (removeResponse.status === 200) {
        this.acceptRequest();
      } else {
        toast.error(removeResponse.data.message);
        this.resetFlow();
      }
    }
  };

  onChangeBuddy = (_, { value }) => {
    this.setState({
      currentBuddyId: value,
      openWarningBuddyPopup: true,
      openWarningSlotsPopup: false,
    });
  };

  getWarningModalProps = () => {
    const { buddy, haveSlots, thread } = this.props;
    const {
      openWarningBuddyPopup,
      openWarningSlotsPopup,
      currentBuddyId,
    } = this.state;
    return {
      haveSlots,
      thread,
      openWarningBuddyPopup,
      openWarningSlotsPopup,
      currentBuddyId,
      buddy,
      toggleWarningSlotsPopup: this.toggleWarningSlotsPopup,
      toggleWarningBuddyPopup: this.toggleWarningBuddyPopup,
      onChangeBuddy: this.onChangeBuddy,
      onDeclineRequest: this.onDeclineRequest,
      onAcceptRequest: this.onAcceptRequest,
    };
  };

  renderBecomeButton = () => {
    const { isMobile, haveSlots, shouldShowBuddyWarning } = this.props;
    const { openWarningBuddyPopup, openWarningSlotsPopup } = this.state;
    const openPopup = openWarningBuddyPopup || openWarningSlotsPopup;
    const showWarning = !haveSlots || shouldShowBuddyWarning;
    const popupOnClick = showWarning
      ? this.toggleWarningSlotsPopup
      : this.toggleWarningBuddyPopup;
    const BecomeButton = ({ onClick }) => (
      <Button icon className="gmb-primary" onClick={onClick}>
        <Icon name="check" /> Become Buddy{' '}
      </Button>
    );
    if (!showWarning) {
      return <BecomeButton onClick={this.acceptRequest} />;
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

  render() {
    const { closed, openWarningBuddyPopup, openWarningSlotsPopup } = this.state;
    const {
      thread,
      declineRequest,
      buddy,
      myInformationInThread,
      isMobile,
      messageCount,
      buddyRequestDeclined,
      loading,
    } = this.props;
    if (buddy.accepted && myInformationInThread.accepted) {
      if (messageCount > 0 || loading) {
        return <React.Fragment />;
      }

      return (
        <div className="hours-chat-72 matched">
          <Buddies
            buddy={buddy}
            me={myInformationInThread}
            categoryName={thread.category.name}
          />
        </div>
      );
    }

    let status = thread.expiring
      ? getStatusBasedOnExpiring(thread.expiring)
      : thread.status;
    let acceptedByMe = false;
    let acceptedByBuddy = false;
    let acceptedByBuddyClass = '';
    const showPopup = openWarningBuddyPopup || openWarningSlotsPopup;
    const expiredClass = status === STATUSES.EXPIRED ? 'expired' : '';
    const popupOnClick = openWarningSlotsPopup
      ? this.toggleWarningSlotsPopup
      : this.toggleWarningBuddyPopup;
    if (buddyRequestDeclined) {
      status = STATUSES.DECLINED;
    } else if (buddy.accepted) {
      acceptedByBuddy = true;
      acceptedByBuddyClass = 'acceptedByBuddy';
    } else if (myInformationInThread.accepted) {
      status = STATUSES.ACCEPTED_BY_ME;
      acceptedByMe = true;
    }

    const chatExpired = isExpired(thread.expiring);
    return (
      <div
        className={`hours-chat-72 ${status.toLowerCase()} ${acceptedByBuddyClass} ${
          closed ? 'closed' : ''
        } ${expiredClass}`}
      >
        <div>
          {(status === STATUSES.PENDING || acceptedByMe) && !chatExpired && (
            <div className="close-button">
              <Icon
                name={`angle ${closed ? 'down' : 'up'}`}
                onClick={this.onToggleClose}
              />
            </div>
          )}

          <div className="content">
            {[STATUSES.PENDING, STATUSES.EXPIRED, STATUSES.ACCEPTED].indexOf(
              status
            ) !== -1 && (
              <React.Fragment>
                {status === STATUSES.PENDING && (
                  <Pending
                    onToggleClose={this.onToggleClose}
                    date={thread.expiring}
                  />
                )}

                {[STATUSES.EXPIRED, STATUSES.ACCEPTED].indexOf(status) !==
                  -1 && <Expired thread={thread} />}

                <div className="actions">
                  <Button
                    icon
                    className="decline gmb-primary"
                    onClick={() => declineRequest(thread.buddyRequest)}
                  >
                    <Icon name="times" /> Decline Buddy
                  </Button>
                  {this.renderBecomeButton()}
                </div>
              </React.Fragment>
            )}
            {acceptedByMe && (
              <AcceptedByMe
                buddyName={buddy.name}
                categoryName={thread.category.name}
                onDecline={() => declineRequest(thread.buddyRequest)}
                expired={chatExpired}
                onToggleClose={this.onToggleClose}
              />
            )}

            {status === STATUSES.DECLINED && (
              <Declined buddyName={buddy.name} />
            )}
          </div>
        </div>
        {acceptedByBuddy && <AcceptedByBuddy buddyName={buddy.name} />}
        {thread.category && (
          <WarningModal
            open={showPopup && !isMobile}
            onClose={popupOnClick}
            className="will-unmatch"
            {...this.getWarningModalProps()}
          />
        )}
      </div>
    );
  }
}

ChatNotificationMessage.propTypes = {
  acceptRequest: PropTypes.func.isRequired,
  buddy: PropTypes.shape(),
  buddyRequestDeclined: PropTypes.bool,
  declineRequest: PropTypes.func.isRequired,
  loading: PropTypes.bool,
  messageCount: PropTypes.number,
  myInformationInThread: PropTypes.shape(),
  isMobile: PropTypes.bool,
  haveSlots: PropTypes.bool,
  shouldShowBuddyWarning: PropTypes.bool,
  thread: PropTypes.shape(),
  fetchUserCategories: PropTypes.func,
};

const mapStateToProps = (state, { myInformationInThread, thread }) => {
  const myCategories =
    getUserCategories(state, { profileId: myInformationInThread.id }) || [];
  const availablesSlots = getUserCategoriesSlot(state, {
    profileId: myInformationInThread.id,
  });
  const activeBuddies = myCategories.filter((e) => e.buddy);
  const haveSlots = activeBuddies.length < availablesSlots;
  return {
    haveSlots,
    shouldShowBuddyWarning:
      thread.category &&
      myCategories.some((e) => e.id === thread.category.pk && e.buddy),
  };
};

const ConnectedChat = connect(mapStateToProps, {
  acceptRequest: buddyRequestActions.acceptRequest,
  declineRequest: buddyRequestActions.declineRequest,
  fetchUserCategories: fetchUserCategoriesAction,
})(ChatNotificationMessage);

export default withSizes(({ width }) => ({
  isMobile: width < 768,
}))(ConnectedChat);
