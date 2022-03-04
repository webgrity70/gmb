/* eslint-disable react/no-unescaped-entities */
import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import BEMHelper from 'react-bem-helper';
import { Button, Icon } from 'semantic-ui-react';
import './MilestonesPopup.scss';

const bem = BEMHelper({ name: 'MilestonesPopup', outputIsString: true });

function MilestonesPopup({ open, onClose, onOpenMilestones }) {
  useEffect(() => {
    const timeout = setTimeout(() => {
      onClose();
    }, 5000);
    return () => {
      clearTimeout(timeout);
    };
  }, [open]);
  if (!open) return null;
  return (
    <div className={bem()}>
      <div className="text-right">
        <Icon name="times" onClick={() => onClose()} />
      </div>
      <p>Want to create milestones for your new behavior?</p>
      <Button onClick={onOpenMilestones}>Yes, let's create milestones</Button>
    </div>
  );
}

MilestonesPopup.propTypes = {
  open: PropTypes.bool,
  onClose: PropTypes.func,
  onOpenMilestones: PropTypes.func,
};

export default MilestonesPopup;
