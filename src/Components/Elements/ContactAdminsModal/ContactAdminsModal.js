import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import BEMHelper from 'react-bem-helper';
import cx from 'classnames';
import { Modal, Button } from 'semantic-ui-react';
import * as groupActions from '../../../Actions/actions_groups';
import * as chatActions from '../../../Actions/action_chat';
import { getGroupAdmins } from '../../../selectors/groups';
import { getGroupAdminsLoading } from '../../../selectors/requests';
import Loading from '../../Loading';
import Avatar from '../Avatar';
import './ContactAdminsModal.scss';

const bem = BEMHelper({ name: 'ContactAdminsModal', outputIsString: true });

const ContactAdminsModal = ({
  groupId,
  groupName,
  onClose,
  open,
  admins,
  selectThread,
  loading,
  defaultChatMember,
  contactAdmin,
}) => {
  const shouldRenderContent = !loading && admins.length > 0;
  const shouldRenderEmpty = !loading && !admins.length;

  async function onContactAdmin(userId) {
    try {
      const { thread } = await contactAdmin({ groupId, userId });
      if (thread) selectThread({ threadId: thread });
      onClose();
    } catch (e) {
      console.log(e);
      onClose();
    }
  }
  return (
    <Modal
      dimmer="inverted"
      closeIcon={{ name: 'close', color: 'grey' }}
      open={open}
      onClose={onClose}
      closeOnDimmerClick={false}
      size="tiny"
      className={cx(bem())}
    >
      <Modal.Content>
        {loading && <Loading />}
        {shouldRenderEmpty && (
          <div className={bem('empty')}>
            This group currently has no administrators
          </div>
        )}
        {shouldRenderContent && (
          <div className="px-8">
            <div className="flex flex-col items-center">
              <h2 className={bem('title')}>{groupName}</h2>
              <span className={bem('description')}>
                Who would you like to chat to?
              </span>
            </div>
            <div className={bem('list')}>
              {admins.map((admin) => (
                <div className="flex justify-between mb-8" key={admin.id}>
                  <div className="flex items-center">
                    <div className={bem('avatar-container')}>
                      <Avatar avatar={admin.avatar} id={admin.id} />
                    </div>
                    <span className={bem('user-name')}>{admin.name}</span>
                    <span className={bem('user-description')}>
                      {admin.permission}
                    </span>
                  </div>
                  <Button
                    color="orange"
                    onClick={() => onContactAdmin(admin.id)}
                  >
                    Chat
                  </Button>
                </div>
              ))}
            </div>
            <div className="flex justify-center">
              <Button
                color="orange"
                className={bem('anyone')}
                onClick={() => onContactAdmin(defaultChatMember)}
              >
                Anyone is OK
              </Button>
            </div>
          </div>
        )}
      </Modal.Content>
    </Modal>
  );
};

ContactAdminsModal.propTypes = {
  onClose: PropTypes.func,
  open: PropTypes.bool,
  groupName: PropTypes.string,
  loading: PropTypes.bool,
  groupId: PropTypes.number,
  selectThread: PropTypes.func,
  contactAdmin: PropTypes.func,
  defaultChatMember: PropTypes.number,
  admins: PropTypes.arrayOf(PropTypes.shape()),
};

const mapStateToProps = (state) => ({
  admins: getGroupAdmins(state),
  loading: getGroupAdminsLoading(state),
});

export default connect(mapStateToProps, {
  fetchGroupAdmins: groupActions.fetchGroupAdmins,
  contactAdmin: groupActions.contactAdmin,
  selectThread: chatActions.selectThread,
})(ContactAdminsModal);
