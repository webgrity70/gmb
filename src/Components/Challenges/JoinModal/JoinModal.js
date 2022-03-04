import React from 'react';
import PropTypes from 'prop-types';
import { Modal, Button } from 'semantic-ui-react';
import BEMHelper from 'react-bem-helper';
import './JoinModal.scss';

const bem = BEMHelper({ name: 'JoinChallengeModal', outputIsString: true });

function JoinModal({
  onClose,
  open,
  onJoin,
  canChangeTime,
  onJoinSchedule,
  canChangeDetails,
  canChangeDuration,
  canChangeLocation,
}) {
  const baseModalProps = {
    open,
    onClose: () => onClose(),
    dimmer: 'inverted',
    className: bem(),
    closeOnDimmerClick: false,
    closeIcon: { name: 'close', color: 'grey' },
  };
  if (!open) {
    return <Modal {...baseModalProps} />;
  }
  const canSchedule =
    canChangeTime !== 'no' ||
    canChangeDetails ||
    canChangeDuration ||
    canChangeLocation;
  return (
    <Modal {...baseModalProps}>
      <Modal.Content>
        <h5 className={bem('title')}>Join Challenge?</h5>
        <p className={bem('description')}>
          By joining this challenge you can chat with other joined members and
          see when they check in.
        </p>
        <div className={bem('divider')} />
        {canSchedule && (
          <div className={bem('schedule')}>
            <span>
              You can edit the following challenge info according to your
              preferences:
            </span>
            <ul>
              {canChangeDetails && <li>Description</li>}
              {canChangeTime && (
                <li>
                  Date & Time{' '}
                  {canChangeTime === '24h' && '(select range within 24h)'}
                </li>
              )}
              {canChangeDuration && <li>Duration</li>}
              {canChangeLocation && <li>Location</li>}
            </ul>
          </div>
        )}
        <div className="text-center mt-8 flex flex-wrap justify-center">
          {canSchedule && (
            <Button basic color="orange" onClick={onJoinSchedule}>
              Edit Schedule before joining
            </Button>
          )}
          <Button color="orange" onClick={onJoin}>
            Join now
          </Button>
        </div>
      </Modal.Content>
    </Modal>
  );
}

JoinModal.propTypes = {
  open: PropTypes.bool,
  onJoin: PropTypes.func,
  onClose: PropTypes.func,
  canChangeDetails: PropTypes.bool,
  canChangeDuration: PropTypes.bool,
  canChangeLocation: PropTypes.bool,
  canChangeTime: PropTypes.string,
  onJoinSchedule: PropTypes.func,
};

export default JoinModal;
