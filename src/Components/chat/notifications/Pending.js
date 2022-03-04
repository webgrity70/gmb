import React from 'react';
import { Button, Icon } from 'semantic-ui-react';
import Countdown from 'react-countdown';
import Counter from '../../Dashboard/Counter';

function showTime(time) {
  return <Counter {...time} showOnlyHours />;
}

export default ({ onToggleClose, date }) => (
  <div className="pending">
    <p className="title"> Great! </p>
    <p className="description">
      {' '}
      You have <Countdown date={date} renderer={showTime} /> left to chat and
      decide if you want to become buddies.
    </p>
    <Button icon className="gmb-primary chat" onClick={onToggleClose}>
      <Icon name="comment" /> Chat{' '}
    </Button>
    <p className="description">
      {' '}
      When you have decided if this person is a good Buddy match, just click:
    </p>
  </div>
);
