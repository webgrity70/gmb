import React from 'react';
import PropTypes from 'prop-types';
import { compose } from 'redux';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { connect } from 'react-redux';
import { getUserAboutData } from '../../../../selectors/profile';
import * as profileActions from '../../../../Actions/actions_profile';

const ValidationSchema = Yup.object().shape({
  about: Yup.string().required('Required').min(30).max(2000),
  strength: Yup.string().required('Required'),
  weakness: Yup.string().required('Required'),
  favoriteFood: Yup.string().required('Required'),
});

function AboutFormContainer(props) {
  const {
    about,
    strength,
    weakness,
    favoriteFood,
    updateAbout,
    children,
    onSubmitSuccess,
  } = props;
  return (
    <Formik
      enableReinitialize
      initialValues={{
        about,
        strength,
        weakness,
        favoriteFood,
      }}
      validationSchema={ValidationSchema}
      onSubmit={async (values, { setSubmitting }) => {
        const action = await updateAbout(values);
        setSubmitting(false);
        if (
          action.type === profileActions.updateAboutSucceeded.type &&
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

AboutFormContainer.propTypes = {
  about: PropTypes.string,
  strength: PropTypes.string,
  weakness: PropTypes.string,
  favoriteFood: PropTypes.string,
  children: PropTypes.func,
  updateAbout: PropTypes.func.isRequired,
  onSubmitSuccess: PropTypes.func,
};

const mapStateToProps = (state, props) => {
  const about = getUserAboutData(state, props) || {};
  return {
    about: about.about,
    strength: about.strength,
    weakness: about.weakness,
    favoriteFood: about.favoriteFood,
  };
};

const ConnectedAboutFormContainer = compose(
  connect(mapStateToProps, {
    updateAbout: profileActions.updateAbout,
  })
)(AboutFormContainer);

ConnectedAboutFormContainer.propTypes = {
  profileId: PropTypes.string.isRequired,
};

export default ConnectedAboutFormContainer;
