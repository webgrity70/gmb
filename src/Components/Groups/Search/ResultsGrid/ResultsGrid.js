import React from 'react';
import PropTypes from 'prop-types';
import { Grid } from 'semantic-ui-react';
import { withGroups } from '../../../HoCs';
import ProfileGroupCard from '../../../Elements/ProfileGroupCard';

function ResultsGrid({ groups }) {
  return (
    <div style={{ padding: 0 }}>
      <Grid columns={2} padded stackable>
        {groups.map((group) => (
          <Grid.Column key={group.id}>
            <ProfileGroupCard group={group} />
          </Grid.Column>
        ))}
      </Grid>
    </div>
  );
}

ResultsGrid.propTypes = {
  groups: PropTypes.arrayOf(PropTypes.shape({})),
  isFiltering: PropTypes.bool,
};

export default withGroups({})(ResultsGrid);
