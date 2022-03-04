import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import BEMHelper from 'react-bem-helper';
import { Dropdown, Form, Message } from 'semantic-ui-react';
import * as optionsSelectors from '../../../selectors/profileFormOptions';

import './Occupation.scss';

const bem = BEMHelper({ name: 'ProfileFormOccupation', outputIsString: true });

function OccupationForm(props) {
  const { form, occupations, schoolYearValues, educationLevelValues } = props;
  const { values, setFieldValue, errors, isValid } = form;
  const schoolYearOptions = useMemo(
    () =>
      schoolYearValues.map((value) => ({
        key: value,
        text: value,
        value,
      })),
    [schoolYearValues]
  );

  const educationLevelOptions = useMemo(
    () =>
      educationLevelValues.map((value) => ({
        key: value,
        text: value,
        value,
      })),
    [educationLevelValues]
  );

  return (
    <Form as="div" className={bem()} error={!isValid}>
      {occupations.map((occupation) => {
        if (occupation === 'Student') {
          return (
            <React.Fragment key={occupation}>
              <Form.Checkbox
                label="Student"
                onChange={() =>
                  setFieldValue(
                    'specialOccupations.Student',
                    !values.specialOccupations.Student
                  )
                }
                checked={values.specialOccupations.Student}
              />
              <Form.Group>
                <Form.Field className="pb-4" width={6}>
                  <Dropdown
                    selection
                    placeholder="College"
                    options={educationLevelOptions}
                    onChange={(e, { value }) =>
                      setFieldValue('specialOccupations.educationLevel', value)
                    }
                    value={values.specialOccupations.educationLevel || null}
                  />
                </Form.Field>
                <Form.Field className="pb-4" width={5}>
                  <Dropdown
                    selection
                    placeholder="1st year"
                    options={schoolYearOptions}
                    onChange={(e, { value }) =>
                      setFieldValue(
                        'specialOccupations.currentSchoolYear',
                        value
                      )
                    }
                    value={values.specialOccupations.currentSchoolYear || null}
                  />
                </Form.Field>
              </Form.Group>
            </React.Fragment>
          );
        }
        if (occupation === 'Other') {
          return (
            <Form.Group key={occupation} className="flex items-center">
              <Form.Checkbox
                className={bem('other-checkbox')}
                onChange={() =>
                  setFieldValue(
                    'specialOccupations.otherActive',
                    !values.specialOccupations.otherActive
                  )
                }
                checked={values.specialOccupations.otherActive}
              />
              <Form.Input
                placeholder="Other"
                onChange={(e) =>
                  setFieldValue('specialOccupations.Other', e.target.value)
                }
                value={values.specialOccupations.Other}
              />
            </Form.Group>
          );
        }

        return (
          <Form.Checkbox
            key={occupation}
            label={occupation}
            onChange={() =>
              setFieldValue(
                `occupations.${occupation}`,
                !values.occupations[occupation]
              )
            }
            checked={values.occupations[occupation] || false}
          />
        );
      })}
      {errors.occupations ? (
        <Message
          className={bem('form-error')}
          error
          content={errors.occupations}
        />
      ) : null}
    </Form>
  );
}

OccupationForm.propTypes = {
  form: PropTypes.shape({
    values: PropTypes.shape({}).isRequired,
    setFieldValue: PropTypes.func.isRequired,
  }),
  occupations: PropTypes.arrayOf(PropTypes.string),
  educationLevelValues: PropTypes.arrayOf(PropTypes.string),
  schoolYearValues: PropTypes.arrayOf(PropTypes.string),
};

const mapStateToProps = (state) => ({
  occupations: optionsSelectors.getOccupationOptionValues(state),
  educationLevelValues: optionsSelectors.getEducationLevelOptionValues(state),
  schoolYearValues: optionsSelectors.getCurrentSchoolYearOptionValues(state),
});

export default connect(mapStateToProps, null)(OccupationForm);
