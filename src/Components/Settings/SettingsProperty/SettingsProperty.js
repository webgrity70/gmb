import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import BEMHelper from 'react-bem-helper';
import { Grid } from 'semantic-ui-react';

import './SettingsProperty.scss';

const bem = BEMHelper({ name: 'SettingsProperty', outputIsString: true });

const SettingsProperty = ({
  className,
  name,
  value,
  nameChild,
  valueChild,
}) => (
  <div className={cx(bem(), className)}>
    <Grid>
      <Grid.Column tablet={4} className={bem('title-col')}>
        {nameChild || <span className={bem('title')}>{name}</span>}
      </Grid.Column>
      <Grid.Column tablet={12}>
        {valueChild || <span className={bem('value')}>{value}</span>}
      </Grid.Column>
    </Grid>
  </div>
);

SettingsProperty.propTypes = {
  className: PropTypes.string,
  name: PropTypes.node,
  value: PropTypes.node,
  nameChild: PropTypes.node,
  valueChild: PropTypes.node,
};

export default SettingsProperty;
