import React from 'react';
import { PrivacyBlock } from './components';

class PrivacySettings extends React.Component {
  state = {};

  render() {
    return (
      <React.Fragment>
        <PrivacyBlock title="Privacy" {...this.props} />
      </React.Fragment>
    );
  }
}

export default PrivacySettings;
