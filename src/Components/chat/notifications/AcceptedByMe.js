import React from 'react';
import { Button, Icon } from 'semantic-ui-react';
import { TrackEvent } from '../../../Services/TrackEvent';

export default ({
  buddyName,
  categoryName,
  expired,
  onToggleClose,
  onDecline,
}) => {
  const onChatNow = () => {
    onToggleClose();
    TrackEvent('chat-grey-agree');
  };

  const onRevoke = () => {
    onDecline();
    TrackEvent('chat-grey-revoke');
  };

  return (
    <div className="accepted-by-me">
      <div>
        {!expired && <p className="title"> Great! </p>}
        {expired && <p className="title"> Your 72 hours are up! </p>}
        <p className="description">
          {' '}
          You accepted {buddyName} as your {categoryName} buddy.
        </p>
        <p className="description accepted"> Accepted!</p>

        <div className="buttons">
          {!expired && (
            <Button icon primary onClick={onChatNow}>
              <Icon name="comment" /> Chat{' '}
            </Button>
          )}
          <Button icon primary onClick={onRevoke} className="revoke">
            <i className="fas fa-user-slash" />
            <span> Revoke </span>
          </Button>
        </div>
      </div>
      <p className="waiting">Waiting for {buddyName} to confirm...</p>
    </div>
  );
};
