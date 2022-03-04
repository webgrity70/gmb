/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useState } from 'react';
import cx from 'classnames';
import PropTypes from 'prop-types';
import BEMHelper from 'react-bem-helper';
import { Form, Input } from 'semantic-ui-react';
import EditLanguagesModal from '../EditLanguagesModal';
import EditLocationModal from '../EditLocationModal';
import './BasicPersonal.scss';

const bem = BEMHelper({ name: 'BasicPersonalInfo', outputIsString: true });

const BasicPersonal = ({
  description,
  name,
  website,
  languages,
  location,
  errors,
  onChangeLanguages,
  onChangeName,
  onChangeWebsite,
  onChangeDescription,
  onChangeLocation,
}) => {
  const [isLanguagesModalOpen, setLanguagesModalOpen] = useState(false);
  const [isLocationModalOpen, setLocationModalOpen] = useState(false);
  const openLocationModal = () => setLocationModalOpen(true);
  const closeLocationModal = () => setLocationModalOpen(false);
  const openLanguagesModal = () => setLanguagesModalOpen(true);
  const closeLanguagesModal = () => setLanguagesModalOpen(false);
  return (
    <div className={bem()}>
      <div className={bem('details')}>
        <Form.Field>
          <Input
            value={name}
            name="name"
            placeholder="Group Name"
            required
            {...(errors.name && { className: 'error' })}
            onChange={(e) => onChangeName(e.target.value)}
          />
        </Form.Field>
        <Form.Field>
          <Input
            value={website}
            name="website"
            placeholder="http://www.MyOrg.com"
            required
            onChange={(e) => onChangeWebsite(e.target.value)}
            {...(errors.website && { className: 'error' })}
          />
          {errors.website && (
            <div className="error-text">Should be a valid URL</div>
          )}
        </Form.Field>
        <div className={cx(bem('inline'), { error: errors.location })}>
          <span>Location: </span>
          {location && (
            <span className={bem('inline-entries')}>
              {location.formattedAddress}
            </span>
          )}
          <a onClick={openLocationModal}>Edit</a>
          {!location && (
            <span className={bem('location-placeholder')}>
              International? Leave empty.
            </span>
          )}
        </div>
        <div className={cx(bem('inline'), { error: errors.languages })}>
          <span>Languages: </span>
          {languages && (
            <span className={bem('inline-entries')}>
              {languages.map((e) => e.label).join(', ')}
            </span>
          )}
          <a onClick={openLanguagesModal}>Edit</a>
        </div>
      </div>
      <Form.Field className={bem('description')} error={errors.description}>
        <Form.TextArea
          rows={3}
          placeholder="Group Description"
          value={description}
          onChange={(e) => onChangeDescription(e.target.value)}
        />
      </Form.Field>
      <EditLocationModal
        open={isLocationModalOpen}
        onClose={closeLocationModal}
        onSubmit={onChangeLocation}
        currentLocationId={location ? location.placeId : null}
      />
      <EditLanguagesModal
        open={isLanguagesModalOpen}
        onClose={closeLanguagesModal}
        onSubmit={onChangeLanguages}
        currentLanguages={languages}
      />
    </div>
  );
};

BasicPersonal.propTypes = {
  name: PropTypes.oneOfType([PropTypes.string, PropTypes.oneOf([null])]),
  onChangeName: PropTypes.func,
  description: PropTypes.oneOfType([PropTypes.string, PropTypes.oneOf([null])]),
  onChangeDescription: PropTypes.func,
  location: PropTypes.oneOfType([PropTypes.object, PropTypes.oneOf([null])]),
  website: PropTypes.oneOfType([PropTypes.string, PropTypes.oneOf([null])]),
  languages: PropTypes.oneOfType([PropTypes.array, PropTypes.oneOf([null])]),
  onChangeLanguages: PropTypes.func,
  onChangeWebsite: PropTypes.func,
  onChangeLocation: PropTypes.func,
  errors: PropTypes.shape({}),
};

export default BasicPersonal;
