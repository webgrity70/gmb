import React from 'react';
import { Icon } from 'semantic-ui-react';
import Dropdown from '../../Elements/Dropdown';
import CategoriesIcons from '../../Elements/CategoriesIcons';
import calculateTZOffset from '../../../utils/calculateTZOffset';
import { ScorerColumn, UserColumn } from '../../Elements/Table';

const calculateTimezone = (timezoneName, timezoneOffset) => (
  <div className="cell-content">
    {calculateTZOffset(timezoneName, timezoneOffset)}
  </div>
);

export default ({
  groupId,
  myId,
  isAdmin,
  onEject,
  isPrivate,
  hasPermission,
}) => [
  {
    ...(isAdmin && {
      title: '',
      dataIndex: 'id',
      render: (userId) =>
        userId === myId ? null : (
          <div className="cell-content">
            <Dropdown
              className="GroupMembersTable__dropdown-eject"
              Title={<Icon name="angle down" size="large" />}
              options={[{ text: 'Eject', onClick: () => onEject(userId) }]}
            />
          </div>
        ),
    }),
  },
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
          groupId={groupId}
          isPrivate={isPrivate}
          hasPermission={hasPermission}
          isAdmin={isAdmin}
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
];
