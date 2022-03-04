import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import PostSingle from './PostSingle';
import PostList from './PostList';
import PostNew from './PostNew';
import { resetPostsPagination } from '../../../Actions/actions_groups';
import { usePostService } from '../../../Services/GroupsService';
import './Posts.scss';

const Posts = ({
  groupId,
  posts,
  onJoin,
  fetchPosts,
  hasPermission,
  canPin,
  createPost,
  editPost,
  deletePost,
  pinPost,
  myId,
  currentPostId,
  goToGroupPage,
}) => {
  const [currentView, setCurrentView] = useState('postList');
  const dispatch = useDispatch();
  const [currentPost, setCurrentPost] = useState();
  const { getAllPostResponses } = usePostService();
  const [order, _setOrder] = useState('newest');
  const [checked, setChecked] = useState(false);
  const [linkedPostLoaded, setLinkedPostLoaded] = useState(false);

  function setOrder(newOrder) {
    if (order !== newOrder) {
      dispatch(resetPostsPagination());
      _setOrder(newOrder);
    }
  }
  const onCreatePost = (title, text, isDraft) => {
    createPost({
      user: myId,
      group: groupId,
      title,
      text,
      isDraft,
    });
    setCurrentPost(null);
  };

  const onEditPost = (title, text, isDraft) => {
    editPost({
      user: myId,
      group: groupId,
      postId: currentPost.id,
      title,
      text,
      isDraft,
    });
    setCurrentPost(null);
  };

  useEffect(() => {
    if (currentPost && !currentPost.is_draft) {
      getAllPostResponses({ groupId, postId: currentPost.id });
    }
  }, [currentPost, groupId]);

  useEffect(() => {
    getPosts(checked);
  }, [order]);

  useEffect(() => {
    if (currentPostId) {
      const post = posts.find((p) => p.id === Number(currentPostId));
      if (post) {
        setCurrentPost(post);
        setCurrentView('postSingle');
        setLinkedPostLoaded(true);
      }
    }
  }, [currentPostId, posts]);

  useEffect(() => {
    if (currentView === 'postList' && currentPostId && linkedPostLoaded) {
      goToGroupPage();
    }
  }, [currentView, currentPostId, linkedPostLoaded]);

  const onDeletePost = (postId, isDraft) => {
    deletePost({ postId, group: groupId, isDraft });
  };

  const onPinPost = (postId) => {
    pinPost({
      postId,
      groupId,
      checked: checked ? myId : undefined,
      order: order === 'responses',
    });
  };

  function getPosts(checked) {
    fetchPosts(
      groupId,
      undefined,
      checked ? myId : undefined,
      order === 'responses'
    );
  }

  function getMoreResponses(postId, nextPage) {
    getAllPostResponses({ groupId, postId, page: nextPage });
  }

  const views = {
    postList: (
      <PostList
        posts={posts}
        setCurrentView={(view) => setCurrentView(view)}
        setCurrentPost={(post) => setCurrentPost(post)}
        hasPermission={hasPermission}
        onDeletePost={onDeletePost}
        onPinPost={onPinPost}
        groupId={groupId}
        onJoin={onJoin}
        userId={myId}
        getPosts={getPosts}
        order={order}
        setOrder={setOrder}
        checked={checked}
        setChecked={setChecked}
        canPin={canPin}
      />
    ),
    postNew: (
      <PostNew
        setCurrentView={(view) => setCurrentView(view)}
        onCreatePost={onCreatePost}
        onEditPost={onEditPost}
        post={currentPost}
      />
    ),
    postSingle: (
      <PostSingle
        userId={myId}
        setCurrentView={(view) => setCurrentView(view)}
        post={currentPost}
        groupId={groupId}
        onDeletePost={onDeletePost}
        getMoreResponses={getMoreResponses}
        onPinPost={onPinPost}
        canPin={canPin}
      />
    ),
  };

  return views[currentView];
};

export default Posts;
