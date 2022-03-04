import React from 'react';
import Avatar from '../../Elements/Avatar';

export default ({ buddy, me, categoryName }) => (
  <div className="buddies">
    <div className="header">
      <div className="buddy">
        <div className="avatar">
          {' '}
          <Avatar avatar={buddy.avatar} />{' '}
        </div>
        {buddy.name}
      </div>
      <div className="me">
        You
        <div className="avatar">
          {' '}
          <Avatar avatar={me.avatar} />{' '}
        </div>
      </div>
    </div>
    <div className="great">
      Great! You and {buddy.name} just became {categoryName} buddies!
    </div>
  </div>
);
