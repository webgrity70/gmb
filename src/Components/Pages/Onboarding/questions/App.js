import React from 'react';
import { connect } from 'react-redux';

import DropdownMultiple from './DropdownMultiple';
import { onCustomAppAdded } from '../../../../Actions/signup';

const Apps = ({ value, onChange, apps, onCustomAppAdded }) => (
  <DropdownMultiple
    options={apps}
    onChange={onChange}
    value={value}
    allowAdditions
    onAddItem={(e, { value }) => onCustomAppAdded(value)}
  />
);

const mapStateToProps = (state) => ({
  apps: state.signup.apps,
});

export default connect(mapStateToProps, { onCustomAppAdded })(Apps);
