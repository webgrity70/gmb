import React from 'react';

import CategoriesIcons from '../../../Elements/CategoriesIcons';
import calculateTZOffset from '../../../../utils/calculateTZOffset';
import { ScorerColumn, GroupColumn } from '../../../Elements/Table';

const calculateTimezone = (timezoneName, timezoneOffset) => (
  <div className="cell-content">
    {calculateTZOffset(timezoneName, timezoneOffset)}
  </div>
);

export default [
  {
    title: 'Name',
    dataIndex:
      'id name location privacy icon featured official membershipLevel type subTitle',
    sortBy: 'name',
    render: (
      id,
      name,
      location,
      privacy,
      icon,
      featured,
      official,
      membershipLevel,
      type,
      subTitle
    ) => (
      <div className="info-name cell-content">
        <GroupColumn
          icon={icon}
          id={id}
          name={name}
          location={location}
          featured={featured}
          privacy={privacy}
          official={official}
          membershipLevel={membershipLevel}
          type={type}
          subTitle={subTitle}
        />
      </div>
    ),
  },
  {
    title: 'Categories',
    dataIndex: 'categories',
    render: (categories) => (
      <div className="cell-content available-icons">
        {categories.length > 0 ? (
          <CategoriesIcons categories={categories} />
        ) : (
          <span>——</span>
        )}
      </div>
    ),
  },
  {
    title: 'Timezone',
    dataIndex: 'timezoneName timezoneOffset',
    sortBy: 'timezone_distance',
    render: (tzName, tzOffset) => calculateTimezone(tzName, tzOffset),
  },
  {
    title: 'Members',
    dataIndex: 'members membersLimit',
    sortBy: 'member_count',
    render: (members) => (
      <div className="cell-content">
        <span>{members || 0}</span>
      </div>
    ),
  },
  {
    title: 'Score',
    dataIndex: 'score',
    sortBy: 'score',
    render: (score) => (
      <div className="info-name cell-content">
        <ScorerColumn accountLevel={score} />
      </div>
    ),
  },
];
