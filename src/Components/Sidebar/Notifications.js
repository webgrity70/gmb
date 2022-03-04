import React, { useEffect, useState } from 'react';
import InfiniteScroll from 'react-infinite-scroller';
import moment from 'moment';
import axios from 'axios';
import { Icon } from 'semantic-ui-react';
import { Link } from 'react-router-dom';
import sidebar_service from '../../Services/SideBarService';
import Loading from '../Loading';
import Avatar from '../Elements/Avatar';
import TabsContainer from '../Elements/TabsContainer/TabsContainer';
import defaultChallenge from '../../Assets/images/challenge.png';

const formatLinkInMessage = (notification) => {
  const { message, ref_name, link } = notification;

  let formatted = <span>{message}</span>;

  if (link && ref_name) {
    if (message.indexOf(ref_name) > -1) {
      const splitMessage = message.split(ref_name);
      const message1 = splitMessage[0];
      const message2 = splitMessage[1];

      let trailing = '';
      if (splitMessage.length > 2) {
        trailing = `${ref_name}${splitMessage[2]}`;
      }

      formatted = (
        <span>
          {message1}
          <Link to={link}>{ref_name}</Link>
          {message2}
          {trailing}
        </span>
      );
    }
  }

  return formatted;
};

function Notification(props) {
  const { notification, user } = props;
  return (
    <React.Fragment>
      <div className="notification">
        <div>
          {isGroupNotification() ? (
            <div className="avatar">
              <img
                style={{
                  width: '100%',
                  height: '100%',
                }}
                alt={notification.group.name}
                src={notification.group.icon}
              />
            </div>
          ) : isChallengeNotification() ? (
            <div className="avatar">
              <img
                style={{
                  width: '100%',
                  height: '100%',
                }}
                alt={notification.challenge.name}
                src={notification.challenge.icon || defaultChallenge}
              />
            </div>
          ) : (
            <div className="avatar">
              <Avatar avatar={notification.user.avatar} />
            </div>
          )}
          <span className="name">
            {isGroupNotification() ? (
              <Link to={`/groups/${notification.group.id}`}>
                {notification.group.name}
              </Link>
            ) : isChallengeNotification() ? (
              <Link to={`/challenges/${notification.challenge.id}`}>
                {notification.challenge.name}
              </Link>
            ) : (
              <Link to={`/profile/${notification.user.pk}`}>
                {notification.user.pk === user.pk
                  ? 'You'
                  : notification.user.name}
              </Link>
            )}
          </span>
        </div>
        <div className="notification-message">
          {isGroupNotification() || isChallengeNotification() ? (
            notification.user.pk === user.pk ? (
              'You '
            ) : (
              <Link to={`/profile/${notification.user.pk}`}>
                {notification.user.name}{' '}
              </Link>
            )
          ) : null}
          {formatLinkInMessage(notification)}
        </div>
        <div className="notification-time">
          {moment(notification.created_at).fromNow()}
        </div>
      </div>
    </React.Fragment>
  );

  function isGroupNotification() {
    return notification.notification_type === 'group' && notification.group;
  }

  function isChallengeNotification() {
    return (
      notification.notification_type === 'challenge' && notification.challenge
    );
  }
}

const NotificationContent = (props) => {
  return (
    <div className="sidebar-content">
      <div className="notifications">
        {props.notifications.length === 0 && (
          <p className="text-center">
            {props.loadingNotifications
              ? 'Loading...'
              : 'There are no notifications.'}
          </p>
        )}
        <InfiniteScroll
          pageStart={0}
          loadMore={props.loadMoreNotifications}
          hasMore={!!props.nextUrl}
          loader={<Loading key={1} />}
          threshold={400}
          useWindow={false}
        >
          {props.notifications.map((notification, i) => (
            <Notification
              key={i}
              notification={notification}
              user={props.user}
            />
          ))}
        </InfiniteScroll>
      </div>
    </div>
  );
};

const Notifications = (props) => {
  const [buddyNotifications, setBuddyNotifications] = useState([]);
  const [groupNotifications, setGroupNotifications] = useState([]);
  const [challengeNotifications, setChallengeNotifications] = useState([]);
  const [buddyNextUrl, setBuddyNextUrl] = useState(null);
  const [groupNextUrl, setGroupNextUrl] = useState(null);
  const [challengeNextUrl, setChallengeNextUrl] = useState(null);
  const [currentTab, setCurrentTab] = useState(0);
  const [buddyLoadingNotifications, setBuddyLoadingNotifications] = useState(
    false
  );
  const [groupLoadingNotifications, setGroupLoadingNotifications] = useState(
    false
  );
  const [
    challengeLoadingNotifications,
    setChallengeLoadingNotifications,
  ] = useState(false);

  let updateInterval = undefined;
  let firstLoad = true;

  const setupAutoRefresh = () => {
    updateInterval = setInterval(() => {
      if (props.new) getNotifications();
    }, props.updateFrequency);
  };

  useEffect(() => {
    if (!firstLoad) return;
    firstLoad = false;

    getNotifications();
    //setupAutoRefresh();

    return () => {
      clearInterval(updateInterval);
    };
  }, []);

  useEffect(() => {
    if (!firstLoad) return;
    firstLoad = false;

    getNotifications();
  }, [currentTab]);

  const getNotifications = () => {
    switch (currentTab) {
      case 0:
        getBuddyNotifications();
        break;
      case 1:
        getGroupNotifications();
        break;
      case 2:
        getChallengeNotifications();
        break;
    }
  };

  const getBuddyNotifications = () => {
    setBuddyLoadingNotifications(true);
    sidebar_service
      .getNotifications({ pageSize: 15, nType: 'buddy' })
      .then((data) => {
        setBuddyNotifications(data.results);
        setBuddyNextUrl(data.next);
        setBuddyLoadingNotifications(false);
      })
      .catch((data) => {
        console.error(data);
        setBuddyLoadingNotifications(false);
      });
  };

  const getGroupNotifications = () => {
    setGroupLoadingNotifications(true);
    sidebar_service
      .getNotifications({ pageSize: 15, nType: 'group' })
      .then((data) => {
        setGroupNotifications(data.results);
        setGroupNextUrl(data.next);
        setGroupLoadingNotifications(false);
      })
      .catch((data) => {
        console.error(data);
        setGroupLoadingNotifications(false);
      });
  };

  const getChallengeNotifications = () => {
    setChallengeLoadingNotifications(true);
    sidebar_service
      .getNotifications({ pageSize: 15, nType: 'challenge' })
      .then((data) => {
        setChallengeNotifications(data.results);
        setChallengeNextUrl(data.next);
        setChallengeLoadingNotifications(false);
      })
      .catch((data) => {
        console.error(data);
        setChallengeLoadingNotifications(false);
      });
  };

  const loadMoreBuddyNotifications = async () => {
    if (!buddyNextUrl || buddyLoadingNotifications) {
      return;
    }
    setBuddyLoadingNotifications(true);
    try {
      const res = await axios.get(buddyNextUrl, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('access_token')}`,
        },
      });

      setBuddyNotifications([...buddyNotifications, ...res.data.results]);
      setBuddyNextUrl(res.data.next);
      setBuddyLoadingNotifications(false);
    } catch (e) {
      console.log(e);
      setBuddyLoadingNotifications(false);
    }
  };

  const loadMoreGroupNotifications = async () => {
    if (!groupNextUrl || groupLoadingNotifications) {
      return;
    }
    setGroupLoadingNotifications(true);
    try {
      const res = await axios.get(groupNextUrl, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('access_token')}`,
        },
      });

      setGroupNotifications([...groupNotifications, ...res.data.results]);
      setGroupNextUrl(res.data.next);
      setGroupLoadingNotifications(false);
    } catch (e) {
      console.log(e);
      setGroupLoadingNotifications(false);
    }
  };

  const loadMoreChallengeNotifications = async () => {
    if (!challengeNextUrl || challengeLoadingNotifications) {
      return;
    }
    setChallengeLoadingNotifications(true);
    try {
      const res = await axios.get(challengeNextUrl, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('access_token')}`,
        },
      });

      setChallengeNotifications([
        ...challengeNotifications,
        ...res.data.results,
      ]);
      setChallengeNextUrl(res.data.next);
      setChallengeLoadingNotifications(false);
    } catch (e) {
      console.log(e);
      setChallengeLoadingNotifications(false);
    }
  };

  return !props.open ? (
    <React.Fragment />
  ) : (
    <div className="notifications-sidebar menu">
      <div className="sidebar-header">
        <h2>
          <Icon className="dot circle" /> Notifications
        </h2>
      </div>
      <TabsContainer
        panes={[
          {
            title: 'BUDDIES',
            Component: NotificationContent,
            props: {
              notifications: buddyNotifications,
              loadingNotifications: buddyLoadingNotifications,
              loadMoreNotifications: loadMoreBuddyNotifications,
              nextUrl: buddyNextUrl,
              user: props.user,
            },
            ...(props.unReadNotificationsCount.buddy > 0 && {
              ExtraTitle: () => <Icon name="circle" />,
            }),
          },
          {
            title: 'GROUPS',
            Component: NotificationContent,
            props: {
              notifications: groupNotifications,
              loadingNotifications: groupLoadingNotifications,
              loadMoreNotifications: loadMoreGroupNotifications,
              nextUrl: groupNextUrl,
              user: props.user,
            },
            ...(props.unReadNotificationsCount.group > 0 && {
              ExtraTitle: () => <Icon name="circle" />,
            }),
          },
          {
            title: 'CHALLENGES',
            Component: NotificationContent,
            props: {
              notifications: challengeNotifications,
              loadingNotifications: challengeLoadingNotifications,
              loadMoreNotifications: loadMoreChallengeNotifications,
              nextUrl: challengeNextUrl,
              user: props.user,
            },
            ...(props.unReadNotificationsCount.challenge > 0 && {
              ExtraTitle: () => <Icon name="circle" />,
            }),
          },
        ]}
        onChange={(tab) => setCurrentTab(tab)}
        currentTab={currentTab}
      />
    </div>
  );
};

export default Notifications;
