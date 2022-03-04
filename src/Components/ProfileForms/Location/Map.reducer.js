// Reducer relies on immer
/* eslint-disable no-param-reassign */

import { createReducer, createAction, createSelector } from 'redux-starter-kit';

const updateLocation = createAction('UPDATE_LOCATION');

export const initialState = {
  lat: 39.947551601345154,
  lng: -100.58692170226891,
  zoom: 4,
  isMarkerVisible: false,
  placeId: null,
};

export const reducer = createReducer(initialState, {
  [updateLocation]: (state, action) => {
    const { lat, lng, placeId } = action.payload;
    state.lat = lat;
    state.lng = lng;
    state.isMarkerVisible = true;
    state.placeId = placeId;
    state.zoom = 13;
  },
});

export const actions = {
  updateLocation,
};

export const selectors = {
  getPosition: createSelector(['lat', 'lng'], (lat, lng) => ({ lat, lng })),
};
