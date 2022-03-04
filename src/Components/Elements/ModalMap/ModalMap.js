import React, { useReducer } from 'react';
import PropTypes from 'prop-types';
import { Modal } from 'semantic-ui-react';
import BEMHelper from 'react-bem-helper';
import Map from '../../ProfileForms/Location/Map';
import {
  initialState,
  reducer,
} from '../../ProfileForms/Location/Location.reducer';
import './ModalMap.scss';

const bem = BEMHelper({ name: 'ModalMap', outputIsString: true });

function ModalMap({ trigger, placeId }) {
  const [state] = useReducer(reducer, initialState);
  return (
    <Modal
      dimmer="inverted"
      closeIcon={{ name: 'close', color: 'grey' }}
      trigger={trigger}
      closeOnDimmerClick={false}
    >
      <Modal.Header className="text-center">Location</Modal.Header>
      <Modal.Content scrolling>
        <Modal.Description>
          <Map
            mapElement={<div className={bem('map-element')} />}
            containerElement={
              <div className={bem('map-container mt-4 md:mt-0')} />
            }
            searchAddress={state.searchAddress}
            placeId={placeId}
            lat={state.lat}
            lng={state.lng}
            locationSource={state.locationSource}
          />
        </Modal.Description>
      </Modal.Content>
    </Modal>
  );
}
ModalMap.propTypes = {
  trigger: PropTypes.node,
  placeId: PropTypes.string,
};

export default ModalMap;
