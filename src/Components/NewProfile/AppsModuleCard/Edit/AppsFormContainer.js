import React from 'react';
import PropTypes from 'prop-types';
import { compose } from 'redux';
import { Formik } from 'formik';
import { connect } from 'react-redux';
import { getUserAppsData } from '../../../../selectors/profile';
import { updateUserApps as updateUserAppsAction } from '../../../../Actions/actions_profile';

function AppsFormContainer(props) {
  const { children, apps, profileId, updateUserApps } = props;
  return (
    <Formik
      initialValues={{ apps }}
      onSubmit={(values, { setSubmitting }) => {
        setSubmitting(false);
        updateUserApps(values, profileId);
      }}
    >
      {children}
    </Formik>
  );
}

AppsFormContainer.propTypes = {
  apps: PropTypes.arrayOf(PropTypes.object),
  children: PropTypes.func,
  updateUserApps: PropTypes.func,
  profileId: PropTypes.string,
};

const mapStateToProps = (state, props) => ({
  apps: getUserAppsData(state, props),
});

const ConnectedAppsFormContainer = compose(
  connect(mapStateToProps, { updateUserApps: updateUserAppsAction })
)(AppsFormContainer);

ConnectedAppsFormContainer.propTypes = {
  profileId: PropTypes.string,
};

export default ConnectedAppsFormContainer;
