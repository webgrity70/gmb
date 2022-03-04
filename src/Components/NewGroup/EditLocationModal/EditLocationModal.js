import React, { useCallback, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import { Modal, Button } from 'semantic-ui-react';
import BEMHelper from 'react-bem-helper';
import LocationForm from '../../ProfileForms/Location';
import './EditLocationModal.scss';

const bem = BEMHelper({
  name: 'NewGroupEditLocationModal',
  outputIsString: true,
});

function EditLocationModal(props) {
  const { className, onSubmit, currentLocationId, open, onClose } = props;
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

  function onSave() {
    setSubmitting(true);
    onSubmit(locationValue.current);
    setSubmitting(false);
    onClose();
  }

  return (
    <Modal
      dimmer="inverted"
      closeIcon={{ name: 'close', color: 'grey' }}
      open={open}
      closeOnDimmerClick={false}
      onClose={onClose}
      className={cx(bem(), className)}
    >
      <Modal.Header className="text-center">Edit Location</Modal.Header>
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
  onClose: PropTypes.func.isRequired,
  open: PropTypes.bool.isRequired,
  onSubmit: PropTypes.func,
};

export default EditLocationModal;
