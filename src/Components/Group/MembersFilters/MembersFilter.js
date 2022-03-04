import React from 'react';
import { bem } from './utils';
import JoinedWithin from './JoinedWithin';
import Gender from './Gender';
import Timezone from './Timezone';
import ActiveCategories from './ActiveCategories';
import './MembersFilters.scss';

const MembersFilters = () => (
  <div className={bem()}>
    <h4>Filters</h4>
    <Gender />
    <JoinedWithin />
    <Timezone />
    <ActiveCategories />
  </div>
);

export default MembersFilters;
