import React, { useCallback, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import { Modal, Button } from 'semantic-ui-react';
import { connect } from 'react-redux';
import BEMHelper from 'react-bem-helper';
import LocationForm from '../../ProfileForms/Location';
import * as profileActions from '../../../Actions/actions_profile';
import './EditLocationModal.scss';
import { getUserLocationId } from '../../../selectors/profile';

const bem = BEMHelper({
  name: 'ProfileEditLocationModal',
  outputIsString: true,
});

function EditLocationModal(props) {
  const {
    className,
    updateLocation,
    blockClose,
    currentLocationId,
    open,
    onClose,
  } = props;
  const locationValue = useRef();
  const [isSubmitting, setSubmitting] = useState(false);
  const [isValid, setValid] = useState(false);

  const onLocationChange = useCallback(
    (location) => {
      locationValue.current = location;
      setValid(Boolean(locationValue.current && locationValue.current.placeId));
    },
    [setValid]
  );

  async function onSave() {
    setSubmitting(true);
    const action = await updateLocation({
      google_place_id: locationValue.current
        ? locationValue.current.placeId
        : null,
    });
    setSubmitting(false);
    if (action.type === profileActions.updateLocationSucceeded.type) {
      onClose();
    }
  }

  return (
    <Modal
      dimmer="inverted"
      open={open}
      onClose={onClose}
      className={cx(bem(), className)}
      {...(!blockClose && { closeIcon: { name: 'close', color: 'grey' } })}
      {...(blockClose && {
        closeOnDimmerClick: false,
        closeOnDocumentClick: false,
      })}
    >
      <Modal.Header className="text-center">
        Edit Location
        <p>To make location private, click save and go to settings.</p>
      </Modal.Header>
      <Modal.Content scrolling>
        <Modal.Description>
          <LocationForm
            onChange={onLocationChange}
            placeId={currentLocationId}
          />
        </Modal.Description>
      </Modal.Content>
      <Modal.Actions className="justify-end">
        <Button
          color="orange"
          onClick={onSave}
          disabled={!isValid || isSubmitting}
        >
          Save
        </Button>
      </Modal.Actions>
    </Modal>
  );
}

EditLocationModal.propTypes = {
  className: PropTypes.string,
  currentLocationId: PropTypes.string,
  updateLocation: PropTypes.func.isRequired,
  onClose: PropTypes.func.isRequired,
  open: PropTypes.bool.isRequired,
  blockClose: PropTypes.oneOfType([PropTypes.bool, PropTypes.oneOf([null])]),
};

const mapStateToProps = (state, props) => ({
  currentLocationId: getUserLocationId(state, props),
});

const ConnectedEditLocationModal = connect(mapStateToProps, {
  updateLocation: profileActions.updateLocation,
})(EditLocationModal);

ConnectedEditLocationModal.propTypes = {
  profileId: PropTypes.string.isRequired,
};

export default ConnectedEditLocationModal;
