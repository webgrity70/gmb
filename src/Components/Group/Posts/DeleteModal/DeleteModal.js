import React from 'react';
import PropTypes from 'prop-types';
import BEMHelper from 'react-bem-helper';
import { Modal, Button } from 'semantic-ui-react';
import './DeleteModal.scss';

const bem = BEMHelper({ name: 'DeletePostModal', outputIsString: true });

function DeletePost({ open, onClose, onDelete, onUnpublish }) {
  return (
    <Modal
      dimmer="inverted"
      closeIcon={{ name: 'close', color: 'grey' }}
      open={open}
      onClose={onClose}
      closeOnDimmerClick={false}
      size="tiny"
      className={bem()}
    >
      <Modal.Header>Delete Post</Modal.Header>
      <Modal.Content> Are you sure you want to delete this post?</Modal.Content>
      <Modal.Actions className="justify-end">
        <Button onClick={onClose}>Cancel</Button>
        <Button color="orange" basic onClick={onUnpublish}>
          Unpublish
        </Button>
        <Button color="red" onClick={onDelete}>
          Delete
        </Button>
      </Modal.Actions>
    </Modal>
  );
}

DeletePost.propTypes = {
  open: PropTypes.bool,
  onDelete: PropTypes.func,
  onUnpublish: PropTypes.func,
  onClose: PropTypes.func,
};

export default DeletePost;
