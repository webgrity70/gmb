/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import React, { useState } from 'react';
import { connect } from 'react-redux';
import { Button, Popup } from 'semantic-ui-react';
import PropTypes from 'prop-types';
import {
  getUserCategories,
  getMyProfileId,
  getUserInfo,
} from '../../../selectors/profile';

const ChatRequest = ({
  canEdit,
  sentRequest,
  disabled,
  user,
  sendBuddyRequest,
  userInfo,
  sendBetaInvite,
  cancelBuddyRequest,
  canAdd,
  currentSentRequest,
  alreadyBuddy,
  myCategories,
  categoryId,
}) => {
  const [openPopup, togglePopup] = useState(false);
  const requestsOff = userInfo && !userInfo.accepts_buddy_requests;
  const buddySameCategory = myCategories.find(
    (e) => e.id === categoryId && e.buddy
  );
  const shouldAlert =
    !buddySameCategory && canAdd && currentSentRequest.length === 0;
  function sendRequest() {
    if (!user.non_beta) sendBuddyRequest();
    else sendBetaInvite();
  }
  function getPopupContent() {
    if (buddySameCategory)
      return 'You already have a Buddy in this category. Click Chat Request to send anyway.';
    if (!canAdd)
      return 'Your available Buddy spaces are filled. Still want to send? Click again.';
    return '';
  }
  function onSendRequest() {
    if (shouldAlert) {
      sendRequest();
    } else if (!openPopup) {
      togglePopup(true);
    } else {
      togglePopup(false);
      sendRequest();
    }
  }
  function getDisabledMessage() {
    if (requestsOff) return 'User not accepting chat requests.';
    if (alreadyBuddy) {
      return 'You are already buddies in this category.';
    }
    if (currentSentRequest.length > 0) {
      return 'You have already sent a request. Please wait for it to be accepted or declined before sending another.';
    }
    return '';
  }
  function RequestBtn() {
    return (
      <Button
        disabled={disabled || currentSentRequest.length > 0}
        className="gmb-primary buddy-request mt-45"
        onClick={onSendRequest}
      >
        Chat Request
      </Button>
    );
  }
  if (canEdit) return null;
  if (sentRequest && !user.non_beta) {
    return (
      <div className="flex flex-col justify-center text-center mt-20">
        <span className="black font-weight-bold">Chat Request sent!</span>
        <span className="clickable orange" onClick={cancelBuddyRequest}>
          Revoke
        </span>
      </div>
    );
  }
  if (sentRequest && user.non_beta) {
    return (
      <div className="text-center mt-20">
        <span className="black font-weight-bold">Invite sent!</span>
      </div>
    );
  }
  if (requestsOff || alreadyBuddy || currentSentRequest.length > 0) {
    return (
      <Popup
        className="ProfileCategory__disabled-btn"
        trigger={
          <div className="mt-8 flex items-end">
            <Button className="gmb-primary buddy-request nm h-12" disabled>
              Chat Request
            </Button>
          </div>
        }
        on="hover"
        content={getDisabledMessage()}
      />
    );
  }
  if (!buddySameCategory && canAdd) return <RequestBtn />;
  if (!sentRequest || !canAdd) {
    return (
      <Popup
        trigger={<RequestBtn />}
        open={openPopup}
        on="click"
        onClose={() => togglePopup(false)}
        content={getPopupContent}
      />
    );
  }
  return null;
};

ChatRequest.propTypes = {
  sentRequest: PropTypes.bool,
  user: PropTypes.shape(),
  canEdit: PropTypes.bool,
  alreadyBuddy: PropTypes.bool,
  disabled: PropTypes.bool,
  sendBuddyRequest: PropTypes.func,
  sendBetaInvite: PropTypes.func,
  cancelBuddyRequest: PropTypes.func,
  canAdd: PropTypes.bool,
  myCategories: PropTypes.arrayOf(PropTypes.shape),
  categoryId: PropTypes.number,
  userInfo: PropTypes.shape(),
  currentSentRequest: PropTypes.oneOfType([
    PropTypes.number,
    PropTypes.oneOf([null]),
  ]),
};
const mapStateToProps = (state, { user }) => {
  const myId = getMyProfileId(state);
  return {
    userInfo: getUserInfo(state, { profileId: user.pk }),
    myCategories: getUserCategories(state, { profileId: myId }) || [],
  };
};

export default connect(mapStateToProps)(ChatRequest);
