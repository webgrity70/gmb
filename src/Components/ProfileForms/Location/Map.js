/* eslint-disable no-param-reassign, react/destructuring-assignment */

import React, { useReducer, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import { compose, withProps } from 'recompose';
import { withGoogleMap, GoogleMap, Marker } from 'react-google-maps';
import * as mapUtils from './Map.utils';
import usePrevious from '../../../hooks/use-previous';
import { reducer, actions, initialState, selectors } from './Map.reducer';

function Map(props) {
  const { handleValueChange, searchAddress, locationSource } = props;
  const [state, dispatch] = useReducer(reducer, initialState);
  const map = useRef();
  const prevLat = usePrevious(props.lat);
  const prevLng = usePrevious(props.lng);

  async function updateLocation({ lat, lng, location, source }) {
    if (!location) {
      try {
        location = await mapUtils.getLatLngLocation({ lat, lng });
      } catch (e) {
        console.error(e);
        location = {};
      }
    }
    map.current.panTo({ lat, lng });

    dispatch(actions.updateLocation({ lat, lng }));
    if (handleValueChange) {
      handleValueChange({
        lat,
        lng,
        source,
        ...location,
      });
    }
  }

  // Update location to reflect parent's coordinates
  useEffect(() => {
    if (locationSource !== 'coordinates') {
      return;
    }
    const { lat, lng } = props;
    const validCoords = lat != null && lng != null;
    const diffCoords = prevLat !== lat && prevLng !== lng;
    const diffCachedCoords = state.lat !== lat || state.lng !== lng;
    const shouldUpdate = validCoords && diffCoords && diffCachedCoords;
    if (shouldUpdate) {
      updateLocation({ lat, lng, source: locationSource });
    }
  }, [
    props.lat,
    props.lng,
    state.lat,
    state.lng,
    handleValueChange,
    locationSource,
  ]);

  // Update location to reflect parent's place id
  useEffect(() => {
    if (locationSource !== 'place') {
      return;
    }
    const { placeId } = props;
    async function searchLocation() {
      try {
        const location = await mapUtils.getPlaceLocation(placeId);
        if (location) {
          updateLocation({
            lat: location.lat,
            lng: location.lng,
            location,
            source: locationSource,
          });
        }
      } catch (e) {
        console.error(e);
      }
    }
    if (placeId && placeId !== state.placeId) {
      searchLocation(props.placeId);
    }
  }, [props.placeId, state.placeId, handleValueChange, locationSource]);

  // Update location to reflect parent's search address
  useEffect(() => {
    if (locationSource !== 'search-address') {
      return;
    }
    async function searchLocation(address) {
      try {
        const location = await mapUtils.getAddressLocation(address);
        if (location) {
          updateLocation({
            lat: location.lat,
            lng: location.lng,
            location,
            source: locationSource,
          });
        }
      } catch (e) {
        console.error(e);
      }
    }
    searchLocation(searchAddress);
  }, [searchAddress, handleValueChange, locationSource]);

  // Update location to the one selected in map
  function onMapClick(e) {
    updateLocation({ lat: e.latLng.lat(), lng: e.latLng.lng(), source: 'map' });
  }

  const position = selectors.getPosition(state);

  return (
    <div>
      <GoogleMap
        ref={map}
        zoom={state.zoom}
        defaultCenter={position}
        {...(handleValueChange && { onClick: onMapClick })}
      >
        <Marker position={position} visible={state.isMarkerVisible} />
      </GoogleMap>
    </div>
  );
}

Map.propTypes = {
  handleValueChange: PropTypes.func,
  searchAddress: PropTypes.string,
  placeId: PropTypes.string,
  lat: PropTypes.number,
  lng: PropTypes.number,
  locationSource: PropTypes.oneOf([
    'place',
    'coordinates',
    'search-address',
    'map',
  ]),
};

const MyMapComponent = compose(
  withProps({
    loadingElement: <div style={{ height: '100%', width: '100%' }} />,
  }),
  withGoogleMap
)(React.memo(Map));

export default MyMapComponent;
