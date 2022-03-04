import React from 'react';
import cx from 'classnames';
import { Icon, Popup } from 'semantic-ui-react';
import { UserColumn } from '../../Elements/Table';

export default (bem) => [
  {
    title: 'Name',
    dataIndex: 'avatar location name gender id age rank',
    render: (avatar, userLocation, userName, gender, userId, age, rank) => (
      <div
        className={cx('info-name cell-content user-description', bem('user'))}
      >
        <UserColumn
          avatar={avatar}
          userLocation={userLocation}
          userName={userName}
          gender={gender}
          rank={rank}
          age={age}
          userId={userId}
        />
      </div>
    ),
  },
  {
    title: 'Challenge Score',
    dataIndex: 'challengeScore',
    render: (score) => (
      <div className="cell-content">
        <div className={bem('score')}>
          <Icon name="hourglass half" />
          {score}
        </div>
      </div>
    ),
  },
  {
    title: 'Check In %',
    dataIndex: 'checkInPercentage',
    render: (percentage) => (
      <div className={cx('cell-content', bem('text'))}>{percentage || '-'}</div>
    ),
  },
  {
    title: 'Check in time',
    dataIndex: 'checkInTime',
    render: (inTime) => (
      <div className={cx('cell-content', bem('text'))}>{inTime || '-'}</div>
    ),
  },
  {
    title: 'Note',
    dataIndex: 'checkInNote',
    render: (note) => (
      <div className="cell-content">
        <Popup
          className={bem('note')}
          trigger={<span className={bem('trigger')}>see note</span>}
        >
          <span>Note:</span>
          <span>{note || '-'}</span>
        </Popup>
      </div>
    ),
  },
];
