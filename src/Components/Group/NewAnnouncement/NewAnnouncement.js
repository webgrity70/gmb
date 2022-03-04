import React, { useState } from 'react';
import PropTypes from 'prop-types';
import BEMHelper from 'react-bem-helper';
import { TextArea, Button } from 'semantic-ui-react';

import './NewAnnouncement.scss';

const bem = BEMHelper({ name: 'NewAnnouncementt', outputIsString: true });

const NewAnnouncement = ({ announcement, onCreate, posting, onCancel }) => {
  const [text, setText] = useState(announcement || '');
  return (
    <div className={bem()}>
      <TextArea
        placeholder={`${announcement ? 'Edit' : 'Create'} an announcement`}
        onChange={(e) => setText(e.target.value)}
        value={text}
        rows={7}
      />
      <div className={bem('actions')}>
        {onCancel && (
          <Button basic onClick={onCancel}>
            Cancel
          </Button>
        )}
        <Button
          color="orange"
          onClick={() => onCreate(text)}
          disabled={posting || text.length === 0}
          loading={posting}
        >
          Share
        </Button>
      </div>
    </div>
  );
};

NewAnnouncement.propTypes = {
  onCreate: PropTypes.func,
  onCancel: PropTypes.func,
  posting: PropTypes.bool,
  announcement: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.oneOf([null]),
  ]),
};

export default NewAnnouncement;
