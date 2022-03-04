import React, { Component } from 'react';
import cx from 'classnames';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { withRouter } from 'react-router';
import withSizes from 'react-sizes';
import SidebarService from '../../Services/SideBarService';
import Chat from '../Sidebar/Chat';
import Notifications from '../Sidebar/Notifications';
import SideBarIcon from '../Sidebar/SidebarIcon';
import * as chatActions from '../../Actions/action_chat';
import { getChatUnreadCount, getSelectedThreadId } from '../../selectors/chat';
import { getPathname } from '../../selectors/router';
import * as groupChatActions from '../../Actions/action_group_chat';
import * as challengeChatActions from '../../Actions/actions_challenges_chat';
import {
  getAllGroupsUnreadCount,
  getSelectedGroupThreadId,
} from '../../selectors/groupChat';
import {
  getSelectedChallengeThreadId,
  getAllChallengesUnreadCount,
} from '../../selectors/challengesChat';
import Invites from '../Sidebar/Invites';

class SideBar extends Component {
  updateTimer = null;

  constructor(props) {
    super(props);
    this.state = {
      mode: undefined,
      currentTab: 0,
      updateFrequency: 30000,
      updates: {
        notifications: 0,
        requests: {
          chat: 0,
          group: 0,
          challenge: 0,
        },
      },
    };

    this.requestInProgress = false;

    this.openSideBar = this.openSideBar.bind(this);
    const isIOs =
      !!window.navigator.platform &&
      /iPad|iPhone|iPod/.test(navigator.platform);
    if (isIOs) {
      document.querySelector('html').className = 'ios';
      document.querySelector('html').style.overflowY = 'scroll';
    }
  }

  UNSAFE_componentWillMount() {
    const { updateFrequency } = this.state;
    this.checkUpdates();
    this.updateTimer = setInterval(
      this.checkUpdates.bind(this),
      updateFrequency
    );
  }

  componentDidMount() {
    const {
      fetchThreads,
      fetchGroupsThreads,
      fetchChallengesThreads,
    } = this.props;
    fetchThreads();
    fetchGroupsThreads({ usePagination: false });
    fetchChallengesThreads({ usePagination: false });
  }

  UNSAFE_componentWillReceiveProps = (nextProps, _nextContext) => {
    const { mode, currentTab } = this.state;
    const {
      selectedGroupThread,
      selectedBuddyThread,
      selectedChallengeThread,
      selectBuddyThread,
      selectGroupThread,
      selectChallengeThread,
      pathname,
      isMobile,
    } = this.props;
    const openForGroupThread =
      !selectedGroupThread && !!nextProps.selectedGroupThread;
    const openForBuddyThread =
      !selectedBuddyThread && !!nextProps.selectedBuddyThread;
    const openForChallengeThread =
      !selectedChallengeThread && !!nextProps.selectedChallengeThread;
    const isChatOpen =
      openForGroupThread || openForBuddyThread || openForChallengeThread;
    if (selectedGroupThread && !nextProps.selectedGroupThread && currentTab) {
      this.setState({ currentTab: 0 });
    } else if (isChatOpen) {
      const newCurrentTab = (() => {
        if (openForChallengeThread) return 2;
        if (openForGroupThread) return 1;
        return 0;
      })();
      this.setState({ mode: 'chat', currentTab: newCurrentTab });
    } else if (nextProps.openBuddyChat) {
      this.setState({ mode: 'chat' });
    } else if (nextProps.closeSidebar) {
      this.setState({ mode: undefined });
      nextProps.closeSidebarFunction(true);
    }
    const diffPath = nextProps.pathname !== pathname;
    if (diffPath && isMobile && !!mode) {
      this.setState({ mode: undefined });
      selectBuddyThread({ threadId: null });
      selectGroupThread(null);
      selectChallengeThread(null);
    }
    /* const { pathname } = this.props;
    if (pathname && pathname !== nextProps.pathname && mode && !isChatOpen) {
      this.setState({ mode: undefined });
      // selectGroupThread(null);
      // selectBuddyThread({ threadId: null });
    } */
  };

  shouldComponentUpdate(nextProps, nextState, _nextContext) {
    const { mode, updates, currentTab } = this.state;
    const { openBuddyChat, unreadMessagesCount } = this.props;
    return (
      updates.notifications !== nextState.updates.notifications ||
      updates.requests.chat !== nextState.updates.requests.chat ||
      updates.requests.group !== nextState.updates.requests.group ||
      updates.requests.challenge !== nextState.updates.requests.challenge ||
      mode !== nextState.mode ||
      nextProps.openBuddyChat !== openBuddyChat ||
      nextProps.unreadMessagesCount !== unreadMessagesCount ||
      nextState.currentTab !== currentTab
    );
  }

  componentWillUnmount() {
    clearInterval(this.updateTimer);
  }

  openChatWithBuddy = (buddyRequestId) => {
    this.setState({ mode: 'chat', openBuddyChat: buddyRequestId });
  };

  checkUpdates() {
    const { updateUser, history } = this.props;
    if (!this.requestInProgress) {
      this.requestInProgress = true;
      SidebarService.checkNew()
        .then((data) => {
          this.requestInProgress = false;
          this.setState({ updates: data });
        })
        .catch((data) => {
          this.requestInProgress = false;
          if (
            Object.prototype.hasOwnProperty.call(data, 'detail') &&
            data.detail.indexOf('Invalid token header') > -1
          ) {
            updateUser();
            history.push('/login');
          } else {
            console.error(data);
          }
        });
    }
  }

  openSideBar(mode) {
    const {
      selectedGroupThread,
      selectGroupThread,
      selectedChallengeThread,
      selectChallengeThread,
      selectedBuddyThread,
      selectBuddyThread,
    } = this.props;
    const updateFrequency = mode ? 2000 : 5000;
    this.setState({
      mode,
      updateFrequency,
      openBuddyChat: null,
      currentTab: 0,
    });
    if (mode !== 'chat' && selectedGroupThread) selectGroupThread(null);
    if (mode !== 'chat' && selectedBuddyThread)
      selectBuddyThread({ threadId: null });
    if (mode !== 'chat' && selectedChallengeThread)
      selectChallengeThread({ challengeId: null });
    clearInterval(this.updateTimer);
    this.updateTimer = setInterval(
      this.checkUpdates.bind(this),
      updateFrequency
    );
  }

  render() {
    const {
      mode,
      updates,
      currentTab,
      updateFrequency,
      openBuddyChat: openBuddyChatState,
    } = this.state;
    const {
      user,
      closeSidebarFunction,
      updateUser,
      openBuddyChat: openBuddyChatProps,
      unreadMessagesCount,
    } = this.props;
    const {
      notifications: notificationsCount,
      notification_count: unReadNotificationsCount,
      requests: {
        chat: buddyRequestsCount,
        group: groupsRequestsCount,
        challenge: challengesRequestsCount,
      },
    } = updates;
    return (
      <React.Fragment>
        <div id="sidebar">
          <div className={cx('icons', { open: mode })}>
            <SideBarIcon
              openSideBar={this.openSideBar}
              mode="chat"
              activeMode={mode}
              icon="comment"
              divider
              isNew={unreadMessagesCount > 0}
              count={unreadMessagesCount}
            />
            <SideBarIcon
              openSideBar={this.openSideBar}
              mode="notifications"
              activeMode={mode}
              icon="dot circle"
              divider
              isNew={notificationsCount > 0}
              count={notificationsCount}
            />
            <SideBarIcon
              openSideBar={this.openSideBar}
              mode="invites"
              activeMode={mode}
              icon="user plus"
              isNew={
                buddyRequestsCount > 0 ||
                groupsRequestsCount > 0 ||
                challengesRequestsCount > 0
              }
              count={
                buddyRequestsCount +
                groupsRequestsCount +
                challengesRequestsCount
              }
            />
          </div>
          {mode && (
            <div className="sidebar-body">
              {mode === 'chat' && (
                <Chat
                  open
                  currentTab={currentTab}
                  user={user}
                  onChangeTab={(tab) => this.setState({ currentTab: tab })}
                  openBuddyChat={openBuddyChatState || openBuddyChatProps}
                  openChatWith={this.openChatWithBuddy}
                />
              )}
              {mode === 'notifications' && (
                <Notifications
                  open
                  user={user}
                  new={notificationsCount > 0}
                  updateFrequency={updateFrequency}
                  unReadNotificationsCount={unReadNotificationsCount}
                />
              )}
              {mode === 'invites' && (
                <Invites
                  open
                  user={user}
                  newBuddiesCount={buddyRequestsCount}
                  newChallengesCount={challengesRequestsCount}
                  newGroupsCount={groupsRequestsCount}
                  // Some extra delay to avoid fetching twice on new requests
                  updateFrequency={updateFrequency + 2000}
                  closeSidebarFunction={closeSidebarFunction}
                  openChatWith={this.openChatWithBuddy}
                  updateUser={updateUser}
                />
              )}
            </div>
          )}
        </div>
      </React.Fragment>
    );
  }
}

SideBar.propTypes = {
  fetchThreads: PropTypes.func,
  fetchGroupsThreads: PropTypes.func,
  history: PropTypes.shape(),
  openBuddyChat: PropTypes.bool,
  updateUser: PropTypes.func,
  selectGroupThread: PropTypes.func,
  selectBuddyThread: PropTypes.func,
  user: PropTypes.shape(),
  closeSidebarFunction: PropTypes.func,
  closeSidebar: PropTypes.bool,
  selectedGroupThread: PropTypes.oneOfType([
    PropTypes.number,
    PropTypes.oneOf([null]),
  ]),
  selectedBuddyThread: PropTypes.oneOfType([
    PropTypes.number,
    PropTypes.oneOf([null]),
  ]),
  selectedChallengeThread: PropTypes.oneOfType([
    PropTypes.number,
    PropTypes.oneOf([null]),
  ]),
  unreadMessagesCount: PropTypes.number,
  fetchChallengesThreads: PropTypes.func,
  isMobile: PropTypes.bool,
  selectChallengeThread: PropTypes.func,
  pathname: PropTypes.string,
};

function mapStateToProps(state) {
  const unreadSingle = getChatUnreadCount(state);
  const unreadChallenge = getAllChallengesUnreadCount(state);
  const unreadGroup = getAllGroupsUnreadCount(state);
  return {
    pathname: getPathname(state),
    unreadMessagesCount: unreadSingle + unreadGroup + unreadChallenge,
    selectedGroupThread: getSelectedGroupThreadId(state),
    selectedBuddyThread: getSelectedThreadId(state),
    selectedChallengeThread: getSelectedChallengeThreadId(state),
  };
}

export default compose(
  connect(mapStateToProps, {
    fetchThreads: chatActions.fetchThreads,
    selectBuddyThread: chatActions.selectThread,
    fetchGroupsThreads: groupChatActions.fetchGroupsThreads,
    selectGroupThread: groupChatActions.selectThread,
    fetchChallengesThreads: challengeChatActions.fetchChallengesThreads,
    selectChallengeThread: challengeChatActions.selectThread,
  }),
  withRouter,
  withSizes(({ width }) => ({ isMobile: width < 768 }))
)(SideBar);
