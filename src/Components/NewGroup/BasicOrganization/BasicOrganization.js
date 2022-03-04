/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useState } from 'react';
import cx from 'classnames';
import PropTypes from 'prop-types';
import BEMHelper from 'react-bem-helper';
import { Form, Input, Checkbox } from 'semantic-ui-react';
import EditLanguagesModal from '../EditLanguagesModal';
import { types } from './utils';
import './BasicOrganization.scss';
import PlacesSearch from '../Places';

const bem = BEMHelper({ name: 'BasicOrganizationInfo', outputIsString: true });

const BasicOrganization = ({
  description,
  name,
  website,
  type,
  errors,
  languages,
  onChangeName,
  onChangeLocation,
  onChangeWebsite,
  onChangeDescription,
  onChangeLanguages,
  onChangeType,
}) => {
  const [isLanguagesModalOpen, setLanguagesModalOpen] = useState(false);
  function openLanguagesModal() {
    setLanguagesModalOpen(true);
  }
  function closeLanguagesModal() {
    setLanguagesModalOpen(false);
  }
  function onSelectOrg({ placeId, formattedAddress, name: orgName }) {
    if (placeId) onChangeLocation({ placeId, formattedAddress });
    onChangeName(orgName);
  }
  return (
    <div className={bem()}>
      <div className={bem('details')}>
        <div className={cx(bem('subType'), { error: errors.type })}>
          {types.map((e) => (
            <Form.Field
              className={cx({ active: e.value === type })}
              key={e.value}
            >
              <Checkbox
                radio
                value={e.value}
                onChange={() => onChangeType(e.value)}
                checked={e.value === type}
              />
              <span>{e.name}</span>
            </Form.Field>
          ))}
        </div>
        <Form.Field>
          <PlacesSearch value={name} onSelect={onSelectOrg} />
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
          {errors.website && <div className="error-text">{errors.website}</div>}
        </Form.Field>
        <div className={cx(bem('languages'), { error: errors.languages })}>
          <span>Languages: </span>
          {languages && (
            <span className={bem('languages-entries')}>
              {languages.map((e) => e.label).join(', ')}
            </span>
          )}
          <a onClick={openLanguagesModal}>Edit</a>
        </div>
      </div>
      <Form.Field className={bem('description')} error={!!errors.description}>
        <Form.TextArea
          rows={3}
          placeholder="Group Description"
          value={description}
          onChange={(e) => onChangeDescription(e.target.value)}
        />
      </Form.Field>
      <EditLanguagesModal
        open={isLanguagesModalOpen}
        onClose={closeLanguagesModal}
        onSubmit={onChangeLanguages}
        currentLanguages={languages}
      />
    </div>
  );
};

BasicOrganization.propTypes = {
  name: PropTypes.oneOfType([PropTypes.string, PropTypes.oneOf([null])]),
  onChangeName: PropTypes.func,
  description: PropTypes.oneOfType([PropTypes.string, PropTypes.oneOf([null])]),
  onChangeDescription: PropTypes.func,
  website: PropTypes.oneOfType([PropTypes.string, PropTypes.oneOf([null])]),
  onChangeWebsite: PropTypes.func,
  type: PropTypes.oneOfType([PropTypes.string, PropTypes.oneOf([null])]),
  languages: PropTypes.oneOfType([PropTypes.array, PropTypes.oneOf([null])]),
  onChangeLanguages: PropTypes.func,
  onChangeLocation: PropTypes.func,
  onChangeType: PropTypes.func,
  errors: PropTypes.shape({}),
};

export default BasicOrganization;
