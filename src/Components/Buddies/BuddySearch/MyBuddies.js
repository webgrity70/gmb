import React from 'react';
import isEmpty from 'lodash/isEmpty';
import PropTypes from 'prop-types';
import { Grid } from 'semantic-ui-react';
import ProfileCard from '../../Elements/ProfileCard';
import RecommendedBuddies from '../../Elements/RecommendedBuddies';

function MyBuddies({ buddies, profile, view }) {
  const hasPlan = profile ? profile.has_plan : false;
  const myBuddies = buddies
    .filter(({ buddy }) => !isEmpty(buddy))
    .map(({ buddy }) => ({
      gender: buddy.gender,
      location: buddy.location,
      avatar: buddy.avatar,
      name: buddy.name,
      availableCategories: buddy.category_available,
      id: buddy.pk,
      lastOnline: buddy.last_online,
      percentage: buddy.percentage,
      nonBeta: buddy.non_beta,
      timezoneName: buddy.timezone_name,
      timezoneOffset: buddy.timezone_offset,
      accountLevel: buddy.levels.global.points,
    }));
  function renderLists() {
    if (window.innerWidth >= 767 && view === 'list') {
      return (
        <RecommendedBuddies
          buddies={myBuddies}
          order="desc"
          orderBy=""
          onOrderChange={() => {}}
        />
      );
    }
    if (window.innerWidth < 767 || view === 'grid') {
      return (
        <div style={{ padding: 0 }}>
          <Grid columns={2} padded stackable>
            {myBuddies.map((buddy) => (
              <Grid.Column key={buddy.id}>
                <ProfileCard buddy={buddy} />
              </Grid.Column>
            ))}
          </Grid>
        </div>
      );
    }
    return null;
  }
  return (
    <div style={{ backgroundColor: 'white' }}>
      {hasPlan && myBuddies.length > 0 && renderLists()}
      {hasPlan && !myBuddies.length && (
        <div className="empty-buddies">
          You don&apos;t have any buddies yet! Search using the filter and text
          box above.
        </div>
      )}
    </div>
  );
}

MyBuddies.propTypes = {
  buddies: PropTypes.arrayOf(PropTypes.shape()),
  view: PropTypes.string,
  profile: PropTypes.shape({
    has_plan: PropTypes.bool,
  }),
};

export default MyBuddies;
