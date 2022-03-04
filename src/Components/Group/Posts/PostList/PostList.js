/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */
import { Button, Card, Checkbox, Icon } from 'semantic-ui-react';
import React, { useState } from 'react';
import PropTypes from 'prop-types';
import InfiniteScroll from 'react-infinite-scroller';
import { useSelector, useDispatch } from 'react-redux';
import Post from '../Post';
import Loading from '../../../Loading/Loading';
import DeletePost from '../DeleteModal';
import { editPost, fetchPosts } from '../../../../Actions/actions_groups';
import './PostList.scss';
import { getPostsLoading } from '../../../../selectors/requests';

const PostList = ({
  setCurrentView,
  setCurrentPost,
  onDeletePost,
  onPinPost,
  onJoin,
  groupId,
  posts,
  userId,
  getPosts,
  setChecked,
  checked,
  hasPermission,
  order,
  setOrder,
  canPin,
}) => {
  const dispatch = useDispatch();
  const nextPage = useSelector((state) => state.pagination.groupPosts.next);
  const loading = useSelector(getPostsLoading);
  const draftPosts = useSelector((state) => state.group.draftPosts);
  const [openDelete, setOpenDelete] = useState(false);
  const [selectedPost, setSelectedPost] = useState(null);

  function getMore() {
    dispatch(fetchPosts(groupId, nextPage, checked ? userId : undefined));
  }
  function onUnpublish(post) {
    dispatch(
      editPost({
        user: post.user.id,
        group: groupId,
        postId: post.id,
        title: post.title,
        text: post.text,
        isDraft: true,
      })
    );
    setOpenDelete(false);
  }
  return (
    <div className="PostList">
      {!hasPermission && (
        <div className="PostList__not-member">
          <span onClick={onJoin}>Join</span>
          <span>to see Posts</span>
        </div>
      )}
      <div className="PostList__tabs">
        <Button
          color="orange"
          onClick={() => {
            if (hasPermission) {
              setCurrentPost(null);
              setCurrentView('postNew');
            }
          }}
        >
          <Icon name="plus" />
          New Post
        </Button>
        <span
          className={`PostList__tab PostList__tab--${
            order === 'newest' ? 'orange' : 'grey'
          }`}
          onClick={() => {
            if (hasPermission) setOrder('newest');
          }}
        >
          Newest
        </span>
        <span
          className={`PostList__tab PostList__tab--${
            order === 'responses' ? 'orange' : 'grey'
          }`}
          onClick={() => {
            setOrder('responses');
          }}
        >
          Most Responses
        </span>
        <Checkbox
          label="Show my posts only"
          value={checked}
          onChange={(event, { checked }) => {
            if (hasPermission) {
              setChecked(checked);
              getPosts(checked);
            }
          }}
        />
      </div>
      <div className="PostList__divider" />
      <div className="PostList__content">
        <Card.Group className="PostList__cards" fluid>
          {posts.length === 0 && draftPosts.length === 0 ? (
            <div className="PostList__empty">
              {hasPermission && (
                <h2>
                  No new posts.{' '}
                  <span onClick={() => setCurrentView('postNew')}>
                    Create one!
                  </span>
                </h2>
              )}
            </div>
          ) : (
            <InfiniteScroll
              pageStart={0}
              hasMore={!!nextPage && !loading}
              loadMore={() => !loading && getMore()}
              loader={<Loading />}
              threshold={100}
              useWindow={false}
              getScrollParent={() =>
                document.getElementsByClassName('TabsContainer__body')[0]
              }
            >
              {[...draftPosts, ...posts].map((post) => (
                <Post
                  key={post.id}
                  post={post}
                  handleClick={() => {
                    if (hasPermission) {
                      setCurrentPost(post);
                      setCurrentView(post.is_draft ? 'postNew' : 'postSingle');
                    }
                  }}
                  handleUnpublishClick={() => onUnpublish(post)}
                  handleEditClick={() => {
                    if (hasPermission) {
                      setCurrentPost(post);
                      setCurrentView('postNew');
                    }
                  }}
                  handleDelete={() => {
                    if (hasPermission) {
                      setSelectedPost(post);
                      setOpenDelete(true);
                      // onDeletePost(post.id, post.is_draft);
                    }
                  }}
                  handlePin={() => {
                    if (hasPermission) {
                      onPinPost(post.id);
                    }
                  }}
                  groupId={groupId}
                  canPin={canPin}
                  isOwner={post.user.id === userId}
                  userId={userId}
                />
              ))}
            </InfiniteScroll>
          )}
        </Card.Group>
        {/* <PostWelcome groupId={groupId} userId={userId} /> */}
      </div>
      <DeletePost
        open={openDelete}
        onDelete={() => [
          onDeletePost(selectedPost.id, selectedPost.is_draft),
          setOpenDelete(false),
        ]}
        onUnpublish={() => onUnpublish(selectedPost)}
        onClose={() => setOpenDelete(false)}
      />
    </div>
  );
};

PostList.propTypes = {
  getMore: PropTypes.func,
  posts: PropTypes.arrayOf(
    PropTypes.shape({
      created_at: PropTypes.string,
      title: PropTypes.string,
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
};

export default React.memo(PostList);
