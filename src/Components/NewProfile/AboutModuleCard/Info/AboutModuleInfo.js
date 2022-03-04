import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Grid } from 'semantic-ui-react';
import cx from 'classnames';
import BEMHelper from 'react-bem-helper';
import OccupationInfo from '../OccupationInfo';

import './AboutModuleInfo.scss';
import { getUserAboutData } from '../../../../selectors/profile';

const bem = BEMHelper({ name: 'ProfileAboutModuleInfo', outputIsString: true });

function AboutModuleInfo(props) {
  const {
    about,
    strength,
    weakness,
    favoriteFood,
    className,
    profileId,
  } = props;

  return (
    <div className={cx(bem(), className)}>
      <Grid columns={2} stackable>
        <Grid.Column>
          <p>{about}</p>
          <OccupationInfo profileId={profileId} />
        </Grid.Column>
        <Grid.Column>
          <p>
            <strong>Strength: </strong>
            <span>{strength}</span>
          </p>
          <p>
            <strong>Weakness: </strong>
            <span>{weakness}</span>
          </p>
          <p>
            <strong>Favorite Food: </strong>
            <span>{favoriteFood}</span>
          </p>
        </Grid.Column>
      </Grid>
    </div>
  );
}

AboutModuleInfo.propTypes = {
  className: PropTypes.string,
  about: PropTypes.string,
  strength: PropTypes.string,
  weakness: PropTypes.string,
  favoriteFood: PropTypes.string,
  profileId: PropTypes.string,
};

const mapStateToProps = (state, props) => {
  const about = getUserAboutData(state, props) || {};
  return {
    about: about.about,
    strength: about.strength,
    weakness: about.weakness,
    favoriteFood: about.favoriteFood,
  };
};

const ConnectedAboutModuleInfo = connect(mapStateToProps, {})(AboutModuleInfo);

ConnectedAboutModuleInfo.propTypes = {
  profileId: PropTypes.string,
};

export default ConnectedAboutModuleInfo;
