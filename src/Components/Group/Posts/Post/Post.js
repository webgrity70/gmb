/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import $clamp from 'clamp-js';
import truncateHtml from 'truncate-html';
import cx from 'classnames';
import PropTypes from 'prop-types';
import { Card, Dropdown, Icon, Button } from 'semantic-ui-react';
import moment from 'moment';
import { useSelector } from 'react-redux';
import { usePostService } from '../../../../Services/GroupsService';
import './Post.scss';

const Post = ({
  post,
  handleClick,
  handleEditClick,
  handleUnpublishClick,
  handleDelete,
  handlePin,
  groupId,
  isOwner,
  userId,
  canPin,
}) => {
  const [responseCount, setResponseCount] = useState(post.responses || 0);
  const updatedPost = useSelector((state) => state.group.updatedPost);
  const { getPostDetails } = usePostService();

  const mediaRemoved = post.text.replace(
    /<figure [^>]+>(.*?)<\/figure>/g,
    '<p>[media]</p>'
  );
  const markdown = truncateHtml(mediaRemoved, 300);
  useEffect(() => {
    if (updatedPost === post.id) {
      getPostDetails({ groupId, postId: post.id }).then((details) =>
        setResponseCount(details.responses)
      );
    }
  }, [groupId, post.id]);

  useEffect(() => {
    const modl = document.getElementById(`post-${post.id}-content`);
    if (modl) $clamp(modl, { clamp: 2 });
  }, [post]);

  return (
    <div
      className={cx(
        'Post__card',
        !post.read && 'Post__card-unread',
        post.featured && 'Post__pinnedPost'
      )}
      onClick={() => handleClick()}
    >
      <Card.Content>
        <div className="Post__header">
          <span className="Post__title">
            <span
              className="Post__title-text"
              style={{ maxWidth: !post.is_draft ? 400 : undefined }}
            >
              {post.title}
            </span>{' '}
            {post.is_draft && (
              <span className="Post__title-draft"> - Draft</span>
            )}
          </span>
          <div className="Post__meta">
            by{' '}
            <Link to={`/profile/${post.user.id}`} className="author">
              {post.user.name}
            </Link>{' '}
            - <span>{moment(post.created_at).format('MMM D')}</span>&nbsp;&nbsp;
            {post.featured && <Icon name={`pin`} className="pinButton" />}
            {isOwner ? (
              <Dropdown
                text="..."
                icon={null}
                className="Post__dropdown"
                basic
                direction="left"
              >
                <Dropdown.Menu className="Post__dropdown-menu PostSingle__dropdown-menu">
                  <Dropdown.Item
                    text="Edit"
                    onClick={() => handleEditClick()}
                  />
                  {!post.is_draft && (
                    <Dropdown.Item
                      text="Unpublish"
                      onClick={handleUnpublishClick}
                    />
                  )}
                  <Dropdown.Item text="Delete" onClick={() => handleDelete()} />
                  {canPin && (
                    <Dropdown.Item
                      text={post.featured ? 'Unpin It' : 'Pin To Top'}
                      onClick={handlePin}
                    />
                  )}
                  {/* {!post.is_draft && ( */}
                  {/*  <> */}
                  {/*    <Dropdown.Item text="Stop Following" /> */}
                  {/*    <Dropdown.Item text="Direct Link" /> */}
                  {/*  </> */}
                  {/* )} */}
                </Dropdown.Menu>
              </Dropdown>
            ) : (
              canPin && (
                <Dropdown
                  text="..."
                  icon={null}
                  className="Post__dropdown"
                  basic
                  direction="left"
                >
                  <Dropdown.Menu className="Post__dropdown-menu PostSingle__dropdown-menu">
                    <Dropdown.Item
                      text={post.featured ? 'Unpin It' : 'Pin To Top'}
                      onClick={handlePin}
                    />
                  </Dropdown.Menu>
                </Dropdown>
              )
            )}
          </div>
        </div>
        <Card.Description
          id={`post-${post.id}-content`}
          content={<div dangerouslySetInnerHTML={{ __html: markdown }} />}
        />
        {!post.is_draft && (
          <Card.Meta
            content={
              <span className="Post__responses">
                {responseCount} Response{responseCount === 1 ? '' : 's'}
              </span>
            }
          />
        )}
      </Card.Content>
    </div>
  );
};

Post.propTypes = {
  handleUnpublishClick: PropTypes.func,
  handleClick: PropTypes.func,
  handleEditClick: PropTypes.func,
  handleDelete: PropTypes.func,
  handlePin: PropTypes.func,
  groupId: PropTypes.number,
  isOwner: PropTypes.bool,
  canPin: PropTypes.bool,
  userId: PropTypes.number,
  post: PropTypes.shape({
    created_at: PropTypes.string,
    featured: PropTypes.bool,
    text: PropTypes.string,
    id: PropTypes.number,
    title: PropTypes.string,
    is_draft: PropTypes.bool,
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
  }),
};

export default Post;
