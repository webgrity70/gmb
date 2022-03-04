import React from 'react';
import PropTypes from 'prop-types';
import { compose } from 'redux';
import { connect } from 'react-redux';
import cx from 'classnames';
import BEMHelper from 'react-bem-helper';
import NegativeBehaviourForm from '../../../ProfileForms/NegativeBehaviour';

import './NegativeBehaviourModuleEdit.scss';

const bem = BEMHelper({
  name: 'ProfileNegativeBehaviourModuleEdit',
  outputIsString: true,
});

function NegativeBehaviourModuleEdit(props) {
  const { className, profileId, form } = props;

  return (
    <div className={cx(bem(), className, 'px-2')}>
      <NegativeBehaviourForm profileId={profileId} form={form} />
    </div>
  );
}

NegativeBehaviourModuleEdit.propTypes = {
  className: PropTypes.string,
  profileId: PropTypes.string,
  form: PropTypes.shape({
    values: PropTypes.shape({}),
    setFieldValue: PropTypes.func,
  }),
};

const mapStateToProps = () => ({});

const ConnectedNegativeBehaviourModuleEdit = compose(
  connect(mapStateToProps, {})
)(NegativeBehaviourModuleEdit);

ConnectedNegativeBehaviourModuleEdit.propTypes = {
  profileId: PropTypes.string.isRequired,
};

export default ConnectedNegativeBehaviourModuleEdit;
