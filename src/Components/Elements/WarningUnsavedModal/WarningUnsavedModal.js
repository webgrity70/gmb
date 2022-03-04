import React from 'react';
import PropTypes from 'prop-types';
import { Modal, Button } from 'semantic-ui-react';
import BEMHelper from 'react-bem-helper';
import './WarningUnsavedModal.scss';

const bem = BEMHelper({ name: 'WarningUnsavedModal', outputIsString: true });

function WarningUnsavedModal({ onNegative, onPositive, onClose, open }) {
  return (
    <Modal
      onClose={onClose}
      open={open}
      className={bem()}
      closeOnDimmerClick={false}
      dimmer="inverted"
      closeIcon={{ name: 'close', color: 'grey' }}
    >
      <Modal.Content>
        <h3 className={bem('title')}>Are you sure you want to leave?</h3>
        <span className={bem('description')}>
          You haven't saved your changes yet, and you'll lose them if you leave
          the page.
        </span>
        <div className={bem('buttons')}>
          <Button onClick={onNegative}>Leave</Button>
          <Button onClick={onPositive} color="orange">
            Save changes
          </Button>
        </div>
      </Modal.Content>
    </Modal>
  );
}
WarningUnsavedModal.propTypes = {
  onClose: PropTypes.func,
  open: PropTypes.bool,
  onNegative: PropTypes.func,
  onPositive: PropTypes.func,
};

export default WarningUnsavedModal;
