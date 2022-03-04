import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import BEMHelper from 'react-bem-helper';
import cx from 'classnames';
import { Modal, Button } from 'semantic-ui-react';
import { deleteGroup as deleteGroupAction } from '../../../Actions/actions_groups';
import { getDeleteGroupLoading } from '../../../selectors/requests';
import './DeleteGroupModal.scss';

const bem = BEMHelper({ name: 'ContactAdminsModal', outputIsString: true });

const DeleteGroupModal = ({ deleteGroup, onClose, loading, groupId, open }) => (
  <Modal
    dimmer="inverted"
    closeIcon={{ name: 'close', color: 'grey' }}
    open={open}
    onClose={onClose}
    closeOnDimmerClick={false}
    size="tiny"
    className={cx(bem())}
  >
    <Modal.Header>Delete Group</Modal.Header>
    <Modal.Content>Are you sure you want to delete this group?</Modal.Content>
    <Modal.Actions className="justify-end">
      <Button disabled={loading} onClick={onClose}>
        Cancel
      </Button>
      <Button
        color="orange"
        onClick={() => deleteGroup(groupId)}
        disabled={loading}
        loading={loading}
      >
        Delete Group
      </Button>
    </Modal.Actions>
  </Modal>
);

DeleteGroupModal.propTypes = {
  onClose: PropTypes.func,
  open: PropTypes.bool,
  loading: PropTypes.bool,
  groupId: PropTypes.number,
  deleteGroup: PropTypes.func,
};

const mapStateToProps = (state) => ({
  loading: getDeleteGroupLoading(state),
});

export default connect(mapStateToProps, { deleteGroup: deleteGroupAction })(
  DeleteGroupModal
);
