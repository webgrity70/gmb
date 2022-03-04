import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Icon } from 'semantic-ui-react';
import {
  fetchGroupsInvites as fetchGroupsInvitesAction,
  fetchChallengesInvites as fetchChallengesInvitesAction,
} from '../../Actions/actions_user';
import TabsContainer from '../Elements/TabsContainer/TabsContainer';
import BuddyRequests from './BuddyRequests';
import GroupsInvites from './GroupsInvites';
import ChallengesInvites from './ChallengesInvites';

import SideBarService from '../../Services/SideBarService';

function Invites(props) {
  const {
    open,
    newBuddiesCount,
    newGroupsCount,
    closeSidebarFunction,
    fetchGroupsInvites,
    newChallengesCount,
    fetchChallengesInvites,
    ...restProps
  } = props;
  useEffect(() => {
    fetchGroupsInvites({ usePagination: true });
  }, [newGroupsCount]);
  useEffect(() => {
    fetchChallengesInvites({ usePagination: true });
  }, [newChallengesCount]);
  if (!open) {
    return <React.Fragment />;
  }
  function markBuddyRequestsSeen() {
    SideBarService.markBuddyRequestsSeen().catch(console.error);
  }

  function markGroupInvitationsSeen() {
    SideBarService.markGroupInvitationsSeen().catch(console.error);
  }

  function markChallengeInvitationsSeen() {
    SideBarService.markChallengeInvitationsSeen().catch(console.error);
  }

  return (
    <div className="chat-sidebar menu">
      <div className="sidebar-header">
        <h2>
          <Icon className="user plus" /> Invites
        </h2>
      </div>
      <TabsContainer
        panes={[
          {
            title: 'BUDDIES',
            Component: BuddyRequests,
            props: {
              ...restProps,
              markBuddyRequestsSeen,
              new: newBuddiesCount > 0,
            },
            ...(newBuddiesCount > 0 && {
              ExtraTitle: () => <Icon name="circle" />,
            }),
          },
          {
            title: 'GROUPS',
            Component: GroupsInvites,
            props: {
              hasNewInvites: newGroupsCount > 0,
              markGroupInvitationsSeen,
            },
            ...(newGroupsCount > 0 && {
              ExtraTitle: () => <Icon name="circle" />,
            }),
          },
          {
            title: 'CHALLENGES',
            Component: ChallengesInvites,
            props: {
              closeSidebarFunction,
              hasNewInvites: newChallengesCount > 0,
              markChallengeInvitationsSeen,
            },
            ...(newChallengesCount > 0 && {
              ExtraTitle: () => <Icon name="circle" />,
            }),
          },
        ]}
      />
    </div>
  );
}

Invites.propTypes = {
  open: PropTypes.bool,
  newGroupsCount: PropTypes.number,
  newBuddiesCount: PropTypes.number,
  fetchGroupsInvites: PropTypes.func,
  newChallengesCount: PropTypes.number,
  closeSidebarFunction: PropTypes.func,
  fetchChallengesInvites: PropTypes.func,
};

export default connect(null, {
  fetchGroupsInvites: fetchGroupsInvitesAction,
  fetchChallengesInvites: fetchChallengesInvitesAction,
})(Invites);
