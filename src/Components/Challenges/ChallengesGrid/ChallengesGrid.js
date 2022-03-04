import React, { useState } from 'react';
import cx from 'classnames';
import { Grid, Icon } from 'semantic-ui-react';
import PropTypes from 'prop-types';
import BEMHelper from 'react-bem-helper';
import { connect } from 'react-redux';
import { getFlashChallegesByInterval } from '../../../selectors/challenges';
import { GlobalFlashChallengeCard } from '../ChallengeCard';
import './ChallengesGrid.scss';
import {
  getFlashChallengeListLoaded,
  getFlashChallengeListLoading,
} from '../../../selectors/requests';
import Loading from '../../Loading';

const bem = BEMHelper({ name: 'ChallengesGrid', outputIsString: true });

function ChallengesGrid({ challenges, loading, loaded, myChallenges = false }) {
  const [showMore, setShowMore] = useState(false);
  /* useEffect(() => {
    setShowMore(false);
  }, [challenges.length]); */
  if (loading) return <Loading />;
  if (loaded && !challenges.length) {
    return (
      <div className={bem('empty')}>
        <h3>No results found</h3>
        <span>Try changing the date or creating a challenge</span>
      </div>
    );
  }
  return (
    <div className={bem()}>
      <Grid columns={3} padded stackable>
        {challenges
          .slice(0, showMore ? challenges.length : 3)
          .map((challengeId, index) => (
            <GlobalFlashChallengeCard
              id={challengeId}
              myChallenges={myChallenges}
              index={index}
              key={`challenge-card-${challengeId}`}
            />
          ))}
      </Grid>
      {!showMore && challenges.length > 3 && (
        <div className={bem('more')}>
          <button type="button" onClick={() => setShowMore(true)}>
            show more
            <Icon name="chevron down" />
          </button>
        </div>
      )}
    </div>
  );
}

ChallengesGrid.propTypes = {
  challenges: PropTypes.arrayOf(
    PropTypes.oneOfType([PropTypes.number, PropTypes.string])
  ),
  loading: PropTypes.bool,
  loaded: PropTypes.bool,
};

const mapStateToProps = (state, { startDate, endDate }) => ({
  challenges: getFlashChallegesByInterval(state, { startDate, endDate }),
  loaded: getFlashChallengeListLoaded(state),
  loading: getFlashChallengeListLoading(state),
});

export default connect(mapStateToProps)(ChallengesGrid);
