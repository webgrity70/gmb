import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import { compose } from 'redux';
import { Formik } from 'formik';
import { connect } from 'react-redux';
import { getUserPsychologyData } from '../../../../selectors/profile';
import { updateUserPsychology as updateUserPsychologyAction } from '../../../../Actions/actions_profile';
import { withPsychology } from '../../../HoCs';
import { mergePsyco } from '../utils';

function PsychologyFormContainer(props) {
  const {
    children,
    psychology,
    allPsychology,
    profileId,
    updateUserPsychology,
  } = props;
  const psycoList = useMemo(() => mergePsyco(allPsychology, psychology), [
    allPsychology,
    psychology,
  ]);
  return (
    <Formik
      initialValues={{ psychology: psycoList }}
      onSubmit={(values, { setSubmitting }) => {
        setSubmitting(false);
        updateUserPsychology(values, profileId);
      }}
    >
      {children}
    </Formik>
  );
}

PsychologyFormContainer.propTypes = {
  psychology: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string,
      value: PropTypes.number,
      identifier: PropTypes.string,
      minValue: PropTypes.string,
      maxValue: PropTypes.string,
    })
  ),
  children: PropTypes.func,
  profileId: PropTypes.string,
  updateUserPsychology: PropTypes.func,
  allPsychology: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string,
      value: PropTypes.number,
      identifier: PropTypes.string,
      minValue: PropTypes.string,
      maxValue: PropTypes.string,
    })
  ),
};

const mapStateToProps = (state, props) => ({
  psychology: getUserPsychologyData(state, props),
});

const ConnectedPsychologyFormContainer = compose(
  connect(mapStateToProps, { updateUserPsychology: updateUserPsychologyAction })
)(PsychologyFormContainer);

ConnectedPsychologyFormContainer.propTypes = {
  profileId: PropTypes.string,
};

export default withPsychology({ skipLoading: true })(
  ConnectedPsychologyFormContainer
);
