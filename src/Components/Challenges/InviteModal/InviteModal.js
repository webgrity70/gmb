import React from 'react';
import { Modal, Button } from 'semantic-ui-react';
import PropTypes from 'prop-types';
import BEMHelper from 'react-bem-helper';
import './InviteModal.scss';
import { Input } from '../../ReduxForm';
import GMBCopyToClipboard from '../../Elements/CopyToClipboard/CopyToClipboard';

const bem = BEMHelper({ name: 'ChallengesInviteModal', outputIsString: true });

function InviteModal({ open, onOpen, trigger, onClose, challengeId, isFlash }) {
  const baseModalProps = {
    open,
    onClose: () => onClose(),
    onOpen,
    trigger,
    dimmer: 'inverted',
    size: 'tiny',
    closeOnDimmerClick: false,
    closeIcon: { name: 'close', color: 'grey' },
  };
  const baseUrl = `${window.location.origin}/challenges`;
  const url = isFlash
    ? `${baseUrl}/flash/${challengeId}`
    : `${baseUrl}/${challengeId}`;
  return (
    <Modal {...baseModalProps} className={bem()}>
      <Modal.Content>
        <h2>Invite a friend to join this challenge</h2>
        <div>
          <h3>Direct link to the challenge</h3>
          <span>Copy and paste the challenge url:</span>
          <div className="flex my-4">
            <Input disabled value={url} className="mr-2" />
            <GMBCopyToClipboard
              toCopy={url}
              Success={<Button disabled>Copied!</Button>}
            >
              <Button color="orange">Copy</Button>
            </GMBCopyToClipboard>
          </div>
        </div>
      </Modal.Content>
    </Modal>
  );
}

InviteModal.propTypes = {
  open: PropTypes.bool,
  onClose: PropTypes.func,
  onOpen: PropTypes.func,
  challengeId: PropTypes.number,
  isFlash: PropTypes.bool,
  trigger: PropTypes.oneOfType([PropTypes.func, PropTypes.element]),
};

export default InviteModal;
