/* eslint-disable react/jsx-no-bind */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */
import React from 'react';
import PropTypes from 'prop-types';
import { Form, Input } from 'semantic-ui-react';
import BEMHelper from 'react-bem-helper';
import PlacesAutocomplete from 'react-places-autocomplete';
import './Search.scss';

const bem = BEMHelper({ name: 'NewGroupPlacesSearch', outputIsString: true });

const PlacesSearch = ({
  address,
  addPlace,
  open,
  toggle,
  handlePlacesChange,
  handlePlacesSelect,
}) => (
  <div className={bem()} onBlur={() => open && toggle()}>
    <Form.Field>
      <PlacesAutocomplete value={address} onChange={handlePlacesChange}>
        {({ getInputProps, suggestions, getSuggestionItemProps, loading }) => (
          <div className="flex-col">
            <Input
              icon="search"
              {...getInputProps({
                placeholder: 'Group Name',
              })}
              value={address}
            />
            {open && (
              <div className={bem('search-list')}>
                {loading && <div className={bem('loading')}>Loading...</div>}
                {suggestions.map((suggestion) => {
                  const className = suggestion.active
                    ? bem('item--active')
                    : bem('item');
                  return (
                    <div
                      {...getSuggestionItemProps(suggestion, {
                        className,
                      })}
                      onClick={() =>
                        handlePlacesSelect({
                          placeId: suggestion.placeId,
                          name: suggestion.formattedSuggestion.mainText,
                          formattedAddress:
                            suggestion.formattedSuggestion.secondaryText,
                        })
                      }
                    >
                      <span>{suggestion.description}</span>
                    </div>
                  );
                })}
                <div className={bem('add')} onClick={addPlace}>
                  Add New +
                </div>
              </div>
            )}
          </div>
        )}
      </PlacesAutocomplete>
    </Form.Field>
  </div>
);

PlacesSearch.propTypes = {
  value: PropTypes.oneOfType([PropTypes.shape({}), PropTypes.oneOf([null])]),
  addPlace: PropTypes.func,
  address: PropTypes.string,
  handlePlacesChange: PropTypes.func,
  handlePlacesSelect: PropTypes.func,
  open: PropTypes.bool,
  toggle: PropTypes.func,
};

export default PlacesSearch;
