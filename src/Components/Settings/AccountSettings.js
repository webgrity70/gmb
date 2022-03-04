import React from 'react';
import * as PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { SettingsBlock } from './components';
import { isBasicInfoComplete } from '../../selectors/profile';

const propTypes = {
  basicIncomplete: PropTypes.bool,
  user: PropTypes.shape({
    first_name: PropTypes.string,
    last_name: PropTypes.string,
    name: PropTypes.string,
    date_of_birth: PropTypes.string,
    phone_number: PropTypes.string,
    google: PropTypes.string,
    facebook: PropTypes.string,
  }).isRequired,
};

class AccountSettings extends React.Component {
  constructor(props) {
    super(props);
    const { user } = this.props;
    this.state = {
      user,
    };
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    const { user } = nextProps;
    this.setState({ user });
  }

  render() {
    const { user, basicIncomplete } = this.props;
    const basicInformation = [
      { label: 'First Name', value: user.first_name, key: 'first_name' },
      { label: 'Last Name', value: user.last_name, key: 'last_name' },
      { label: 'Display Name', value: user.name, single: true },
      {
        label: 'Birth date',
        value: user.date_of_birth,
        key: 'date_of_birth',
        single: true,
      },
    ];
    const profileVerification = [
      {
        label: 'Google',
        value: user.google,
        single: true,
        verified: !!user.google,
      },
      {
        label: 'Facebook',
        value: user.facebook,
        single: true,
        verified: !!user.facebook,
      },
    ];
    return (
      <React.Fragment>
        <SettingsBlock
          title="Basic information"
          settings={basicInformation}
          editable
          incomplete={basicIncomplete}
          {...this.props}
        />
        <SettingsBlock
          title="Profile Verifications"
          settings={profileVerification}
          service={undefined}
          editable={false}
          {...this.props}
        />
      </React.Fragment>
    );
  }
}

AccountSettings.propTypes = propTypes;

const mapStateToProps = (state, { user }) => ({
  basicIncomplete: !isBasicInfoComplete(state, { profileId: user.pk }),
});

export default connect(mapStateToProps)(AccountSettings);
