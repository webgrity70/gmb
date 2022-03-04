import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Grid, Container } from 'semantic-ui-react';
import cx from 'classnames';
import BEMHelper from 'react-bem-helper';
import AccountabilityScore from '../../Elements/AccountabilityScore';
import CategoryScore from '../../Elements/CategoryScore';
import {
  getUserCategoriesScore,
  getUserCurrentLevel,
  getUserScorePoints,
} from '../../../selectors/profile';

import './StatsBar.scss';

const bem = BEMHelper({ name: 'ProfilePageStatsBar', outputIsString: true });

function StatsBar(props) {
  const { levelColor, points, levelName, className, categories } = props;
  return (
    <div className={cx(bem(), className, 'py-4')}>
      <Container className={bem('container')}>
        <Grid className={bem('main-grid')} stackable>
          <Grid.Column computer={4} tablet={5}>
            <div className="flex-center-all h-full">
              <AccountabilityScore
                className={bem('score')}
                points={points}
                levelcolor={levelColor}
                levelName={levelName}
              />
            </div>
          </Grid.Column>
          <Grid.Column computer={8} tablet={8}>
            <Grid className={bem('categories-grid')}>
              {categories.map((categoryLevel) => (
                <Grid.Column key={categoryLevel.slug} computer={4} tablet={8}>
                  <div className="flex-center-all">
                    <CategoryScore
                      categoryLevel={categoryLevel}
                      key={categoryLevel}
                    />
                  </div>
                </Grid.Column>
              ))}
            </Grid>
          </Grid.Column>
        </Grid>
      </Container>
    </div>
  );
}

StatsBar.propTypes = {
  className: PropTypes.string,
  levelName: PropTypes.string,
  levelColor: PropTypes.string,
  points: PropTypes.number,
  categories: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
};

const mapStateToProps = (state, props) => {
  const currentLevel = getUserCurrentLevel(state, props) || {};
  return {
    categories: getUserCategoriesScore(state, props) || [],
    levelColor: currentLevel.color,
    levelName: currentLevel.name,
    points: getUserScorePoints(state, props),
  };
};

const ConnectedStatsBar = connect(mapStateToProps, {})(StatsBar);

ConnectedStatsBar.propTypes = {
  profileId: PropTypes.string,
};

export default ConnectedStatsBar;
