import React from 'react';
import { Button } from 'semantic-ui-react';
import CategoriesIcons from '../../Elements/CategoriesIcons';
import calculateTZOffset from '../../../utils/calculateTZOffset';
import { ScorerColumn, UserColumn } from '../../Elements/Table';

const calculateTimezone = (timezoneName, timezoneOffset) => (
  <div className="cell-content">
    {calculateTZOffset(timezoneName, timezoneOffset)}
  </div>
);

export default ({ onAccept, onReject, loading }) => [
  {
    title: 'Name',
    dataIndex: 'avatar location name gender id age',
    sortBy: 'name',
    render: (avatar, userLocation, userName, gender, userId, age) => (
      <div className="info-name cell-content user-description">
        <UserColumn
          avatar={avatar}
          userLocation={userLocation}
          userName={userName}
          gender={gender}
          age={age}
          userId={userId}
        />
      </div>
    ),
  },
  {
    title: 'Score',
    dataIndex: 'accountLevel',
    sortBy: 'score',
    render: (accountLevel) => (
      <div className="info-name cell-content">
        <ScorerColumn accountLevel={accountLevel} />
      </div>
    ),
  },
  {
    title: 'Available',
    dataIndex: 'availableCategories',
    render: (availableCategories) => (
      <div className="cell-content available-icons">
        <CategoriesIcons categories={availableCategories} />
      </div>
    ),
  },
  {
    title: 'Timezone',
    dataIndex: 'timezoneName timezoneOffset',
    sortBy: 'timezone_name',
    render: (tzName, tzOffset) => calculateTimezone(tzName, tzOffset),
  },
  {
    title: '',
    dataIndex: 'id',
    render: (userId) => (
      <div className="cell-content flex items-center">
        <Button
          basic
          onClick={() => onReject(userId)}
          disabled={loading.includes(userId)}
        >
          Reject
        </Button>
        <Button
          color="orange"
          onClick={() => onAccept(userId)}
          loading={loading.includes(userId)}
        >
          Accept
        </Button>
      </div>
    ),
  },
];
