/* eslint-disable jsx-a11y/anchor-is-valid */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import React, { useState } from 'react';
import get from 'lodash/get';
import { Field } from 'redux-form';
import PropTypes from 'prop-types';
import { Popup } from 'semantic-ui-react';
import BEMHelper from 'react-bem-helper';
import FieldSetLayout from '../FieldSetLayout';
import EditLocationModal from '../../NewGroup/EditLocationModal';
import './LocationInput.scss';

const bem = BEMHelper({ name: 'LanguagesInput', outputIsString: true });

function InnerComp({ input: { value, onChange }, ...props }) {
  const [isLocationModalOpen, setLocationModalOpen] = useState(false);
  const list = get(value, 'formattedAddress');
  return (
    <>
      <FieldSetLayout {...props}>
        <div className={bem()}>
          <span>Location: </span>
          {list && <span className={bem('list')}>{list}</span>}
          <Popup
            trigger={<i className="far fa-question-circle mt-2 mr-2 ml-1" />}
            on="click"
            inverted
            hoverable
          >
            If your challenge has a location you can add it here.
          </Popup>
          <a onClick={() => setLocationModalOpen(true)}>Edit</a>
        </div>
      </FieldSetLayout>
      <EditLocationModal
        open={isLocationModalOpen}
        onClose={() => setLocationModalOpen(false)}
        onSubmit={onChange}
        currentLocationId={get(value, 'placeId', null)}
      />
    </>
  );
}

InnerComp.propTypes = {
  input: PropTypes.shape(),
  className: PropTypes.oneOfType([PropTypes.string, PropTypes.oneOf([null])]),
};

const LocationInput = (props) => <Field {...props} component={InnerComp} />;

export default LocationInput;
