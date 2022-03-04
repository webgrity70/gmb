import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Formik } from 'formik';
import * as Yup from 'yup';
import * as profileActions from '../../../Actions/actions_profile';
import useActionOnCondition from '../../../hooks/use-action-on-condition';
import * as profileSelectors from '../../../selectors/profile';

const ValidationSchema = Yup.object().shape({
  languages: Yup.array()
    .of(
      Yup.object().shape({
        label: Yup.string(),
        proficiency: Yup.string(),
        value: Yup.string(),
      })
    )
    .min(1),
});

function LanguagesFormContainer(props) {
  const {
    children,
    fetchLanguages,
    areLanguagesLoaded,
    onSubmit,
    initialValues = {},
  } = props;

  useActionOnCondition(fetchLanguages, !areLanguagesLoaded);

  return (
    <Formik
      initialValues={{
        languages: initialValues.languages || [],
      }}
      validationSchema={ValidationSchema}
      onSubmit={async (values, { setSubmitting }) => {
        setSubmitting(false);
        onSubmit(values.languages);
      }}
    >
      {children}
    </Formik>
  );
}

LanguagesFormContainer.propTypes = {
  initialValues: PropTypes.shape({}),
  children: PropTypes.func,
  fetchLanguages: PropTypes.func.isRequired,
  areLanguagesLoaded: PropTypes.bool.isRequired,
  onSubmit: PropTypes.func,
};

const mapStateToProps = (state) => ({
  areLanguagesLoaded: profileSelectors.getAreLanguagesLoaded(state),
});

export default connect(mapStateToProps, {
  fetchLanguages: profileActions.fetchLanguages,
  updateLanguages: profileActions.updateLanguages,
})(LanguagesFormContainer);
