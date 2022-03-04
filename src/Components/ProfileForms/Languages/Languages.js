/* eslint-disable no-param-reassign, react/destructuring-assignment */

import React, { useMemo } from 'react';
import { connect } from 'react-redux';
import { createSelector } from 'redux-starter-kit';
import { FieldArray, Formik } from 'formik';
import PropTypes from 'prop-types';
import cx from 'classnames';
import BEMHelper from 'react-bem-helper';
import * as Yup from 'yup';
import { Button, Label, Icon, Form, Select, Dropdown } from 'semantic-ui-react';

import { getAvailableLanguages } from '../../../selectors/profile';
import './Languages.scss';

const bem = BEMHelper({ name: 'ProfileFormLanguages', outputIsString: true });

const proficiencyOptions = [
  { key: 'Basic', text: 'Basic', value: 'Basic' },
  { key: 'Fluent', text: 'Fluent', value: 'Fluent' },
  { key: 'Native', text: 'Native', value: 'Native' },
];

function Languages(props) {
  const {
    availableLanguages,
    className,
    form,
    subTitle,
    requireProficiency,
    ValidationSchema,
  } = props;
  const languageOptions = useMemo(
    () =>
      Object.values(availableLanguages)
        .map((lang) => ({
          key: lang.value,
          value: lang.value,
          text: lang.label,
        }))
        .filter(
          (lang) =>
            !form.values.languages.some(
              (language) => language.value === lang.value
            )
        ),
    [availableLanguages, form.values.languages]
  );

  return (
    <div className={cx(bem(), 'flex flex-col items-center', className)}>
      <FieldArray
        name="languages"
        render={(arrayHelpers) => (
          <>
            <div
              className={bem(
                'selected-section',
                '',
                'flex-col items-center text-center'
              )}
            >
              <p className="font-rubik">{subTitle}:</p>
              {form.values.languages.length > 0 ? (
                <div className="flex-wrap flex-center-all">
                  {form.values.languages.map((lang, i) => (
                    <Label
                      key={lang.value}
                      color="orange"
                      className={bem('selected-lang')}
                    >
                      {`${lang.label}${
                        requireProficiency ? `: ${lang.proficiency}` : ''
                      }`}
                      <Icon
                        name="close"
                        onClick={() => arrayHelpers.remove(i)}
                      />
                    </Label>
                  ))}
                </div>
              ) : (
                <p>No languages selected</p>
              )}
            </div>
            <Formik
              onSubmit={(values, { resetForm }) => {
                const language = {
                  label: availableLanguages[values.language].label,
                  value: values.language,
                  ...(requireProficiency && {
                    proficiency: values.proficiency,
                  }),
                };
                arrayHelpers.push(language);
                resetForm(resetForm);
              }}
              validationSchema={ValidationSchema}
            >
              {(formProps) => {
                const {
                  values,
                  isSubmitting,
                  handleSubmit,
                  setFieldValue,
                  isValid,
                } = formProps;
                return (
                  <Form
                    className={bem('form', '', 'text-center')}
                    onSubmit={handleSubmit}
                  >
                    <Form.Field>
                      <Select
                        search
                        name="language"
                        options={languageOptions}
                        placeholder="Language"
                        onChange={(e, { value }) =>
                          setFieldValue('language', value)
                        }
                        value={values.language || null}
                      />
                    </Form.Field>
                    {requireProficiency && (
                      <Form.Field>
                        <Dropdown
                          selection
                          placeholder="Proficiency"
                          direction="upward"
                          options={proficiencyOptions}
                          onChange={(e, { value }) =>
                            setFieldValue('proficiency', value)
                          }
                          value={values.proficiency || null}
                        />
                      </Form.Field>
                    )}
                    <Button
                      type="button"
                      basic
                      compact
                      color="orange"
                      disabled={!isValid || isSubmitting}
                      onClick={() => handleSubmit()}
                    >
                      <span className="mr-4">Add</span>
                      <Icon name="check" />
                    </Button>
                  </Form>
                );
              }}
            </Formik>
          </>
        )}
      />
    </div>
  );
}

Languages.propTypes = {
  className: PropTypes.string,
  form: PropTypes.shape(),
  availableLanguages: PropTypes.shape({}).isRequired,
  subTitle: PropTypes.string,
  ValidationSchema: PropTypes.shape(),
  requireProficiency: PropTypes.bool,
};

Languages.defaultProps = {
  subTitle: 'You can speak',
  ValidationSchema: Yup.object().shape({
    language: Yup.string().required('Required'),
    proficiency: Yup.string().required('Required'),
  }),
  requireProficiency: true,
};

const mapStateToProps = createSelector(
  [getAvailableLanguages],
  (availableLanguages = {}) => ({
    availableLanguages,
  })
);

export default connect(mapStateToProps, {})(Languages);
