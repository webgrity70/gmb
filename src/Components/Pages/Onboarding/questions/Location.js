import React from 'react';
import PropTypes from 'prop-types';
import Location from '../../../ProfileForms/Location';

function LocationQuestion({ onChange, value = {} }) {
  const { placeId } = value;
  return <Location placeId={placeId} onChange={onChange} />;
}

LocationQuestion.propTypes = {
  value: PropTypes.shape({
    placeId: PropTypes.string,
  }),
  onChange: PropTypes.func,
};

export default LocationQuestion;
