import React, { useEffect, useState } from 'react';
import { Card, Form, Icon } from 'semantic-ui-react';
import { useSelector } from 'react-redux';
import { truncate } from 'lodash';
import { usePostService } from '../../../../Services/GroupsService';

const PostWelcome = ({ groupId, userId }) => {
  const { stateWelcomePost, groupManager } = useSelector(
    (state) => state.group
  );
  const { createWelcomePost } = usePostService();
  const [isEditing, setIsEditing] = useState(false);
  const [welcomePost, setWelcomePost] = useState('');
  const [length, setLength] = useState(300);
  const [showAll, setShowAll] = useState(false);

  const handleSubmit = () => {
    createWelcomePost({
      groupId,
      welcome_post: welcomePost,
      user: userId,
    }).then(() => {
      setIsEditing(false);
    });
  };

  useEffect(() => {
    setWelcomePost(stateWelcomePost || '');
  }, [stateWelcomePost]);

  return (
    <div className="PostList__welcome">
      <Card raised>
        <Card.Content>
          <div className="Post__title">
            <span>Welcome</span>
            {groupManager && groupManager.id === userId && (
              <Icon
                name="pencil alternate"
                color="orange"
                size="large"
                onClick={() => setIsEditing(true)}
              />
            )}
          </div>
          {isEditing ? (
            <Form onSubmit={handleSubmit}>
              <Form.TextArea
                placeholder=""
                name="welcome"
                value={welcomePost}
                onChange={(e, { value }) => setWelcomePost(value)}
                rows={5}
              />
              <Form.Button
                content="Submit"
                size="small"
                floated="right"
                color="orange"
              />
            </Form>
          ) : (
            <Card.Description
              content={truncate(welcomePost, {
                length,
                separator: ' ',
              })}
            />
          )}
          {!isEditing &&
            welcomePost.length > 300 &&
            (!showAll ? (
              <Card.Meta
                className="more"
                content={
                  <span>
                    <u>see more</u>
                  </span>
                }
                onClick={() => {
                  setLength(welcomePost.length + 1);
                  setShowAll(true);
                }}
              />
            ) : (
              <Card.Meta
                className="more"
                content={
                  <span>
                    <u>collapse</u>
                  </span>
                }
                onClick={() => {
                  setLength(300);
                  setShowAll(false);
                }}
              />
            ))}
        </Card.Content>
      </Card>
    </div>
  );
};

export default PostWelcome;
