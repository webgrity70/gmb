import React, { useContext } from 'react';
import RecommendedBuddies from '../../../Elements/RecommendedBuddies';
import FiltersContext from '../../FiltersContext';

function BuddyResultsList() {
  const filterContext = useContext(FiltersContext);
  return (
    <RecommendedBuddies
      buddies={filterContext.recommendedBuddies}
      orderBy={filterContext.orderBy}
      order={filterContext.order}
      onOrderChange={filterContext.onOrderChange}
    />
  );
}

export default BuddyResultsList;
