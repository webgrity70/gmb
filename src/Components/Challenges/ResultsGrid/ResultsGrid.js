import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import BEMHelper from 'react-bem-helper';
import { Link } from 'react-router-dom';
import moment from 'moment';
import { Grid, Icon, Segment } from 'semantic-ui-react';
import { getRegularChallenges } from '../../../selectors/challenges';
import CategoriesIcons from '../../Elements/CategoriesIcons';
import defaultChallenge from '../../../Assets/images/challenge.png';
import './ResultsGrid.scss';
import Intensity from '../Intensity';
import RegularPreview from '../RegularPreview';
import ChallengeStatus from './ChallengeStatus';

const bem = BEMHelper({ name: 'ChallengeGridCard', outputIsString: true });

const TYPES = {
  PRIVATE: 'private',
};

function ResultsGrid({ challenges, myChallenges = false }) {
  const [selected, setSelected] = useState(null);
  const [openModal, setOpenModal] = useState(false);
  function onOpenModal(id) {
    setSelected(id);
    setOpenModal(true);
  }
  return (
    <div style={{ padding: 0 }}>
      <Grid columns={2} padded stackable>
        {challenges
          .filter((c) => !myChallenges || c.joinedAt !== null)
          .map((challenge) => (
            <Grid.Column key={challenge.id}>
              <Segment
                className={bem('', { featured: challenge.featured })}
                onClick={() => onOpenModal(challenge.id)}
              >
                <div className={bem('left')}>
                  {challenge.featured && (
                    <div className={bem('featured')}>Featured</div>
                  )}
                  <div className={bem('icon')}>
                    <img
                      src={challenge.icon || defaultChallenge}
                      alt={challenge.name}
                    />
                    {challenge.official && (
                      <div className={bem('official')}>
                        <Icon name="check" />
                      </div>
                    )}
                  </div>
                  <div className={bem('frequency')}>
                    {challenge.frequency}x / week
                  </div>
                  <div
                    className={bem('status', [
                      challenge.featured && 'featured',
                    ])}
                  >
                    <ChallengeStatus challenge={challenge} />
                  </div>
                  <div className={bem('location')}>
                    {challenge.location || 'Planet Earth'}
                  </div>
                  <div className={bem('privacy')}>
                    <Icon
                      name={
                        challenge.privacy === TYPES.PRIVATE
                          ? 'circle outline'
                          : 'circle notch'
                      }
                    />
                    <div className={bem('privacy-text')}>
                      {challenge.privacy === TYPES.PRIVATE ? 'Private' : 'Open'}
                    </div>
                  </div>
                </div>
                <div className={bem('content')}>
                  <div className={bem('details')}>
                    <div className="flex items-center justify-center flex-wrap">
                      <h4>{challenge.name}</h4>
                      {!!challenge.joinedAt && (
                        <span className={bem('joined')}>Joined</span>
                      )}
                    </div>
                    <div className="mt-2">
                      <CategoriesIcons categories={challenge.categories} />
                    </div>
                    <div className={bem('info')}>
                      {moment(challenge.start).format('MMM D')} -{' '}
                      {moment(challenge.finish).format('MMM D, YYYY')}
                    </div>
                    <div className={bem('info')}>{challenge.type}</div>
                    {challenge.timezoneName && (
                      <div className={bem('info')}>
                        {challenge.timezoneName}
                      </div>
                    )}
                    {challenge.challengeManager &&
                      challenge.challengeManager.name && (
                        <div className={bem('info')}>
                          <Link
                            to={`/profile/${challenge.challengeManager.id}`}
                          >
                            {challenge.challengeManager.name}
                          </Link>
                        </div>
                      )}
                  </div>
                  <div className="flex flex-wrap justify-between w-full">
                    <span className={bem('members')}>
                      {challenge.participants} members
                    </span>
                    <Intensity intensity={challenge.intensity} />
                  </div>
                </div>
              </Segment>
            </Grid.Column>
          ))}
      </Grid>
      <RegularPreview
        id={selected}
        open={openModal}
        onClose={() => setOpenModal(false)}
      />
    </div>
  );
}

ResultsGrid.propTypes = {
  challenges: PropTypes.arrayOf(PropTypes.shape({})),
};

const mapStateToProps = (state) => ({
  challenges: getRegularChallenges(state),
});

export default connect(mapStateToProps)(ResultsGrid);
