/* eslint-disable react/jsx-no-bind */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */
import React from 'react';
import _ from 'lodash';

import { Form, Button, Icon } from 'semantic-ui-react';
import PlacesAutocomplete from 'react-places-autocomplete';

const PlacesSearch = ({
  question,
  signupItem,
  selectedPlace,
  address,
  removePlace,
  addPlace,
  handlePlacesChange,
  handlePlacesSelect,
}) => (
  <div className="places">
    <Form.Field>
      <PlacesAutocomplete
        value={address}
        onChange={handlePlacesChange}
        onSelect={handlePlacesSelect}
      >
        {({ getInputProps, suggestions, getSuggestionItemProps, loading }) => (
          <div>
            <input
              {...getInputProps({
                placeholder: question.placeholder || 'Search Places ...',
                className: 'location-search-input',
              })}
              value={selectedPlace.name}
            />
            <div className="autocomplete-dropdown-container">
              {loading && <div>Loading...</div>}
              {suggestions.map((suggestion) => {
                const className = suggestion.active
                  ? 'suggestion-item--active'
                  : 'suggestion-item';
                // inline style for demonstration purpose
                const style = suggestion.active
                  ? {
                      backgroundColor: '#fafafa',
                      cursor: 'pointer',
                      padding: '10px',
                    }
                  : {
                      backgroundColor: '#ffffff',
                      cursor: 'pointer',
                      padding: '10px',
                    };
                return (
                  <div
                    {...getSuggestionItemProps(suggestion, {
                      className,
                      style,
                    })}
                  >
                    <span>{suggestion.description}</span>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </PlacesAutocomplete>
    </Form.Field>
    <Form.Field className="field form_field_container_inner right_flex">
      <Button className="add_button" onClick={addPlace} animated>
        <Button.Content visible>Add</Button.Content>
        <Button.Content hidden>
          <Icon name="check" />
        </Button.Content>
      </Button>
    </Form.Field>
    <Form.Field>
      <div className="selected">
        {signupItem ? (
          <Form.Field className="form_field_container_inner_title">
            <span className="question_title">Selected:</span>
          </Form.Field>
        ) : null}
        {_.map(signupItem, (place) => (
          <div
            className="sub_item"
            onClick={() => removePlace(place.name)}
            key={place.name}
          >
            {place.name}
            <Icon name="close" />
          </div>
        ))}
      </div>
    </Form.Field>
  </div>
);

export default PlacesSearch;
