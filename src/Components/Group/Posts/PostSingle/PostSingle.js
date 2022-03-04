import React from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import { Divider, Dropdown, Icon } from 'semantic-ui-react';
import './PostSingle.scss';
import moment from 'moment';
import ReactHtmlParser from 'react-html-parser';
import PostResponses from '../PostResponses';

const PostSingle = ({
  setCurrentView,
  post,
  groupId,
  userId,
  getMoreResponses,
  onDeletePost,
  onPinPost,
  canPin,
}) => (
  <div className="PostSingle">
    <div
      className="PostSingle__back"
      onClick={() => setCurrentView('postList')}
    >
      <Icon name="chevron left" />
      Back to all posts
    </div>
    <div className="PostSingle__header">
      <div className="title">
        <span>{post.title}</span>
        <div className="meta">
          by{' '}
          <Link to={`/profile/${post.user.id}`} className="author">
            {post.user.name}
          </Link>{' '}
          - {moment(post.created_at).format('MMM D')}
        </div>
      </div>
      <div className="PostSingle__header-links">
        {post.user.id === userId && (
          <span
            className="PostSingle__header-link"
            onClick={() => {
              setCurrentView('postNew');
            }}
          >
            Edit post
          </span>
        )}
        {post.user.id === userId ? (
          <Dropdown
            text="..."
            icon={null}
            className="Post__dropdown"
            direction="left"
          >
            <Dropdown.Menu className="Post__dropdown-menu PostSingle__dropdown-menu">
              {/* <Dropdown.Item text="Highlight" /> */}
              {canPin && (
                <Dropdown.Item
                  text={post.featured ? 'Unpin It' : 'Pin To Top'}
                  onClick={() => {
                    onPinPost(post.id);
                  }}
                />
              )}
              <Dropdown.Item
                text="Delete"
                onClick={() => {
                  onDeletePost(post.id);
                  setCurrentView('postList');
                }}
              />
            </Dropdown.Menu>
          </Dropdown>
        ) : (
          canPin && (
            <Dropdown
              text="..."
              icon={null}
              className="Post__dropdown"
              direction="left"
            >
              <Dropdown.Menu className="Post__dropdown-menu PostSingle__dropdown-menu">
                <Dropdown.Item
                  text={post.featured ? 'Unpin It' : 'Pin To Top'}
                  onClick={() => {
                    onPinPost(post.id);
                  }}
                />
              </Dropdown.Menu>
            </Dropdown>
          )
        )}
      </div>
    </div>

    <div className="PostSingle__content">{ReactHtmlParser(post.text)}</div>
    <Divider />
    <PostResponses
      postId={post.id}
      groupId={groupId}
      userId={userId}
      getMoreResponses={getMoreResponses}
      initialResponseCount={post.responses || 0}
    />
  </div>
);

PostSingle.propTypes = {
  setCurrentView: PropTypes.func,
};

export default PostSingle;
