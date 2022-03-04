import get from 'lodash/get';

function GeocoderPromise(geocoder, value, type = 'address') {
  return new Promise((resolve, reject) => {
    geocoder.geocode({ [type]: value }, (results, status) => {
      if (status === 'OK') {
        if (results[0]) {
          resolve(results[0]);
        } else {
          reject(new Error('No Results'));
        }
      } else {
        reject(status);
      }
    });
  });
}

export function getCurrentLocation() {
  if (navigator && navigator.geolocation) {
    return new Promise((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const { coords } = pos;
          resolve({
            lat: coords.latitude,
            lng: coords.longitude,
          });
        },
        (err) => {
          reject(err);
        }
      );
    });
  }
  return {
    lat: 0,
    lng: 0,
  };
}

function formatLocation(location) {
  if (!location) {
    return '';
  }

  const addressComponents = location.address_components || [];
  const countryComponent = addressComponents.find((component) => {
    const types = component.types || [];
    return types.includes('country');
  });
  const stateComponent = addressComponents.find((component) => {
    const types = component.types || [];
    return types.includes('administrative_area_level_1');
  });
  const cityComponent = addressComponents.find((component) => {
    const types = component.types || [];
    return types.includes('locality');
  });

  const city = get(cityComponent, 'long_name', '');
  const state = get(stateComponent, 'long_name', '');
  const country = get(countryComponent, 'short_name', '');

  if (city) {
    return `${city}, ${state} ${country}`;
  }

  return `${state} ${country}`;
}

function getISOCountry(location) {
  if (!location) {
    return null;
  }

  const addressComponents = location.address_components || [];
  const countryComponent = addressComponents.find((component) => {
    const types = component.types || [];
    return types.includes('country');
  });
  const country = get(countryComponent, 'short_name', '');
  return country;
}

export function getLatLngLocation(location) {
  const geocoder = new window.google.maps.Geocoder();
  const latlng = new window.google.maps.LatLng(location.lat, location.lng);
  return GeocoderPromise(geocoder, latlng, 'location').then((rett) => ({
    formattedAddress: formatLocation(rett),
    placeId: rett.place_id,
    countryISO: getISOCountry(rett),
  }));
}

export function getAddressLocation(address) {
  const geocoder = new window.google.maps.Geocoder();

  return GeocoderPromise(geocoder, address).then((rett) => ({
    formattedAddress: formatLocation(rett),
    placeId: rett.place_id,
    lat: rett.geometry.location.lat(),
    lng: rett.geometry.location.lng(),
  }));
}

export function getPlaceLocation(placeId) {
  const geocoder = new window.google.maps.Geocoder();

  return GeocoderPromise(geocoder, placeId, 'placeId').then((rett) => ({
    formattedAddress: formatLocation(rett),
    placeId: rett.place_id,
    lat: rett.geometry.location.lat(),
    lng: rett.geometry.location.lng(),
  }));
}
