/* eslint-disable jsx-a11y/anchor-is-valid */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import React, { useState } from 'react';
import { Field } from 'redux-form';
import PropTypes from 'prop-types';
import BEMHelper from 'react-bem-helper';
import FieldSetLayout from '../FieldSetLayout';
import EditLanguagesModal from '../../NewGroup/EditLanguagesModal';
import './LanguagesInput.scss';

const bem = BEMHelper({ name: 'LanguagesInput', outputIsString: true });

function InnerComp({ input: { value, onChange }, ...props }) {
  const [isLanguagesModalOpen, setLanguagesModalOpen] = useState(false);
  const languages = value.map((e) => e.label).join(', ');
  return (
    <>
      <FieldSetLayout {...props}>
        <div className={bem()}>
          <span>
            Languages<span className="required">*</span>:{' '}
          </span>
          <span className={bem('list')}>{languages}</span>
          <a onClick={() => setLanguagesModalOpen(true)}>Edit</a>
        </div>
      </FieldSetLayout>
      <EditLanguagesModal
        open={isLanguagesModalOpen}
        subTitle="Challenges Languages:"
        onClose={() => setLanguagesModalOpen(false)}
        onSubmit={onChange}
        currentLanguages={value || []}
      />
    </>
  );
}

InnerComp.propTypes = {
  input: PropTypes.shape(),
  className: PropTypes.oneOfType([PropTypes.string, PropTypes.oneOf([null])]),
};

const LanguagesInput = (props) => <Field {...props} component={InnerComp} />;

export default LanguagesInput;
