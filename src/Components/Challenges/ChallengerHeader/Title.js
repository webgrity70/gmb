import React, { useState } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Icon, Popup } from 'semantic-ui-react';
import { Input } from '../../ReduxForm';
import { bem } from './utils';
import { renameChallenge as renameChallengeAction } from '../../../Actions/actions_challenges';

function Title({ id, name, canEdit, renameChallenge }) {
  const [inputValue, setInputValue] = useState(name);
  const [isEditMode, setIsEditMode] = useState(false);
  async function onSave() {
    await renameChallenge(id, inputValue);
    setIsEditMode(false);
  }
  return (
    <div className={bem('name', { edit: isEditMode })}>
      {isEditMode ? (
        <Input value={inputValue} onChange={(val) => setInputValue(val)} />
      ) : (
        name
      )}
      <div className="flex justify-center">
        {isEditMode ? (
          <Icon name="save" className="pointer" onClick={onSave} />
        ) : (
          <Popup
            className={bem('privacy')}
            trigger={<Icon name="circle notch" />}
            content="Open to public"
          />
        )}
        {canEdit && (
          <Icon
            name={isEditMode ? 'times' : 'pencil'}
            className="pointer"
            onClick={() => setIsEditMode(!isEditMode)}
          />
        )}
      </div>
    </div>
  );
}

Title.propTypes = {
  id: PropTypes.number,
  name: PropTypes.string,
  canEdit: PropTypes.bool,
  renameChallenge: PropTypes.func,
};

export default connect(null, { renameChallenge: renameChallengeAction })(Title);
