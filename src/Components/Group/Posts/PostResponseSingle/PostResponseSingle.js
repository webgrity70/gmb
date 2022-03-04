import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import moment from 'moment';
import Avatar from '../../../Elements/Avatar';
import './PostResponseSingle.scss';
import ReactHtmlParser from 'react-html-parser';
import { Button } from 'semantic-ui-react';
import BEMHelper from 'react-bem-helper';
import Editor from '../PostEditor';

const bem = BEMHelper({ name: 'PostResponseSingle', outputIsString: true });

const PostResponseSingle = ({ response, isOwner, onDelete, handleEdit }) => {
  const [editor, setEditor] = useState();
  const [text, setText] = useState(response.text);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    if (editor) {
      editor.setData(response.text);
      setText(response.text);
    }

    return () => {
      if (editor) {
        setText('');
        editor.setData('');
      }
    };
  }, [response, editor]);

  const onEdit = () => {
    handleEdit(text, response.id, () => setIsEditing(false));
  };

  return (
    <div className={bem()}>
      <div>
        <Link to={`/profile/${response.user.id}`} className={bem('avatar')}>
          <Avatar avatar={response.user.avatar} />
        </Link>
      </div>
      <div className={bem('content')}>
        <div className={bem('content-meta')}>
          <Link to={`/profile/${response.user.id}`} className="author">
            {response.user.name}
          </Link>
          <span className="date">
            {' '}
            {moment(response.created_at).format('MMM. D YYYY')}
          </span>
        </div>
        <div className={bem('editor', !isEditing ? 'hidden' : '')}>
          <Editor setEditor={setEditor} setText={setText} placeholder="" />
          <div className="buttons">
            <Button
              className="mt-1"
              basic
              floated="right"
              onClick={() => setIsEditing(false)}
            >
              Cancel
            </Button>
            <Button
              className="mt-1"
              basic
              color="orange"
              floated="right"
              onClick={onEdit}
            >
              Edit Response
            </Button>
          </div>
        </div>
        {!isEditing && (
          <div className={bem('content-main')}>{ReactHtmlParser(text)}</div>
        )}
        {isOwner && !isEditing && (
          <div className="PostResponseSingle__content-links">
            <span
              onClick={() => {
                setIsEditing(true);
              }}
            >
              Edit
            </span>
            <span onClick={() => onDelete()}>Delete</span>
          </div>
        )}
        <div className={bem('divider')} />
      </div>
    </div>
  );
};
PostResponseSingle.propTypes = {
  response: PropTypes.shape({
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
  }),
  isOwner: PropTypes.bool,
};

export default PostResponseSingle;
