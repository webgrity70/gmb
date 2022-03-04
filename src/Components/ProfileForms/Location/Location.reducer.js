// Reducer relies on immer
/* eslint-disable no-param-reassign */

import { createReducer, createAction } from 'redux-starter-kit';

const updateLocation = createAction('UPDATE_LOCATION');
const updateSearchAddress = createAction('SEARCH_ADDRESS');

export const initialState = {
  lat: 0,
  lng: 0,
  locationToShow: '',
  locationSource: 'place',
  searchAddress: null,
};

export const reducer = createReducer(initialState, {
  [updateLocation]: (state, action) => {
    const { lat, lng, source, formattedAddress } = action.payload;
    state.lat = lat || state.lat;
    state.lng = lng || state.lat;
    state.locationToShow = formattedAddress || state.locationToShow;
    state.locationSource = source || state.locationSource;
  },
  [updateSearchAddress]: (state, action) => {
    state.searchAddress = action.payload;
    state.locationSource = 'search-address';
  },
});

export const actions = {
  updateLocation,
  updateSearchAddress,
};
