import React from 'react';
import PropTypes from 'prop-types';
import { Modal } from 'semantic-ui-react';
import AvatarGenerator from '../AvatarGenerator';

const AvatarModal = ({ onSave, avatar, updateUser, open, closeModal }) => (
  <Modal size="large" open={open} onClose={closeModal}>
    <Modal.Content>
      <AvatarGenerator
        finishUpdatingAvatar={closeModal}
        updateUser={updateUser}
        onSave={onSave}
        defaultAvatar={avatar}
      />
    </Modal.Content>
  </Modal>
);

AvatarModal.propTypes = {
  onSave: PropTypes.func,
  open: PropTypes.bool,
  closeModal: PropTypes.func,
  avatar: PropTypes.shape({}),
  updateUser: PropTypes.func,
};

export default AvatarModal;
