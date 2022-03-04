import React, { useState } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Icon } from 'semantic-ui-react';
import EditLocationModal from '../../NewGroup/EditLocationModal';
import { changeLocation as changeLocationAction } from '../../../Actions/actions_challenges';

function EditLocation({ id, placeId, changeLocation }) {
  const [isModalOpen, setModalOpen] = useState(false);
  function onSubmit(val) {
    changeLocation(id, val);
  }
  return (
    <>
      <Icon name="pencil" onClick={() => setModalOpen(true)} />
      <EditLocationModal
        open={isModalOpen}
        onSubmit={onSubmit}
        currentLocationId={placeId}
        onClose={() => setModalOpen(false)}
      />
    </>
  );
}

EditLocation.propTypes = {
  id: PropTypes.number,
  placeId: PropTypes.oneOfType([PropTypes.string, PropTypes.oneOf([null])]),
  changeLocation: PropTypes.func,
};

export default connect(null, { changeLocation: changeLocationAction })(
  EditLocation
);
