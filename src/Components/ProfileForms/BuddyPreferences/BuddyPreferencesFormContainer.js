import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Formik } from 'formik';
import * as Yup from 'yup';
import * as profileActions from '../../../Actions/actions_profile';

const ValidationSchema = Yup.object().shape({
  buddyAges: Yup.object().shape({
    min: Yup.number().min(16).max(122),
    max: Yup.number().min(16).max(122),
  }),
  buddyTimezone: Yup.number().min(0).max(14),
  buddyRadius: Yup.number().min(0).max(300),
  buddySex: Yup.string().required(),
  customBuddySex: Yup.string().when('buddySex', {
    is: 'Custom',
    then: Yup.string().required(),
  }),
  meetingPreference: Yup.string().required(),
});

function BuddyPreferencesFormContainer(props) {
  const {
    children,
    onSubmitSuccess,
    updateBuddyPreferences,
    initialValues = {},
  } = props;

  const buddyAgeText = initialValues.buddyAge || '';
  const agePreferences = buddyAgeText.split(',');
  let buddyAgeMin;
  let buddyAgeMax;
  if (agePreferences.length === 2) {
    buddyAgeMin = parseInt(agePreferences[0], 10);
    buddyAgeMax = parseInt(agePreferences[1], 10);
  }

  const buddySexValues = {
    buddySex: '',
    customBuddySex: '',
  };
  if (['Any', 'Male', 'Female'].includes(initialValues.buddySex)) {
    buddySexValues.buddySex = initialValues.buddySex;
  } else if (initialValues.buddySex != null) {
    buddySexValues.buddySex = 'Custom';
    buddySexValues.customBuddySex = initialValues.buddySex;
  }

  let meetingPreference = '';
  if (
    initialValues.meetingPreference &&
    initialValues.meetingPreference.length > 0
  ) {
    if (initialValues.meetingPreference.length >= 2) {
      meetingPreference = 'Either';
    } else {
      [meetingPreference] = initialValues.meetingPreference;
    }
  }

  return (
    <Formik
      enableReinitialize
      initialValues={{
        ...buddySexValues,
        buddyTimezone: initialValues.buddyTimezone || 0,
        buddyRadius: initialValues.buddyRadius
          ? Math.round(initialValues.buddyRadius * 0.6214)
          : 5,
        buddyAges: { min: buddyAgeMin || 18, max: buddyAgeMax || 40 },
        meetingPreference,
      }}
      validationSchema={ValidationSchema}
      onSubmit={async (values, { setSubmitting }) => {
        const payload = {
          buddySex:
            values.buddySex === 'Custom'
              ? values.customBuddySex
              : values.buddySex,
          buddyTimezone: values.buddyTimezone,
          buddyAge: `${values.buddyAges.min},${values.buddyAges.max}`,
          buddyRadius: values.buddyRadius / 0.6214,
          meetingPreference:
            values.meetingPreference === 'Either'
              ? ['In Person', 'Virtual']
              : [values.meetingPreference],
        };

        const action = await updateBuddyPreferences(payload);
        setSubmitting(false);
        if (
          action.type === profileActions.updateBuddyPreferencesSucceeded.type &&
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

BuddyPreferencesFormContainer.propTypes = {
  initialValues: PropTypes.shape({}),
  children: PropTypes.func,
  onSubmitSuccess: PropTypes.func,
  updateBuddyPreferences: PropTypes.func.isRequired,
};

const mapStateToProps = () => ({});

export default connect(mapStateToProps, {
  updateBuddyPreferences: profileActions.updateBuddyPreferences,
})(BuddyPreferencesFormContainer);
