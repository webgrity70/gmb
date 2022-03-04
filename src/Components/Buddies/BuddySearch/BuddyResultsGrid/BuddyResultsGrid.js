import React, { useContext } from 'react';
import { Grid } from 'semantic-ui-react';
import ProfileCard from '../../../Elements/ProfileCard';
import FiltersContext from '../../FiltersContext';

function BuddyResultsGrid() {
  const filterContext = useContext(FiltersContext);
  return (
    <div style={{ padding: 0 }}>
      <Grid columns={2} padded stackable>
        {filterContext.recommendedBuddies.map((recommendedBuddy) => (
          <Grid.Column key={recommendedBuddy.id}>
            <ProfileCard buddy={recommendedBuddy} />
          </Grid.Column>
        ))}
      </Grid>
    </div>
  );
}

export default BuddyResultsGrid;
