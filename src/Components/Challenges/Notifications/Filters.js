/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */
import React, { useState } from 'react';
import { connect, useDispatch } from 'react-redux';
import { compose } from 'redux';
import PropTypes from 'prop-types';
import capitalize from 'lodash/capitalize';
import cx from 'classnames';
import { bem } from './index';
import { withNotifications } from '../../HoCs';
import { Checkbox, Grid } from 'semantic-ui-react';
import {
  toggleChallengeCheckinEmailNotificationAction,
  toggleChallengeCheckinSiteNotificationAction,
  toggleChallengeIntentionEmailNotificationAction,
  toggleChallengeIntentionSiteNotificationAction,
  toggleChallengeNewParticipantEmailNotificationAction,
  toggleChallengeNewParticipantSiteNotificationAction,
} from '../../../Actions/actions_challenges';
import { getChallengeMembership } from '../../../selectors/challengesChat';
import Helpers from '../../Utils/Helpers';
import { fetchChallengesThreads } from '../../../Actions/actions_challenges_chat';

const Filters = ({
  challengeMembership,
  toggleNewParticipantSiteNotification,
  toggleNewParticipantEmailNotification,
  toggleIntentionSiteNotification,
  toggleIntentionEmailNotification,
  toggleCheckinSiteNotification,
  toggleCheckinEmailNotification,
}) => {
  const dispatch = useDispatch();
  const [
    newParticipantSiteNotificationEnabled,
    setNewParticipantSiteNotificationEnabled,
  ] = useState(challengeMembership.new_member_notification_site);
  const [
    newParticipantEmailNotificationEnabled,
    setNewParticipantEmailNotificationEnabled,
  ] = useState(challengeMembership.new_member_notification_email);

  const [
    intentionSiteNotificationEnabled,
    setIntentionSiteNotificationEnabled,
  ] = useState(challengeMembership.intention_notification_site);
  const [
    intentionEmailNotificationEnabled,
    setIntentionEmailNotificationEnabled,
  ] = useState(challengeMembership.intention_notification_email);

  const [
    checkinSiteNotificationEnabled,
    setCheckinSiteNotificationEnabled,
  ] = useState(challengeMembership.checkin_notification_site);
  const [
    checkinEmailNotificationEnabled,
    setCheckinEmailNotificationEnabled,
  ] = useState(challengeMembership.checkin_notification_email);

  const onToggleChallengeNewParticipantSiteNotification = () => {
    toggleNewParticipantSiteNotification({
      challengeId: challengeMembership.id,
      enabled: newParticipantSiteNotificationEnabled,
      disablePath: 'disablenewparticipantsite',
      enablePath: 'enablenewparticipantsite',
    })
      .then(async (data) => {
        await dispatch(fetchChallengesThreads({ usePagination: false }));
        Helpers.createToast(data);
        setNewParticipantSiteNotificationEnabled(
          !newParticipantSiteNotificationEnabled
        );
      })
      .catch((data) => {
        if (data.message !== undefined) {
          Helpers.createToast(data);
        } else {
          Helpers.createToast({
            status: 'error',
            message: 'Something went wrong.',
          });
        }
      });
  };

  const onToggleChallengeNewParticipantEmailNotification = () => {
    toggleNewParticipantEmailNotification({
      challengeId: challengeMembership.id,
      enabled: newParticipantEmailNotificationEnabled,
      disablePath: 'disablenewparticipantemail',
      enablePath: 'enablenewparticipantemail',
    })
      .then(async (data) => {
        await dispatch(fetchChallengesThreads({ usePagination: false }));
        Helpers.createToast(data);
        setNewParticipantEmailNotificationEnabled(
          !newParticipantEmailNotificationEnabled
        );
      })
      .catch((data) => {
        if (data.message !== undefined) {
          Helpers.createToast(data);
        } else {
          Helpers.createToast({
            status: 'error',
            message: 'Something went wrong.',
          });
        }
      });
  };

  const onToggleChallengeIntentionSiteNotification = () => {
    toggleIntentionSiteNotification({
      challengeId: challengeMembership.id,
      enabled: intentionSiteNotificationEnabled,
      disablePath: 'disableintentionsite',
      enablePath: 'enableintentionsite',
    })
      .then(async (data) => {
        await dispatch(fetchChallengesThreads({ usePagination: false }));
        Helpers.createToast(data);
        setIntentionSiteNotificationEnabled(!intentionSiteNotificationEnabled);
      })
      .catch((data) => {
        if (data.message !== undefined) {
          Helpers.createToast(data);
        } else {
          Helpers.createToast({
            status: 'error',
            message: 'Something went wrong.',
          });
        }
      });
  };

  const onToggleChallengeIntentionEmailNotification = () => {
    toggleIntentionEmailNotification({
      challengeId: challengeMembership.id,
      enabled: intentionEmailNotificationEnabled,
      disablePath: 'disableintentionemail',
      enablePath: 'enableintentionemail',
    })
      .then(async (data) => {
        await dispatch(fetchChallengesThreads({ usePagination: false }));
        Helpers.createToast(data);
        setIntentionEmailNotificationEnabled(
          !intentionEmailNotificationEnabled
        );
      })
      .catch((data) => {
        if (data.message !== undefined) {
          Helpers.createToast(data);
        } else {
          Helpers.createToast({
            status: 'error',
            message: 'Something went wrong.',
          });
        }
      });
  };

  const onToggleChallengeCheckinSiteNotification = () => {
    toggleCheckinSiteNotification({
      challengeId: challengeMembership.id,
      enabled: checkinSiteNotificationEnabled,
      disablePath: 'disablecheckinsite',
      enablePath: 'enablecheckinsite',
    })
      .then(async (data) => {
        await dispatch(fetchChallengesThreads({ usePagination: false }));
        Helpers.createToast(data);
        setCheckinSiteNotificationEnabled(!checkinSiteNotificationEnabled);
      })
      .catch((data) => {
        if (data.message !== undefined) {
          Helpers.createToast(data);
        } else {
          Helpers.createToast({
            status: 'error',
            message: 'Something went wrong.',
          });
        }
      });
  };

  const onToggleChallengeCheckinEmailNotification = () => {
    toggleCheckinEmailNotification({
      challengeId: challengeMembership.id,
      enabled: checkinEmailNotificationEnabled,
      disablePath: 'disablecheckinemail',
      enablePath: 'enablecheckinemail',
    })
      .then(async (data) => {
        await dispatch(fetchChallengesThreads({ usePagination: false }));
        Helpers.createToast(data);
        setCheckinEmailNotificationEnabled(!checkinEmailNotificationEnabled);
      })
      .catch((data) => {
        if (data.message !== undefined) {
          Helpers.createToast(data);
        } else {
          Helpers.createToast({
            status: 'error',
            message: 'Something went wrong.',
          });
        }
      });
  };

  return (
    <div className="notification-content">
      <span>Challenge Notifications</span>
      <div>
        <Grid columns="three">
          <Grid.Row>
            <Grid.Column></Grid.Column>
            <Grid.Column>Site</Grid.Column>
            <Grid.Column>Email</Grid.Column>
          </Grid.Row>
          <Grid.Row>
            <Grid.Column className="small">New Participants</Grid.Column>
            <Grid.Column>
              <Checkbox
                toggle
                checked={newParticipantSiteNotificationEnabled}
                onChange={onToggleChallengeNewParticipantSiteNotification}
              />
            </Grid.Column>
            <Grid.Column>
              <Checkbox
                toggle
                checked={newParticipantEmailNotificationEnabled}
                onChange={onToggleChallengeNewParticipantEmailNotification}
              />
            </Grid.Column>
          </Grid.Row>
          <Grid.Row>
            <Grid.Column className="small">Confirmations</Grid.Column>
            <Grid.Column>
              <Checkbox
                toggle
                checked={intentionSiteNotificationEnabled}
                onChange={onToggleChallengeIntentionSiteNotification}
              />
            </Grid.Column>
            <Grid.Column>
              <Checkbox
                toggle
                checked={intentionEmailNotificationEnabled}
                onChange={onToggleChallengeIntentionEmailNotification}
              />
            </Grid.Column>
          </Grid.Row>
          <Grid.Row>
            <Grid.Column className="small">Check ins</Grid.Column>
            <Grid.Column>
              <Checkbox
                toggle
                checked={checkinSiteNotificationEnabled}
                onChange={onToggleChallengeCheckinSiteNotification}
              />
            </Grid.Column>
            <Grid.Column>
              <Checkbox
                toggle
                checked={checkinEmailNotificationEnabled}
                onChange={onToggleChallengeCheckinEmailNotification}
              />
            </Grid.Column>
          </Grid.Row>
        </Grid>
      </div>
    </div>
  );
};

Filters.propTypes = {
  notifications: PropTypes.shape(),
  updateUserNotifications: PropTypes.func,
  toggleNewPostSiteNotification: PropTypes.func,
};

const mapStateToProps = (state, { challengeId }) => ({
  challengeMembership: getChallengeMembership(state, {
    challengeId: challengeId,
  }),
});

export default compose(
  withNotifications({}),
  connect(mapStateToProps, {
    toggleNewParticipantSiteNotification: toggleChallengeNewParticipantSiteNotificationAction,
    toggleNewParticipantEmailNotification: toggleChallengeNewParticipantEmailNotificationAction,
    toggleIntentionSiteNotification: toggleChallengeIntentionSiteNotificationAction,
    toggleIntentionEmailNotification: toggleChallengeIntentionEmailNotificationAction,
    toggleCheckinSiteNotification: toggleChallengeCheckinSiteNotificationAction,
    toggleCheckinEmailNotification: toggleChallengeCheckinEmailNotificationAction,
  })
)(Filters);
