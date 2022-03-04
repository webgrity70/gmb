import React from 'react';
import _ from 'lodash';
import { geocodeByAddress } from 'react-places-autocomplete';
import PlacesSearch from './PlacesSearch';

export default class PlaceComponent extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      selectedPlace: { name: '', location: null },
    };

    this.handlePlacesChange = this.handlePlacesChange.bind(this);
    this.handlePlacesSelect = this.handlePlacesSelect.bind(this);
    this.removePlace = this.removePlace.bind(this);
    this.addPlace = this.addPlace.bind(this);
  }

  UNSAFE_componentWillMount() {
    this.setState({ selectedPlace: { name: '' } });
  }

  handlePlacesSelect = (address) => {
    geocodeByAddress(address)
      .then((results) => {
        this.setState({
          selectedPlace: { name: address, place_id: results[0].place_id },
        });
      })
      .catch((error) => console.error('Error', error));
  };

  handlePlacesChange(address) {
    this.setState({ selectedPlace: { name: address, location: null } });
  }

  addPlace() {
    const { selectedPlace } = this.state;
    let { value, onChange } = this.props;
    value = value || [];
    value.push(selectedPlace);
    onChange(value);
    this.setState({ selectedPlace: { name: '' } });
  }

  removePlace(address) {
    const { value, onChange } = this.props;
    const index = _.findIndex(value, { name: address });
    value.splice(index, 1);
    onChange(value);
  }

  render() {
    const { question, value } = this.props;
    const { selectedPlace } = this.state;
    const {
      handlePlacesChange,
      handlePlacesSelect,
      removePlace,
      addPlace,
    } = this;
    return (
      <PlacesSearch
        question={question}
        address={selectedPlace.name}
        handlePlacesChange={handlePlacesChange}
        handlePlacesSelect={handlePlacesSelect}
        selectedPlace={selectedPlace}
        removePlace={removePlace}
        addPlace={addPlace}
        signupItem={value}
      />
    );
  }
}
