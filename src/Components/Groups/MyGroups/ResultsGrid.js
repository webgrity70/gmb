import React from 'react';
import PropTypes from 'prop-types';
import { Grid } from 'semantic-ui-react';
import ProfileGroupCard from '../../Elements/ProfileGroupCard';

function ResultsGrid({ groups, className }) {
  return (
    <div className={className}>
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
  className: PropTypes.string,
  groups: PropTypes.arrayOf(PropTypes.shape()),
};

export default ResultsGrid;
