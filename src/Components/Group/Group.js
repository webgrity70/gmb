import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import cx from 'classnames';
import { Container, Icon } from 'semantic-ui-react';
import Header from './Header';
import TabsContainer from '../Elements/TabsContainer/TabsContainer';
import Paragraph from './Paragraph';
import * as groupChatActions from '../../Actions/action_group_chat';
import {
  createAnnouncement as createAnnouncementAction,
  fetchAnnouncements as fetchAnnouncementsAction,
  createPost as createPostAction,
  fetchPosts as fetchPostsAction,
  editPost as editPostAction,
  deletePost as deletePostAction,
  joinGroup as joinGroupAction,
  pinPost as pinPostAction,
} from '../../Actions/actions_groups';
import { getMyProfileId } from '../../selectors/profile';
import {
  postingAnnouncement,
  getAnnouncementsNextPage,
  getCurrentGroupAnnouncements,
  getCurrentGroupPosts,
} from '../../selectors/groups';
import Members from './Members';
import Posts from './Posts';
import PlanChallenges from './PlanChallenges';
import { usePostService } from '../../Services/GroupsService';
import './Group.scss';

const Group = ({
  categories,
  countryISO,
  description,
  groupManager,
  hasPermission,
  icon,
  isPrivate,
  languages,
  location,
  name,
  score,
  announcements,
  id,
  createAnnouncement,
  pendingRequest,
  type,
  isAdmin,
  url,
  official,
  subTitle,
  fetchAnnouncements,
  myId,
  posting,
  joinGroup,
  nextPage,
  posts,
  fetchPosts,
  createPost,
  editPost,
  deletePost,
  pinPost,
  currentPostId,
  goToGroupPage,
}) => {
  // Fetch chat history and subscribe to socket updates
  /* useEffect(() => {
    if (hasPermission) {
      initThread(id);
      return () => {
      disconnectSocket({ groupId: id });
      };
    }
    return undefined;
  }, [id, initThread, hasPermission]);
  */
  const headerProps = {
    categories,
    countryISO,
    id,
    groupManager,
    pendingRequest,
    hasPermission,
    icon,
    isPrivate,
    languages,
    type,
    location,
    subTitle,
    url,
    official,
    name,
    score,
  };
  const { getDraftPosts } = usePostService();

  useEffect(() => {
    getDraftPosts({ groupId: id });
  }, [id]);

  const onJoin = React.useCallback(() => {
    joinGroup(id, isPrivate);
  }, [id, isPrivate]);

  const shouldRenderContainer = true || hasPermission || description;
  const panes = [
    {
      title: 'Posts',
      titleIcon: <Icon name="bullhorn" />,
      Component: Posts,
      props: {
        groupId: id,
        posts,
        fetchPosts,
        hasPermission,
        createPost,
        onJoin,
        editPost,
        deletePost,
        pinPost,
        canPin: isAdmin,
        myId,
        currentPostId,
        goToGroupPage,
      },
    },
    {
      title: 'Plans',
      Component: PlanChallenges,
      titleIcon: <Icon name="flag" />,
      props: {
        groupId: id,
        isAdmin,
        isPrivate,
        hasPermission,
        onJoin,
      },
    },
    /* {
      title: 'Announcements',
      titleIcon: <Icon name="bullhorn" />,
      Component: Announcements,
      props: {
        announcements,
        groupId: id,
        createAnnouncement,
        canEdit: isAdmin,
        fetchAnnouncements,
        myId,
        posting,
        nextPage,
      },
    },
    {
      title: 'Plan Templates',
      titleIcon: <Icon name="flag" />,
      Component: ComingSoon, // isAdmin ? PlansChallenges : ComingSoon,
      props: { groupId: id, isAdmin },
    }, */
  ];
  return (
    <div className="group">
      <Header {...headerProps} />
      {shouldRenderContainer && (
        <div className="bg grey">
          <Container className={cx({ 'not-permission': !hasPermission })}>
            <TabsContainer panes={panes} />
            {description && (
              <div className="row">
                <Paragraph
                  hasPermission={hasPermission}
                  text={description}
                  title={`About ${name}`}
                />
              </div>
            )}
          </Container>
        </div>
      )}
      <Members
        hasPermission={hasPermission}
        id={id}
        haveDescription={!!description}
        isAdmin={isAdmin}
        isPrivate={isPrivate}
      />
    </div>
  );
};

const mapStateToProps = (state) => ({
  announcements: getCurrentGroupAnnouncements(state),
  posts: getCurrentGroupPosts(state),
  myId: getMyProfileId(state),
  posting: postingAnnouncement(state),
  nextPage: getAnnouncementsNextPage(state),
});

const mapDispatchToProps = {
  initThread: groupChatActions.initThread,
  disconnectSocket: groupChatActions.disconnectSocket,
  createAnnouncement: createAnnouncementAction,
  fetchAnnouncements: fetchAnnouncementsAction,
  createPost: createPostAction,
  editPost: editPostAction,
  joinGroup: joinGroupAction,
  deletePost: deletePostAction,
  pinPost: pinPostAction,
  fetchPosts: fetchPostsAction,
};

Group.propTypes = {
  announcements: PropTypes.arrayOf(
    PropTypes.shape({
      created_at: PropTypes.string,
      text: PropTypes.string,
      user: PropTypes.shape({
        id: PropTypes.number,
        name: PropTypes.string,
        avatar: PropTypes.shape({
          body: PropTypes.object,
          hair: PropTypes.object,
          mouth: PropTypes.object,
          eyes: PropTypes.object,
          body_color: PropTypes.string,
          hair_color: PropTypes.string,
        }),
      }),
    })
  ),
  fetchAnnouncements: PropTypes.func,
  posts: PropTypes.arrayOf(
    PropTypes.shape({
      created_at: PropTypes.string,
      text: PropTypes.string,
      user: PropTypes.shape({
        id: PropTypes.number,
        name: PropTypes.string,
        avatar: PropTypes.shape({
          body: PropTypes.object,
          hair: PropTypes.object,
          mouth: PropTypes.object,
          eyes: PropTypes.object,
          body_color: PropTypes.string,
          hair_color: PropTypes.string,
        }),
      }),
    })
  ),
  fetchPosts: PropTypes.func,
  posting: PropTypes.bool,
  nextPage: PropTypes.oneOfType([PropTypes.number, PropTypes.oneOf([null])]),
  myId: PropTypes.number,
  createAnnouncement: PropTypes.func,
  createPost: PropTypes.func,
  editPost: PropTypes.func,
  deletePost: PropTypes.func,
  pinPost: PropTypes.func,
  categories: PropTypes.arrayOf(PropTypes.shape),
  countryISO: PropTypes.string,
  createdAt: PropTypes.string,
  groupManager: PropTypes.oneOfType([
    PropTypes.object,
    PropTypes.oneOf([null]),
  ]),
  url: PropTypes.oneOfType([PropTypes.object, PropTypes.oneOf([null])]),
  hasPermission: PropTypes.bool,
  isAdmin: PropTypes.bool,
  icon: PropTypes.string,
  isPrivate: PropTypes.bool,
  languages: PropTypes.arrayOf(PropTypes.string),
  location: PropTypes.string,
  name: PropTypes.string,
  description: PropTypes.string,
  descriptionTitle: PropTypes.string,
  welcomePost: PropTypes.string,
  maxScore: PropTypes.number,
  minScore: PropTypes.number,
  score: PropTypes.number,
  id: PropTypes.number,
  pendingRequest: PropTypes.bool,
  initThread: PropTypes.func.isRequired,
  disconnectSocket: PropTypes.func.isRequired,
  official: PropTypes.bool,
  subTitle: PropTypes.string,
  adminsCount: PropTypes.number,
  type: PropTypes.string,
};

export default connect(mapStateToProps, mapDispatchToProps)(Group);
