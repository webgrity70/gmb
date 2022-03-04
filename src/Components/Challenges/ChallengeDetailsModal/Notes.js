/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/aria-role */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Accordion, Icon } from 'semantic-ui-react';
import MarkDown from '../../Elements/MarkDown';

function Notes({ notes }) {
  const [active, setActive] = useState(null);
  return (
    <Accordion>
      <Accordion.Title
        index={0}
        onClick={() => setActive(active === 0 ? null : 0)}
      >
        {active === 0 ? 'hide' : 'see'} note <Icon name="triangle down" />
      </Accordion.Title>
      <Accordion.Content active={active === 0}>
        {notes.map((note, index) => (
          <div key={`challenge-notes-${index + 1}`}>
            <span>{note.prompt}</span>
            <span>
              {note.promptValue ? <MarkDown source={note.promptValue} /> : '-'}
            </span>
          </div>
        ))}
      </Accordion.Content>
    </Accordion>
  );
}

Notes.propTypes = {
  notes: PropTypes.arrayOf(PropTypes.shape()),
};

export default Notes;
