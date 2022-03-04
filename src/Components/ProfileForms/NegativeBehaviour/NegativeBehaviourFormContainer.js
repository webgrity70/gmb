import React, { useMemo } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Formik } from 'formik';
import * as Yup from 'yup';
import * as profileActions from '../../../Actions/actions_profile';

const ValidationSchema = Yup.object().shape({
  specialBehaviours: Yup.object().shape({
    LoseWeight: Yup.boolean(),
    weightLoss: Yup.number().when('LoseWeight', {
      is: true,
      then: Yup.number().required().min(0),
    }),
  }),
  behaviours: Yup.object(),
  isPublic: Yup.boolean(),
  weightUnit: Yup.string(),
});

function OccupationFormContainer(props) {
  const {
    children,
    onSubmitSuccess,
    updateNegativeBehaviours,
    initialValues = {},
  } = props;

  const behavioursValues = useMemo(() => {
    const initial = { specialBehaviours: {}, behaviours: {} };
    return initialValues.behaviours.reduce((acc, behaviour) => {
      if (behaviour.name === 'Lose Weight') {
        acc.specialBehaviours.LoseWeight = true;
        let weightLoss = behaviour.extra;
        if (initialValues.weightUnit === 'lb') {
          weightLoss = Math.round(weightLoss * 2.2046);
        }
        acc.specialBehaviours.weightLoss = weightLoss;
      } else {
        acc.behaviours[behaviour.name] = true;
      }
      return acc;
    }, initial);
  }, [initialValues.behaviours, initialValues.weightUnit]);

  return (
    <Formik
      enableReinitialize
      initialValues={{
        weightUnit: initialValues.weightUnit || 'lb',
        isPublic: initialValues.isPublic || false,
        ...behavioursValues,
      }}
      validationSchema={ValidationSchema}
      onSubmit={async (values, { setSubmitting }) => {
        const behaviours = [];
        const payload = {
          behaviourPrivacy: values.isPublic,
          behaviours,
        };
        if (values.specialBehaviours.LoseWeight) {
          let weightLoss = parseFloat(values.specialBehaviours.weightLoss);
          if (values.weightUnit === 'lb') {
            weightLoss /= 2.2046;
          }
          payload.weightLoss = weightLoss;
          behaviours.push('Lose Weight');
        }
        Object.entries(values.behaviours).forEach(([behaviour, checked]) => {
          if (checked) {
            behaviours.push(behaviour);
          }
        });
        const action = await updateNegativeBehaviours(payload);
        setSubmitting(false);
        if (
          action.type ===
            profileActions.updateNegativeBehavioursSucceeded.type &&
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
  onSubmitSuccess: PropTypes.func,
  updateNegativeBehaviours: PropTypes.func.isRequired,
};

export default connect(null, {
  updateNegativeBehaviours: profileActions.updateNegativeBehaviours,
})(OccupationFormContainer);
