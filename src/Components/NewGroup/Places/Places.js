import React, { useState } from 'react';
import PropTypes from 'prop-types';
import Search from './Search';

const Places = ({ onSelect, value }) => {
  const [open, setOpen] = useState(false);
  function handlePlacesSelect(location) {
    onSelect(location);
    setOpen(false);
  }
  function onAdd() {
    onSelect({ name: value, formattedAddress: null, placeId: null });
  }
  function handlePlacesChange(address) {
    if (!open) setOpen(true);
    onSelect({ name: address });
  }
  function toggle() {
    setOpen(!open);
  }
  return (
    <Search
      address={value}
      open={open}
      handlePlacesChange={handlePlacesChange}
      handlePlacesSelect={handlePlacesSelect}
      addPlace={onAdd}
      toggle={toggle}
    />
  );
};

Places.propTypes = {
  onSelect: PropTypes.func,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.oneOf([null])]),
};

export default Places;
