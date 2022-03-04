import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Grid } from 'semantic-ui-react';
import cx from 'classnames';
import BEMHelper from 'react-bem-helper';
import keyBy from 'lodash/keyBy';
import {
  getUserBehaviours,
  getUserMeasurementUnit,
} from '../../../../selectors/profile';
import { getNegativeBehaviourOptions } from '../../../../selectors/profileFormOptions';

import './NegativeBehaviourModuleInfo.scss';

const bem = BEMHelper({
  name: 'ProfileNegativeBehaviourModuleInfo',
  outputIsString: true,
});

function NegativeBehaviourModuleInfo(props) {
  const { behaviours, className, measurementUnit, behaviourOptions } = props;
  const behavioursByName = keyBy(behaviourOptions, 'name');
  return (
    <div className={cx(bem(), className, 'px-2')}>
      <Grid columns={2}>
        {behaviours.map((behaviour) => {
          const behaviourData = behavioursByName[behaviour.name] || {};
          let label = behaviour.name;
          if (behaviour.name === 'Lose Weight' && behaviour.extra) {
            if (measurementUnit === 'Imperial') {
              const weightLoss = Math.round(behaviour.extra * 2.2046);
              label += ` - ${weightLoss} lb`;
            } else {
              label += ` - ${behaviour.extra} kg`;
            }
          }
          return (
            <Grid.Column key={behaviour.name}>
              <div className="flex">
                {behaviourData.icon ? (
                  <img
                    src={behaviourData.icon}
                    width={24}
                    height={24}
                    className={bem('item-icon')}
                    alt={behaviour.name}
                  />
                ) : null}
                <span className={bem('item-name')}>{label}</span>
              </div>
            </Grid.Column>
          );
        })}
      </Grid>
    </div>
  );
}

NegativeBehaviourModuleInfo.propTypes = {
  className: PropTypes.string,
  behaviours: PropTypes.arrayOf(PropTypes.shape({})),
  measurementUnit: PropTypes.string,
  behaviourOptions: PropTypes.arrayOf(PropTypes.shape({})),
};

const mapStateToProps = (state, props) => ({
  behaviours: getUserBehaviours(state, props) || [],
  measurementUnit: getUserMeasurementUnit(state, props),
  behaviourOptions: getNegativeBehaviourOptions(state, props),
});

const ConnectedNegativeBehaviourModuleInfo = connect(
  mapStateToProps,
  {}
)(NegativeBehaviourModuleInfo);

ConnectedNegativeBehaviourModuleInfo.propTypes = {
  profileId: PropTypes.string,
};

export default ConnectedNegativeBehaviourModuleInfo;
