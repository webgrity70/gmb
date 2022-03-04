import React from 'react';
import PropTypes from 'prop-types';
import { Flag } from 'semantic-ui-react';
import { ReactComponent as EarthIcon } from '../../../Assets/images/earth-icon.svg';

const GMBFlag = ({ country, ...props }) => {
  if (country) {
    return <Flag name={country.toLowerCase()} />;
  }

  return <EarthIcon {...props} style={{ marginRight: '10px' }} />;
};

GMBFlag.propTypes = {
  country: PropTypes.string,
};

export default GMBFlag;
