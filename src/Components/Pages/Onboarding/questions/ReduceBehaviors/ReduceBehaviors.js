import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import NegativeBehaviour from '../../../../ProfileForms/NegativeBehaviour/NegativeBehaviour';
import useActionOnCondition from '../../../../../hooks/use-action-on-condition';
import Loading from '../../../../Loading';
import * as profileFormActions from '../../../../../Actions/action_profile_forms';
import * as optionsSelectors from '../../../../../selectors/profileFormOptions';
import './ReduceBehaviors.scss';

const ReduceBehaviors = ({
  value,
  onChange,
  behaviours,
  fetchNegativeBehaviourOptions,
  areNegativeBehaviourOptionsLoaded,
}) => {
  useActionOnCondition(
    fetchNegativeBehaviourOptions,
    !areNegativeBehaviourOptionsLoaded
  );
  if (!value && behaviours.length === 0) return <Loading />;
  if (!value && behaviours.length > 0) {
    onChange({
      behaviours: behaviours.reduce(
        (prev, current) => ({
          ...prev,
          ...(current.name !== 'Lose Weight' && { [current.name]: false }),
        }),
        {}
      ),
      specialBehaviours: {},
      weightUnit: 'lb',
    });
    return null;
  }
  function onChangeHabit(path, val) {
    const paths = path.split('.');
    const newValue = { ...value };
    if (paths.length > 1) newValue[paths[0]][paths[1]] = val;
    else newValue[path] = val;
    onChange(newValue);
  }
  return (
    <NegativeBehaviour
      showPrivacy={false}
      form={{
        values: value,
        setFieldValue: onChangeHabit,
      }}
      className="SignupReduceBehaviors"
    />
  );
};

ReduceBehaviors.propTypes = {
  fetchNegativeBehaviourOptions: PropTypes.func.isRequired,
  areNegativeBehaviourOptionsLoaded: PropTypes.bool,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.shape({})]),
  onChange: PropTypes.func,
  behaviours: PropTypes.arrayOf(PropTypes.shape({})),
};

const mapStateToProps = (state) => ({
  areNegativeBehaviourOptionsLoaded: optionsSelectors.getAreNegativeBehaviourOptionsLoaded(
    state
  ),
  behaviours: optionsSelectors.getNegativeBehaviourOptions(state) || [],
});

const ConnectedNegativeBehaviour = connect(mapStateToProps, {
  fetchNegativeBehaviourOptions:
    profileFormActions.fetchNegativeBehaviourOptions,
})(ReduceBehaviors);

export default ConnectedNegativeBehaviour;
