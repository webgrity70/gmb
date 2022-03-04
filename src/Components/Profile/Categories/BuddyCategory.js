import React from 'react';
import { Link } from 'react-router-dom';
import _ from 'lodash';
import Avatar from '../../Elements/Avatar';
import ColoredDots from '../../Elements/ColoredDots';
import ChatRequest from './ChatRequest';

const statuses = {
  match: {
    text: "It's going great!",
    colorClass: 'green',
  },
  dangered: {
    text: 'Need to talk.',
    colorClass: 'yellow',
  },
};
const BuddyCategory = ({
  category,
  alreadyBuddy,
  canEdit,
  updateCategory,
  openChatWith,
  closeSidebarFunction,
  canAdd,
  cancelBuddyRequest,
  user,
  sendBetaInvite,
  sendBuddyRequest,
  sentRequest,
  currentSentRequest,
  disabled,
  categoryId,
}) => (
  <div className="category-buddy">
    <div className="buddy-name-avatar-block">
      <div className="title">Buddy: </div>
      <div className="buddy-name-avatar-bx">
        <div className="avatar-container">
          <div
            className="avatar"
            style={{
              display: 'block',
              position: 'relative',
              overflow: 'hidden',
            }}
          >
            <Avatar avatar={category.buddy.avatar} id={category.buddy.id} />
          </div>
        </div>
        <div className="name">
          <Link to={`/profile/${category.buddy.id}`}>
            {category.buddy.name}
          </Link>
        </div>
      </div>
    </div>
    {false && ( // Can Edit
      <div className="buddy-status-bx">
        <p className={_.get(statuses[category.status], 'colorClass', '')}>
          {_.get(statuses[category.status], 'text', '')}
        </p>
        <ColoredDots
          status={category.status}
          buddy={category.buddy}
          updateCallback={updateCategory}
          openChatWith={openChatWith}
          closeSidebarFunction={closeSidebarFunction}
        />
      </div>
    )}
    <ChatRequest
      cancelBuddyRequest={cancelBuddyRequest}
      sendBetaInvite={sendBetaInvite}
      sendBuddyRequest={sendBuddyRequest}
      user={user}
      sentRequest={sentRequest}
      disabled={disabled}
      canEdit={canEdit}
      alreadyBuddy={alreadyBuddy}
      canAdd={canAdd}
      currentSentRequest={currentSentRequest}
      categoryId={categoryId}
    />
  </div>
);

export default BuddyCategory;
