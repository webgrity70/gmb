import React, { Component } from 'react';
import { connect } from 'react-redux';
import moment from 'moment';
import LogRocket from 'logrocket';
import { Link } from 'react-router-dom';
import * as userActions from '../../Actions/actions_user';
import * as profileActions from '../../Actions/actions_profile';
import OnboardingService from '../../Services/OnboardingService';
import SettingsService from '../../Services/SettingsService';
import Helpers from '../Utils/Helpers';
import { trackSignup as gtmTrackSignup } from '../../utils/gtm';

// where to go when we're done
const REDIRECTPATH = '/settings/notifications';

class Verify extends Component {
  constructor(props) {
    super(props);

    this.state = {
      finished: false,
      success: false,
    };
  }

  UNSAFE_componentWillMount() {
    // TODO: Should not use _mounted. https://reactjs.org/blog/2015/12/16/ismounted-antipattern.html
    this._mounted = true;
  }

  componentWillUnmount() {
    // TODO: Should not use _mounted. https://reactjs.org/blog/2015/12/16/ismounted-antipattern.html
    this._mounted = false;
  }

  componentDidMount() {
    const {
      match: { params },
    } = this.props;
    const that = this;

    const verify =
      params.type === 'sms'
        ? SettingsService.verifyPhoneCode
        : OnboardingService.userVerify;

    verify(params.hash)
      .then((res) => {
        if (!params.type) {
          gtmTrackSignup.accountVerified();

          localStorage.setItem('access_token', res.access_token);
          localStorage.setItem('refresh_token', res.refresh_token);
          localStorage.setItem('first_login', '1');
          localStorage.setItem(
            'expires',
            moment().add(res.expires_in, 'seconds').format()
          );
          console.log('Verify Response:', res);
          if (res.redirect_url)
            localStorage.setItem('redirect_url', res.redirect_url);
        }

        // TODO: Should not use _mounted. https://reactjs.org/blog/2015/12/16/ismounted-antipattern.html
        if (that._mounted) that.setState({ finished: true, success: true });

        return that.props.fetchUserData();
      })
      .then(async (data) => {
        if (window.analytics) {
          window.analytics.alias(data.pk);
        }

        LogRocket.identify(data.pk, {
          name: data.name,
          email: data.email,
        });

        await Promise.all([
          that.props.fetchUserAbout(data.pk),
          that.props.fetchUserPreferences(data.pk),
          that.props.fetchUserSubscription(data.pk),
          that.props.fetchUserCategories(data.pk),
        ]);

        await that.props.fetchUserInformation(data.pk);
        that.props.updateUser(data, false, true);

        const redirect_url = localStorage.getItem('redirect_url');
        if (redirect_url && redirect_url.startsWith('/'))
          that.props.history.push(redirect_url);
        else that.props.history.push('/profile');
      })
      .catch((data) => {
        Helpers.createToast(data);

        // TODO: Should not use _mounted. https://reactjs.org/blog/2015/12/16/ismounted-antipattern.html
        if (that._mounted) {
          that.setState({ finished: true });
        }
        that.props.history.push(REDIRECTPATH);
      });

    setTimeout(() => {
      // TODO: Should not use _mounted. https://reactjs.org/blog/2015/12/16/ismounted-antipattern.html
      if (this._mounted && !that.state.finished) {
        this.setState({ finished: true, success: true });
      }
    }, 15000);
  }

  render() {
    let message = <span>Your account is being verified, please wait.</span>;

    if (this.state.finished && !this.state.success) {
      message = <span className="text-danger">Invalid verification code.</span>;
    } else if (this.state.finished && this.state.success) {
      message = (
        <span className="text-success">
          You are verified and you are being redirected. If nothing happens for
          a few seconds, click here:
          <Link to={REDIRECTPATH}>Profile Settings</Link>
        </span>
      );
    }

    return <div className="verification">{message}</div>;
  }
}

export default connect(null, {
  fetchUserData: userActions.fetchUserData,
  fetchUserInformation: profileActions.fetchUserInformation,
  fetchUserSubscription: userActions.fetchUserSubscription,
  fetchUserAbout: profileActions.fetchUserAbout,
  fetchUserPreferences: profileActions.fetchUserPreferences,
  fetchUserCategories: profileActions.fetchUserCategories,
})(Verify);
