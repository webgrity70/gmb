import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import cx from 'classnames';
import { Icon } from 'semantic-ui-react';
import { fetchChallengesThreads as fetchChallengesThreadsAction } from '../../Actions/actions_challenges_chat';
import BuddiesThreadsList from '../chat/ThreadsList';
import GroupsThreadsList from '../chat/GroupsThreadsList';
import MessageThread from '../chat/MessageThread';
import * as chatActions from '../../Actions/action_chat';
import * as groupChatActions from '../../Actions/action_group_chat';
import { getSelectedThread, getChatUnreadCount } from '../../selectors/chat';
import {
  getSelectedGroupThread,
  getAllGroupsUnreadCount,
} from '../../selectors/groupChat';
import {
  getSelectedChallengeThread,
  getAllChallengesUnreadCount,
} from '../../selectors/challengesChat';
import GroupMessageThread from '../Group/Chat';
import ChallengeMessageThread from '../Elements/Challenges/Chat';
import TabsContainer from '../Elements/TabsContainer/TabsContainer';
import ChallengesThreadsList from '../chat/ChallengesThreadsList';

function Chat(props) {
  const {
    open,
    isThreadSelected,
    isGroupThreadSelected,
    fetchGroupsThreads,
    fetchThreads,
    unreadChallenge,
    currentTab,
    onChangeTab,
    unreadSingle,
    unreadGroup,
    fetchChallengesThreads,
    isChallengeThreadSelected,
    fetchJoinableGroupsThreads,
  } = props;
  const hideHeader =
    isThreadSelected || isGroupThreadSelected || isChallengeThreadSelected;
  useEffect(() => {
    fetchThreads();
    fetchJoinableGroupsThreads({ usePagination: false });
    fetchGroupsThreads({ usePagination: false });
    fetchChallengesThreads({ usePagination: false });
  }, []);
  if (!open) {
    return <React.Fragment />;
  }
  return (
    <div className={cx('chat-sidebar', { menu: !hideHeader })}>
      {!hideHeader && (
        <div className="sidebar-header">
          <h2>
            <Icon className="comment" /> Chat
          </h2>
        </div>
      )}
      <TabsContainer
        headerClassName={hideHeader ? 'hide' : null}
        currentTab={currentTab}
        onChange={onChangeTab}
        panes={[
          {
            title: 'BUDDIES',
            Component: isThreadSelected ? MessageThread : BuddiesThreadsList,
            ...(unreadSingle > 0 && {
              ExtraTitle: () => <Icon name="circle" />,
            }),
          },
          {
            title: 'GROUPS',
            Component: isGroupThreadSelected
              ? GroupMessageThread
              : GroupsThreadsList,
            ...(unreadGroup > 0 && {
              ExtraTitle: () => <Icon name="circle" />,
            }),
          },
          {
            title: 'CHALLENGES',
            Component: isChallengeThreadSelected
              ? ChallengeMessageThread
              : ChallengesThreadsList,
            ...(unreadChallenge > 0 && {
              ExtraTitle: () => <Icon name="circle" />,
            }),
          },
        ]}
      />
    </div>
  );
}

Chat.propTypes = {
  fetchThreads: PropTypes.func,
  open: PropTypes.bool,
  isThreadSelected: PropTypes.bool,
  currentTab: PropTypes.oneOfType([PropTypes.number, PropTypes.oneOf([null])]),
  isGroupThreadSelected: PropTypes.bool,
  unreadSingle: PropTypes.number,
  unreadGroup: PropTypes.number,
  isChallengeThreadSelected: PropTypes.bool,
  fetchGroupsThreads: PropTypes.func,
  unreadChallenge: PropTypes.number,
  onChangeTab: PropTypes.func,
  fetchChallengesThreads: PropTypes.func,
  fetchJoinableGroupsThreads: PropTypes.func,
};

function mapStateToProps(state) {
  return {
    isThreadSelected: !!getSelectedThread(state),
    isGroupThreadSelected: !!getSelectedGroupThread(state),
    isChallengeThreadSelected: !!getSelectedChallengeThread(state),
    unreadSingle: getChatUnreadCount(state),
    unreadGroup: getAllGroupsUnreadCount(state),
    unreadChallenge: getAllChallengesUnreadCount(state),
  };
}

export default connect(mapStateToProps, {
  fetchThreads: chatActions.fetchThreads,
  fetchGroupsThreads: groupChatActions.fetchGroupsThreads,
  fetchJoinableGroupsThreads: groupChatActions.fetchJoinableGroupsThreads,
  fetchChallengesThreads: fetchChallengesThreadsAction,
})(Chat);
