import React from 'react';
import { Button, Icon } from 'semantic-ui-react';

import BuddyCategory from './BuddyCategory';
import NoBuddyCategory from './NoBuddyCategory';

const ActiveCategory = ({
  category,
  hasAccess,
  user,
  edit,
  canEdit,
  updateCategory,
  openChatWith,
  closeSidebarFunction,
  sendBuddyRequest,
  sendBetaInvite,
  cancelBuddyRequest,
  sentRequest,
  disabled,
}) => (
  <React.Fragment>
    <div className="content active">
      <div>
        <div className="title">Plan</div>
        <div>2x / week</div>
      </div>
      <div className="title">Behaviors</div>
      <div className="description">
        {category.habit && category.habit.label}
      </div>

      {false && ( // Can Edit
        <div className="buttons">
          <Button icon className="btn third" onClick={edit}>
            <Icon name="pencil" />
          </Button>
        </div>
      )}
    </div>

    {category.buddy && (
      <BuddyCategory
        category={category}
        canEdit={canEdit}
        updateCategory={updateCategory}
        openChatWith={openChatWith}
        closeSidebarFunction={closeSidebarFunction}
      />
    )}

    {!category.buddy && (
      <NoBuddyCategory
        disabled={disabled}
        hasAccess={hasAccess}
        canEdit={canEdit}
        cancelBuddyRequest={cancelBuddyRequest}
        sendBetaInvite={sendBetaInvite}
        sendBuddyRequest={sendBuddyRequest}
        user={user}
        sentRequest={sentRequest}
        isCategoryActive
      />
    )}
  </React.Fragment>
);

export default ActiveCategory;
