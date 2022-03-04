/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import React from 'react';
import PropTypes from 'prop-types';
import { Icon, Popup } from 'semantic-ui-react';
import * as muted from '../../../Assets/images/muted.png';
import ChatRequest from './ChatRequest';

const NoBuddyCategory = ({
  canEdit,
  canAdd,
  cancelBuddyRequest,
  sendBetaInvite,
  sendBuddyRequest,
  user,
  sentRequest,
  currentSentRequest,
  disabled,
  categoryId,
}) => {
  function Avatar() {
    return (
      <div className="avatar-container">
        <div style={{ overflow: 'hidden' }} className="avatar">
          <img
            style={{
              marginLeft: '-5px',
              width: '40px',
              position: 'absolute',
              left: '5px',
              bottom: 0,
            }}
            src={muted}
            alt="muted"
          />
        </div>
      </div>
    );
  }
  function Content() {
    if (!canEdit) {
      return (
        <div className="buddy-name-avatar-bx dull">
          <Avatar />
          <div className="name unmatched">UNMATCHED</div>
        </div>
      );
    }
    if (canAdd) {
      return (
        <div className="buddy-name-avatar-bx dull">
          <Avatar />
          <div className="name unmatched">AVAILABLE</div>
        </div>
      );
    }
    return (
      <Popup
        on="click"
        content="To open another Buddy space, earn 50 points in any category by checking in to your behaviors."
        trigger={
          <div className="buddy-name-avatar-bx dull flex flex-1 locked">
            <Avatar />
            <div className="name unmatched flex-1 pointer">
              <Icon name="lock" />
              LOCKED
            </div>
          </div>
        }
      />
    );
  }
  return (
    <div className="category-buddy">
      <div className="buddy-name-avatar-block">
        <div className="title">Buddy: </div>
        <Content />
      </div>
      <ChatRequest
        cancelBuddyRequest={cancelBuddyRequest}
        sendBetaInvite={sendBetaInvite}
        sendBuddyRequest={sendBuddyRequest}
        user={user}
        sentRequest={sentRequest}
        disabled={disabled}
        canEdit={canEdit}
        canAdd={canAdd}
        categoryId={categoryId}
        currentSentRequest={currentSentRequest}
      />
    </div>
  );
};

NoBuddyCategory.propTypes = {
  canEdit: PropTypes.bool,
  cancelBuddyRequest: PropTypes.func,
  sendBetaInvite: PropTypes.func,
  sendBuddyRequest: PropTypes.func,
  user: PropTypes.shape({}),
  sentRequest: PropTypes.bool,
  disabled: PropTypes.bool,
  canAdd: PropTypes.bool,
  categoryId: PropTypes.number,
  currentSentRequest: PropTypes.oneOfType([
    PropTypes.number,
    PropTypes.oneOf([null]),
  ]),
};

export default NoBuddyCategory;
