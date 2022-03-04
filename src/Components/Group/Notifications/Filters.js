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
  toggleGroupNewMemberEmailNotificationAction,
  toggleGroupNewMemberSiteNotificationAction,
  toggleGroupNewPostEmailNotificationAction,
  toggleGroupNewPostSiteNotificationAction,
  toggleGroupPostMentionEmailNotificationAction,
  toggleGroupPostMentionSiteNotificationAction,
  toggleGroupPostResponseEmailNotificationAction,
  toggleGroupPostResponseSiteNotificationAction,
} from '../../../Actions/actions_groups';
import { getGroupMembership } from '../../../selectors/groupChat';
import Helpers from '../../Utils/Helpers';
import { fetchGroupsThreads } from '../../../Actions/action_group_chat';

const Filters = ({
  groupMembership,
  toggleNewPostSiteNotification,
  toggleNewPostEmailNotification,
  togglePostResponseSiteNotification,
  togglePostResponseEmailNotification,
  togglePostMentionSiteNotification,
  togglePostMentionEmailNotification,
  toggleNewMemberSiteNotification,
  toggleNewMemberEmailNotification,
}) => {
  const dispatch = useDispatch();
  const [
    newPostSiteNotificationEnabled,
    setNewPostSiteNotificationEnabled,
  ] = useState(groupMembership.new_post_notification_site);
  const [
    newPostEmailNotificationEnabled,
    setNewPostEmailNotificationEnabled,
  ] = useState(groupMembership.new_post_notification_email);
  const [
    postResponseSiteNotificationEnabled,
    setPostResponseSiteNotificationEnabled,
  ] = useState(groupMembership.new_response_notification_site);
  const [
    postResponseEmailNotificationEnabled,
    setPostResponseEmailNotificationEnabled,
  ] = useState(groupMembership.new_response_notification_email);
  const [
    postMentionSiteNotificationEnabled,
    setPostMentionSiteNotificationEnabled,
  ] = useState(groupMembership.post_mention_notification_site);
  const [
    postMentionEmailNotificationEnabled,
    setPostMentionEmailNotificationEnabled,
  ] = useState(groupMembership.post_mention_notification_email);
  const [
    newMemberSiteNotificationEnabled,
    setNewMemberSiteNotificationEnabled,
  ] = useState(groupMembership.new_member_notification_site);
  const [
    newMemberEmailNotificationEnabled,
    setNewMemberEmailNotificationEnabled,
  ] = useState(groupMembership.new_member_notification_email);

  const onToggleGroupNewPostSiteNotification = () => {
    toggleNewPostSiteNotification({
      groupId: groupMembership.id,
      enabled: newPostSiteNotificationEnabled,
      disablePath: 'disablenewpostsite',
      enablePath: 'enablenewpostsite',
    })
      .then(async (data) => {
        await dispatch(fetchGroupsThreads({ usePagination: false }));
        Helpers.createToast(data);
        setNewPostSiteNotificationEnabled(!newPostSiteNotificationEnabled);
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

  const onToggleGroupNewPostEmailNotification = () => {
    toggleNewPostEmailNotification({
      groupId: groupMembership.id,
      enabled: newPostEmailNotificationEnabled,
      disablePath: 'disablenewpostemail',
      enablePath: 'enablenewpostemail',
    })
      .then(async (data) => {
        await dispatch(fetchGroupsThreads({ usePagination: false }));
        Helpers.createToast(data);
        setNewPostEmailNotificationEnabled(!newPostEmailNotificationEnabled);
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
  const onToggleGroupPostResponseSiteNotification = () => {
    togglePostResponseSiteNotification({
      groupId: groupMembership.id,
      enabled: postResponseSiteNotificationEnabled,
      disablePath: 'disablepostresponsesite',
      enablePath: 'enablepostresponsesite',
    })
      .then(async (data) => {
        await dispatch(fetchGroupsThreads({ usePagination: false }));
        Helpers.createToast(data);
        setPostResponseSiteNotificationEnabled(
          !postResponseSiteNotificationEnabled
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

  const onToggleGroupPostResponseEmailNotification = () => {
    togglePostResponseEmailNotification({
      groupId: groupMembership.id,
      enabled: postResponseEmailNotificationEnabled,
      disablePath: 'disablepostresponseemail',
      enablePath: 'enablepostresponseemail',
    })
      .then(async (data) => {
        await dispatch(fetchGroupsThreads({ usePagination: false }));
        Helpers.createToast(data);
        setPostResponseEmailNotificationEnabled(
          !postResponseEmailNotificationEnabled
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
  const onToggleGroupPostMentionSiteNotification = () => {
    togglePostMentionSiteNotification({
      groupId: groupMembership.id,
      enabled: postMentionSiteNotificationEnabled,
      disablePath: 'disablepostmentionsite',
      enablePath: 'enablepostmentionsite',
    })
      .then(async (data) => {
        await dispatch(fetchGroupsThreads({ usePagination: false }));
        Helpers.createToast(data);
        setPostMentionSiteNotificationEnabled(
          !postMentionSiteNotificationEnabled
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

  const onToggleGroupPostMentionEmailNotification = () => {
    togglePostMentionEmailNotification({
      groupId: groupMembership.id,
      enabled: postMentionEmailNotificationEnabled,
      disablePath: 'disablepostmentionemail',
      enablePath: 'enablepostmentionemail',
    })
      .then(async (data) => {
        await dispatch(fetchGroupsThreads({ usePagination: false }));
        Helpers.createToast(data);
        setPostMentionEmailNotificationEnabled(
          !postMentionEmailNotificationEnabled
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
  const onToggleGroupNewMemberSiteNotification = () => {
    toggleNewMemberSiteNotification({
      groupId: groupMembership.id,
      enabled: newMemberSiteNotificationEnabled,
      disablePath: 'disablenewmembersite',
      enablePath: 'enablenewmembersite',
    })
      .then(async (data) => {
        await dispatch(fetchGroupsThreads({ usePagination: false }));
        Helpers.createToast(data);
        setNewMemberSiteNotificationEnabled(!newMemberSiteNotificationEnabled);
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

  const onToggleGroupNewMemberEmailNotification = () => {
    toggleNewMemberEmailNotification({
      groupId: groupMembership.id,
      enabled: newMemberEmailNotificationEnabled,
      disablePath: 'disablenewmemberemail',
      enablePath: 'enablenewmemberemail',
    })
      .then(async (data) => {
        await dispatch(fetchGroupsThreads({ usePagination: false }));
        Helpers.createToast(data);
        setNewMemberEmailNotificationEnabled(
          !newMemberEmailNotificationEnabled
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
  return (
    <div className="notification-content">
      <span>Group Notifications</span>
      <div>
        <Grid columns="three">
          <Grid.Row>
            <Grid.Column></Grid.Column>
            <Grid.Column>Site</Grid.Column>
            <Grid.Column>Email</Grid.Column>
          </Grid.Row>
          <Grid.Row>
            <Grid.Column className="small">New Members</Grid.Column>
            <Grid.Column>
              <Checkbox
                toggle
                checked={newMemberSiteNotificationEnabled}
                onChange={onToggleGroupNewMemberSiteNotification}
              />
            </Grid.Column>
            <Grid.Column>
              <Checkbox
                toggle
                checked={newMemberEmailNotificationEnabled}
                onChange={onToggleGroupNewMemberEmailNotification}
              />
            </Grid.Column>
          </Grid.Row>
          <Grid.Row>
            <Grid.Column className="small">New Posts</Grid.Column>
            <Grid.Column>
              <Checkbox
                toggle
                checked={newPostSiteNotificationEnabled}
                onChange={onToggleGroupNewPostSiteNotification}
              />
            </Grid.Column>
            <Grid.Column>
              <Checkbox
                toggle
                checked={newPostEmailNotificationEnabled}
                onChange={onToggleGroupNewPostEmailNotification}
              />
            </Grid.Column>
          </Grid.Row>
          <Grid.Row>
            <Grid.Column className="small">New Post Responses</Grid.Column>
            <Grid.Column>
              <Checkbox
                toggle
                checked={postResponseSiteNotificationEnabled}
                onChange={onToggleGroupPostResponseSiteNotification}
              />
            </Grid.Column>
            <Grid.Column>
              <Checkbox
                toggle
                checked={postResponseEmailNotificationEnabled}
                onChange={onToggleGroupPostResponseEmailNotification}
              />
            </Grid.Column>
          </Grid.Row>
          <Grid.Row>
            <Grid.Column className="small">Post @mentions</Grid.Column>
            <Grid.Column>
              <Checkbox
                toggle
                checked={postMentionSiteNotificationEnabled}
                onChange={onToggleGroupPostMentionSiteNotification}
              />
            </Grid.Column>
            <Grid.Column>
              <Checkbox
                toggle
                checked={postMentionEmailNotificationEnabled}
                onChange={onToggleGroupPostMentionEmailNotification}
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

const mapStateToProps = (state, { groupId }) => ({
  groupMembership: getGroupMembership(state, {
    groupId: groupId,
  }),
});

export default compose(
  withNotifications({}),
  connect(mapStateToProps, {
    toggleNewPostSiteNotification: toggleGroupNewPostSiteNotificationAction,
    toggleNewPostEmailNotification: toggleGroupNewPostEmailNotificationAction,
    togglePostResponseSiteNotification: toggleGroupPostResponseSiteNotificationAction,
    togglePostResponseEmailNotification: toggleGroupPostResponseEmailNotificationAction,
    togglePostMentionSiteNotification: toggleGroupPostMentionSiteNotificationAction,
    togglePostMentionEmailNotification: toggleGroupPostMentionEmailNotificationAction,
    toggleNewMemberSiteNotification: toggleGroupNewMemberSiteNotificationAction,
    toggleNewMemberEmailNotification: toggleGroupNewMemberEmailNotificationAction,
  })
)(Filters);
