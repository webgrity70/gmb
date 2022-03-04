import React from 'react';
import GenderFilters from './filters/GenderFilters';
import AgeFilters from './filters/AgeFilters';
import OccupationFilters from './filters/OccupationFilters';
import TimezoneFilters from './filters/TimezoneFilters';
import ActiveCategoryFilters from './filters/ActiveCategoryFilters';
import HealthFitnessFilters from './filters/HealthFitnessFilters';
import LearnFilters from './filters/LearnFilters';
import WorkFilters from './filters/WorkFilters';
import LifeFilters from './filters/LifeFilters';
import JoinedWithinFilters from './filters/JoinedWithinFilters';

import './BuddyFilters.scss';

function BuddyFilters() {
  return (
    <div className="BuddyFilters">
      <h2 className="header">Filters</h2>
      <GenderFilters />
      <AgeFilters />
      <OccupationFilters />
      <TimezoneFilters />
      <ActiveCategoryFilters />
      <HealthFitnessFilters />
      <LearnFilters />
      <WorkFilters />
      <LifeFilters />
      <JoinedWithinFilters />
    </div>
  );
}

export default BuddyFilters;
