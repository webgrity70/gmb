import React from 'react';
import { Link } from 'react-router-dom';
import { Icon } from 'semantic-ui-react';

export default ({ buddyName }) => (
  <div className="declined">
    <p className="description">
      {' '}
      <span> {buddyName} </span> Has declined your Chat Request.
    </p>
    <p className="description"> Continue the search!</p>
    <div className="actions">
      <Link className="gmb-primary" to="/buddies">
        <Icon name="search" />
        Find Buddies
      </Link>
    </div>
  </div>
);
