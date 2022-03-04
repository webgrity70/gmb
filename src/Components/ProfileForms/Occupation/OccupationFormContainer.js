import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Formik, validateYupSchema, yupToFormErrors } from 'formik';
import * as Yup from 'yup';
import * as profileFormActions from '../../../Actions/action_profile_forms';
import * as profileActions from '../../../Actions/actions_profile';
import useActionOnCondition from '../../../hooks/use-action-on-condition';
import * as optionsSelectors from '../../../selectors/profileFormOptions';

const ValidationSchema = Yup.object().shape({
  specialOccupations: Yup.object().shape({
    Student: Yup.boolean(),
    Other: Yup.string().when('otherActive', {
      is: true,
      then: Yup.string().required(),
    }),
    educationLevel: Yup.string().when('Student', {
      is: true,
      then: Yup.string().required(),
    }),
    currentSchoolYear: Yup.string(),
    otherActive: Yup.boolean(),
  }),
  occupations: Yup.object(),
});

function getOccupationsFromValues(values) {
  const occupations = [];
  if (values.specialOccupations.Student) {
    occupations.push('Student');
  }
  Object.entries(values.occupations).forEach(([occupation, checked]) => {
    if (checked) {
      occupations.push(occupation);
    }
  });
  if (
    values.specialOccupations.otherActive &&
    values.specialOccupations.Other
  ) {
    occupations.push(values.specialOccupations.Other);
  }
  return occupations;
}

function OccupationFormContainer(props) {
  const {
    children,
    areOccupationsLoaded,
    fetchOccupationOptions,
    fetchCurrentSchoolYearOptions,
    areCurrentSchoolYearsLoaded,
    areEducationLevelsLoaded,
    fetchEducationLevelOptions,
    updateUserOccupation,
    onSubmitSuccess,
    initialValues = {},
  } = props;

  useActionOnCondition(fetchOccupationOptions, !areOccupationsLoaded);
  useActionOnCondition(
    fetchCurrentSchoolYearOptions,
    !areCurrentSchoolYearsLoaded
  );
  useActionOnCondition(fetchEducationLevelOptions, !areEducationLevelsLoaded);

  return (
    <Formik
      enableReinitialize
      initialValues={{
        specialOccupations: {
          Student: initialValues.student || false,
          Other: initialValues.other || '',
          educationLevel: initialValues.educationLevel || '',
          currentSchoolYear: initialValues.currentSchoolYear || '',
          otherActive: initialValues.otherActive || false,
        },
        occupations: {
          ...initialValues.occupations,
        },
      }}
      validate={async (values) => {
        try {
          await validateYupSchema(values, ValidationSchema);
        } catch (e) {
          throw yupToFormErrors(e);
        }

        const occupations = getOccupationsFromValues(values);
        if (occupations.length === 0) {
          const errors = {
            occupations: 'At least one occupation is required.',
          };
          throw errors;
        }

        return {};
      }}
      onSubmit={async (values, { setSubmitting }) => {
        const payload = {
          occupations: getOccupationsFromValues(values),
        };
        if (values.specialOccupations.Student) {
          payload.educationLevel = values.specialOccupations.educationLevel;
          payload.currentSchoolYear =
            values.specialOccupations.currentSchoolYear;
        }
        const action = await updateUserOccupation(payload);
        setSubmitting(false);
        if (
          action.type === profileActions.updateOccupationSucceeded.type &&
          onSubmitSuccess
        ) {
          onSubmitSuccess();
        }
      }}
    >
      {children}
    </Formik>
  );
}

OccupationFormContainer.propTypes = {
  initialValues: PropTypes.shape({}),
  children: PropTypes.func,
  fetchOccupationOptions: PropTypes.func.isRequired,
  areOccupationsLoaded: PropTypes.bool,
  fetchCurrentSchoolYearOptions: PropTypes.func.isRequired,
  areCurrentSchoolYearsLoaded: PropTypes.bool,
  fetchEducationLevelOptions: PropTypes.func.isRequired,
  areEducationLevelsLoaded: PropTypes.bool,
  updateUserOccupation: PropTypes.func.isRequired,
  onSubmitSuccess: PropTypes.func,
};

const mapStateToProps = (state) => ({
  areOccupationsLoaded: optionsSelectors.getAreOccupationOptionsLoaded(state),
  areCurrentSchoolYearsLoaded: optionsSelectors.getAreCurrentSchoolYearOptionsLoaded(
    state
  ),
  areEducationLevelsLoaded: optionsSelectors.getAreEducationLevelOptionsLoaded(
    state
  ),
});

export default connect(mapStateToProps, {
  fetchOccupationOptions: profileFormActions.fetchOccupationOptions,
  fetchCurrentSchoolYearOptions:
    profileFormActions.fetchCurrentSchoolYearOptions,
  fetchEducationLevelOptions: profileFormActions.fetchEducationLevelOptions,
  updateUserOccupation: profileActions.updateOccupation,
})(OccupationFormContainer);
