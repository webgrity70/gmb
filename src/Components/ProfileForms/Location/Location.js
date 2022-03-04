/* eslint-disable no-param-reassign, react/destructuring-assignment */

import React, { useCallback, useReducer, useState } from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import BEMHelper from 'react-bem-helper';
import merge from 'lodash/merge';
import { Button, Form, Icon, Placeholder } from 'semantic-ui-react';
import Map from './Map';
import { getCurrentLocation } from './Map.utils';
import { actions, initialState, reducer } from './Location.reducer';
import Helpers from '../../Utils/Helpers';
import './Location.scss';

const bem = BEMHelper({ name: 'ProfileFormLocation', outputIsString: true });

function Location(props) {
  const [state, dispatch] = useReducer(reducer, initialState, (initial) =>
    merge({}, initial, { lat: props.lat, lng: props.lng })
  );
  const [street, setStreet] = useState('');
  const [crossStreet, setCrossStreet] = useState('');
  const [city, setCity] = useState('');

  function onSearchAddressClick() {
    const address = [street, crossStreet, city].join(' ');
    dispatch(actions.updateSearchAddress(address));
  }
  async function onAutoLocateClick() {
    try {
      const location = await getCurrentLocation();
      dispatch(actions.updateLocation({ ...location, source: 'coordinates' }));
    } catch (e) {
      Helpers.createToast({ message: e.message, status: 'error' });
    }
  }

  const onLocationChange = useCallback(
    (location) => {
      dispatch(actions.updateLocation(location));
      if (props.onChange) {
        props.onChange(location);
      }
    },
    [props.onChange]
  );

  return (
    <Form
      className={cx(bem(), 'flex flex-col items-center')}
      onSubmit={onSearchAddressClick}
    >
      <Form.Group className="w-full">
        <Form.Input
          className="py-2"
          autoComplete="address-line1"
          placeholder="Street"
          onChange={(e) => setStreet(e.target.value)}
          value={street}
          width="4"
          data-ignore-enter="true"
        />
        <Form.Input
          className="py-2"
          autoComplete="nope"
          placeholder="Cross Street"
          onChange={(e) => setCrossStreet(e.target.value)}
          value={crossStreet}
          width="4"
          data-ignore-enter="true"
        />
        <Form.Input
          className="py-2"
          autoComplete="address-level2"
          placeholder="City"
          onChange={(e) => setCity(e.target.value)}
          value={city}
          width="4"
          data-ignore-enter="true"
        />
        <Form.Button
          className={cx(bem('locate-btn-field'), 'py-2')}
          basic
          compact
          color="orange"
          icon
          onClick={onAutoLocateClick}
        >
          <Icon name="crosshairs" />
        </Form.Button>
        <Form.Field className={cx(bem('find-btn-field'), 'py-2')}>
          <Button compact color="orange" onClick={onSearchAddressClick}>
            <span className="mr-4">Find</span>
            <Icon name="search" />
          </Button>
        </Form.Field>
      </Form.Group>
      <Map
        mapElement={<div className={bem('map-element')} />}
        containerElement={<div className={bem('map-container mt-4 md:mt-0')} />}
        searchAddress={state.searchAddress}
        handleValueChange={onLocationChange}
        placeId={props.placeId}
        lat={state.lat}
        lng={state.lng}
        locationSource={state.locationSource}
      />
      {state.locationToShow ? (
        <p className="text-lg text-center font-rubik">
          <span>What users will see: </span>
          <strong>{state.locationToShow}</strong>
        </p>
      ) : (
        <Placeholder className="w-full my-5">
          <Placeholder.Line />
        </Placeholder>
      )}
    </Form>
  );
}

Location.propTypes = {
  onChange: PropTypes.func,
  lat: PropTypes.number,
  lng: PropTypes.number,
  placeId: PropTypes.string,
};

export default Location;
