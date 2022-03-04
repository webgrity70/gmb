import React, { Fragment, useState } from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { Icon } from 'semantic-ui-react';
import Dropdown from '../Elements/Dropdown';
import { leaveGroup as leaveGroupAction } from '../../Actions/actions_groups';
import ContactAdminsModal from '../Elements/ContactAdminsModal';
import { getGroup } from '../../selectors/groups';
import { GROUP_STAFF } from '../../constants';
import DeleteGroupModal from '../Elements/DeleteGroupModal/DeleteGroupModal';

const GroupDropdown = ({
  hasPermission,
  userPermission,
  // history,
  leaveGroup,
  id,
  defaultChatMember,
  name,
  ...props
}) => {
  const [openAdminsModal, setOpenAdminModals] = useState(false);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);

  const isAdmin = userPermission && GROUP_STAFF.includes(userPermission);
  const options = [];
  if (!isAdmin) {
    options.push({
      text: 'Contact Admin',
      icon: <Icon name="comment" />,
      onClick: () => setOpenAdminModals(true),
    });
  }
  /* if (isAdmin) {
    options.push({
      text: 'CREATE...',
      type: 'label',
    });
    options.push({
      text: 'New Plan Template',
      icon: <Icon name="plus" />,
      onClick: () => history.push(`/plan/new?group=${id}`),
    });
    options.push({
      type: 'divider',
    });
  } */
  if (userPermission === 'Owner') {
    options.push({
      text: 'Delete Group',
      icon: <Icon name="trash" />,
      onClick: () => setOpenDeleteModal(true),
    });
  }
  if (hasPermission) {
    options.push({
      text: 'Leave Group',
      icon: <Icon name="sign-out" />,
      onClick: () => leaveGroup(id),
    });
  }
  return (
    <Fragment>
      <Dropdown options={options} {...props} />
      <ContactAdminsModal
        groupId={id}
        groupName={name}
        open={openAdminsModal}
        defaultChatMember={defaultChatMember}
        onClose={() => setOpenAdminModals(false)}
      />
      <DeleteGroupModal
        open={openDeleteModal}
        onClose={() => setOpenDeleteModal(false)}
        groupId={id}
      />
    </Fragment>
  );
};

const mapDispatchToProps = {
  leaveGroup: leaveGroupAction,
};

GroupDropdown.propTypes = {
  hasPermission: PropTypes.bool,
  isAdmin: PropTypes.bool,
  leaveGroup: PropTypes.func,
  id: PropTypes.number,
  userPermission: PropTypes.string,
  defaultChatMember: PropTypes.number,
  name: PropTypes.string,
  history: PropTypes.func,
};

const mapStateToProps = (state, { id }) => ({
  ...getGroup(state, { groupId: id }),
});

const ConnectedDropdown = connect(
  mapStateToProps,
  mapDispatchToProps
)(GroupDropdown);

export default withRouter(ConnectedDropdown);
