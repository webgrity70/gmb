// Reducer relies on immer
/* eslint-disable no-param-reassign */
/* eslint-disable react/jsx-no-bind */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */
import React, { useMemo, useReducer, useState } from 'react';
import _ from 'lodash';
import PropTypes from 'prop-types';
import { Form, Icon, Search, Input, Button, Feed } from 'semantic-ui-react';
import { createReducer, createAction, createSelector } from 'redux-starter-kit';
import BEMHelper from 'react-bem-helper';
import PlacesAutocomplete, {
  geocodeByAddress,
} from 'react-places-autocomplete';

import OnboardingService from '../../../../Services/OnboardingService';

import './GroupSelect.scss';

const bem = BEMHelper({ name: 'RegisterGroupSelect', outputIsString: true });
const actions = {
  searchFieldChanged: createAction('SEARCH_FIELD_CHANGED'),
  resetSearch: createAction('RESET_SEARCH'),
  searchSuccess: createAction('SEARCH_SUCCESS'),
  searchError: createAction('SEARCH_ERROR'),
  showNewGroupForm: createAction('SHOW_NEW_GROUP_FORM'),
  showGroupSearchForm: createAction('SHOW_GROUP_SEARCH_FORM'),
  addNewGroup: createAction('ADD_NEW_GROUP'),
  changeNewGroupField: createAction('CHANGE_NEW_GROUP_FIELD'),
};

const initialState = {
  isLoading: false,
  isAddingNew: false,
  newGroup: {},
  value: '',
  results: [],
};

const reducer = createReducer(initialState, {
  [actions.searchFieldChanged]: (state, action) => {
    state.isLoading = true;
    state.value = action.payload.value;
  },
  [actions.searchSuccess]: (state, action) => {
    state.isLoading = false;
    const results = action.payload.results || [];
    state.results = results
      .map((result) => ({
        key: result.id,
        title: result.name,
        id: result.id,
        image: result.icon,
      }))
      .filter(
        (result) =>
          !_.some(
            action.payload.selected,
            (item) => item.group_id === result.id
          )
      );
  },
  [actions.searchError]: (state) => {
    state.isLoading = false;
  },
  [actions.showNewGroupForm]: (state) => {
    state.isAddingNew = true;
  },
  [actions.showGroupSearchForm]: (state) => {
    state.isAddingNew = false;
  },
  [actions.addNewGroup]: (state) => {
    state.isAddingNew = false;
    state.newGroup = {};
  },
  [actions.changeNewGroupField]: (state, action) => {
    state.newGroup[action.payload.field] = action.payload.value;
  },
  [actions.resetSearch]: (state) => {
    state.isLoading = false;
    state.value = '';
  },
});

const selectors = {
  isNewGroupValid: createSelector(
    ['newGroup.name', 'newGroup.url', 'newGroup.google_places_id'],
    (name, url, placeId) => name != null && url != null && placeId != null
  ),
};

function resultRenderer(result) {
  return (
    <Feed>
      <Feed.Event key={result.id} image={result.image} content={result.title} />
    </Feed>
  );
}

const GroupSelect = ({ groupType, onChange, value, question }) => {
  const [state, dispatch] = useReducer(reducer, initialState);
  const [newPlaceAddress, setNewPlaceAddress] = useState('');

  async function handleSearchChange(e, inputData) {
    const searchValue = inputData.value;
    dispatch(actions.searchFieldChanged({ value: searchValue }));

    try {
      const payload = await OnboardingService.getGroups({
        q: searchValue,
        filters: { groupType },
      });
      dispatch(actions.searchSuccess({ ...payload, selected: value }));
    } catch (err) {
      console.log(err);
      dispatch(actions.searchError(err));
    }

    if (inputData.value.length < 1) {
      dispatch(actions.resetSearch());
    }
  }

  const debouncedSearchChange = useMemo(
    () =>
      _.debounce(handleSearchChange, 500, {
        leading: true,
      }),
    [handleSearchChange]
  );

  async function handlePlacesSelect(address) {
    geocodeByAddress(address)
      .then((results) => {
        dispatch(
          actions.changeNewGroupField({
            field: 'google_places_id',
            value: results[0].place_id,
          })
        );
        setNewPlaceAddress(address);
      })
      .catch((error) => console.error('Error', error));
  }

  function onResultSelect(e, { result }) {
    // Check if group is already added
    if (_.some(value, (item) => item.group_id === result.id)) {
      return;
    }

    value = value || [];
    value.push({
      group_id: result.id,
      name: result.title,
    });
    onChange(value);
    dispatch(actions.resetSearch());
  }

  function removeGroup(index) {
    value.splice(index, 1);
    onChange(value);
    dispatch(actions.resetSearch());
  }

  function onAddNewGroup() {
    if (!selectors.isNewGroupValid(state)) {
      return;
    }

    value = value || [];
    value.push(state.newGroup);
    onChange(value);
    dispatch(actions.addNewGroup());
    setNewPlaceAddress('');
  }
  return (
    <div className={bem()}>
      {!state.isAddingNew ? (
        <>
          <Search
            className={bem('search-input', '', 'mb-4')}
            loading={state.isLoading}
            onResultSelect={onResultSelect}
            onSearchChange={debouncedSearchChange}
            results={state.results}
            value={state.value}
            resultRenderer={resultRenderer}
            placeholder="Search"
          />
          <span className="flex-center-all flex-col">
            Can't find your group?
            <button
              type="button"
              className={bem('switch-form-btn')}
              onClick={() => dispatch(actions.showNewGroupForm())}
            >
              Add New +
            </button>
          </span>
        </>
      ) : (
        <>
          <Form.Field className="form_field_container_inner places">
            <Input
              className="mb-4"
              placeholder={`${groupType} Name`}
              onChange={(e) =>
                dispatch(
                  actions.changeNewGroupField({
                    field: 'name',
                    value: e.target.value,
                  })
                )
              }
            />
            <Input
              className="mb-4"
              placeholder="Website"
              onChange={(e) =>
                dispatch(
                  actions.changeNewGroupField({
                    field: 'url',
                    value: e.target.value,
                  })
                )
              }
            />
            <PlacesAutocomplete
              value={newPlaceAddress}
              onChange={setNewPlaceAddress}
              onSelect={handlePlacesSelect}
            >
              {({
                getInputProps,
                suggestions,
                getSuggestionItemProps,
                loading,
              }) => (
                <div>
                  <Input
                    {...getInputProps({
                      placeholder: 'Location',
                    })}
                    value={newPlaceAddress}
                    className="mb-4"
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
          <div className="mt-4 flex-center-all flex-col">
            <Button
              className="add_button"
              onClick={onAddNewGroup}
              animated
              disabled={!selectors.isNewGroupValid(state)}
            >
              <Button.Content visible>Add</Button.Content>
              <Button.Content hidden>
                <Icon name="check" />
              </Button.Content>
            </Button>
            <button
              type="button"
              className={bem('switch-form-btn', '', 'mt-4')}
              onClick={() => dispatch(actions.showGroupSearchForm())}
            >
              Cancel
            </button>
          </div>
        </>
      )}
      <Form.Field>
        <div className="flex-center-all flex-wrap selected">
          {_.map(value, (group, index) => (
            <div
              className="sub_item"
              onClick={() => removeGroup(index)}
              key={index}
            >
              {`${group.name}${
                group.group_id != null ? '' : ' (Pending Verification)'
              }`}
              <Icon name="close" />
            </div>
          ))}
        </div>
      </Form.Field>
    </div>
  );
};

GroupSelect.propTypes = {
  onChange: PropTypes.func,
  groupType: PropTypes.string,
  question: PropTypes.oneOf([PropTypes.string, PropTypes.shape({})]),
  value: PropTypes.arrayOf(PropTypes.shape({})),
};

export default GroupSelect;
