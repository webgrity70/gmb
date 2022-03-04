import React, { useEffect, useState } from 'react';
import BEMHelper from 'react-bem-helper';
import { Button, Icon, Input } from 'semantic-ui-react';
import PropTypes from 'prop-types';
import './PostNew.scss';
import Editor from '../PostEditor';

const bem = BEMHelper({ name: 'PostNew', outputIsString: true });

const PostNew = ({ setCurrentView, onCreatePost, onEditPost, post }) => {
  const [editor, setEditor] = useState();
  const [title, setTitle] = useState('');
  const [text, setText] = useState('');
  const isDraft = post ? post.is_draft : true;

  useEffect(() => {
    if (editor && post) {
      setText(post.text);
      setTitle(post.title);
      editor.setData(post.text);
    }

    return () => {
      if (editor) {
        setText('');
        editor.setData('');
      }
    };
  }, [editor, post]);

  return (
    <div className={bem()}>
      <div
        className="PostSingle__back"
        onClick={() => setCurrentView('postList')}
      >
        <Icon name="chevron left" />
        Back to all posts
      </div>
      <div className={bem('title')}>{post ? 'Edit' : 'Create a'} post</div>
      <Input
        className={bem('title-input')}
        placeholder="Post Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <div className={bem('editor')}>
        <Editor
          setEditor={setEditor}
          setText={setText}
          placeholder="Write the post content here."
        />
      </div>
      <div className={bem('buttons')}>
        <Button
          className={bem('button', 'grey')}
          onClick={() => setCurrentView('postList')}
        >
          Discard
        </Button>
        <Button
          basic
          color="orange"
          onClick={() => {
            if (post) {
              onEditPost(title, text, true);
            } else {
              onCreatePost(title, text, true);
            }
            setCurrentView('postList');
          }}
          disabled={!text || !title || !isDraft}
        >
          Save Draft
        </Button>
        <Button
          color="orange"
          disabled={!text || !title}
          onClick={() => {
            if (post) {
              onEditPost(title, text, false);
            } else {
              onCreatePost(title, text, false);
            }
            setCurrentView('postList');
          }}
        >
          Post
        </Button>
      </div>
    </div>
  );
};

PostNew.propTypes = {
  setCurrentView: PropTypes.func,
};
export default PostNew;
