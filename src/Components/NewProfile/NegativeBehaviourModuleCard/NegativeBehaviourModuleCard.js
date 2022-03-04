import React, { useState, useMemo } from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import { connect } from 'react-redux';
import BEMHelper from 'react-bem-helper';
import ModuleCard from '../ModuleCard';

import EditableModuleCard from '../ModuleCard/EditableModuleCard';
import ModuleInfo from './Info';
import ModuleEdit from './Edit';
import { NegativeBehaviourFormContainer } from '../../ProfileForms/NegativeBehaviour';
import useActionOnCondition from '../../../hooks/use-action-on-condition';
import * as profileFormActions from '../../../Actions/action_profile_forms';
import * as optionsSelectors from '../../../selectors/profileFormOptions';
import {
  getIsSelf,
  getAreBehavioursPrivate,
  getUserBehaviours,
  getUserMeasurementUnit,
} from '../../../selectors/profile';

import './NegativeBehaviourModuleCard.scss';

const bem = BEMHelper({
  name: 'ProfileNegativeBehaviourModuleCard',
  outputIsString: true,
});

function NegativeBehaviourModuleCard(props) {
  const {
    className,
    profileId,
    isSelf,
    isPrivate,
    behaviours,
    measurementUnit,
    privacy,
    fetchNegativeBehaviourOptions,
    areNegativeBehaviourOptionsLoaded,
  } = props;
  const [isEditMode, setEditMode] = useState(false);
  useActionOnCondition(
    fetchNegativeBehaviourOptions,
    !areNegativeBehaviourOptionsLoaded
  );
  const cardProps = {
    className: cx(bem(), className),
    icon: 'hand point down outline',
    name: 'Behaviors to Reduce',
    privacy: isPrivate || isSelf ? privacy : '',
  };

  const initialFormValues = useMemo(
    () => ({
      isPublic: !isPrivate,
      behaviours,
      weightUnit: measurementUnit === 'Imperial' ? 'lb' : 'kg',
    }),
    [behaviours, isPrivate, measurementUnit]
  );

  if (isSelf) {
    return (
      <NegativeBehaviourFormContainer
        initialValues={initialFormValues}
        profileId={profileId}
        onSubmitSuccess={() => setEditMode(false)}
      >
        {(form) => (
          <EditableModuleCard
            {...cardProps}
            isEditMode={isEditMode}
            onSetEditMode={setEditMode}
            form={form}
          >
            <EditableModuleCard.InfoContent>
              <ModuleInfo profileId={profileId} />
            </EditableModuleCard.InfoContent>
            <EditableModuleCard.EditContent>
              <ModuleEdit profileId={profileId} form={form} />
            </EditableModuleCard.EditContent>
          </EditableModuleCard>
        )}
      </NegativeBehaviourFormContainer>
    );
  }

  return (
    <ModuleCard {...cardProps}>
      {!isPrivate && <ModuleInfo profileId={profileId} />}
    </ModuleCard>
  );
}

NegativeBehaviourModuleCard.propTypes = {
  className: PropTypes.string,
  profileId: PropTypes.string,
  isSelf: PropTypes.bool,
  behaviours: PropTypes.arrayOf(PropTypes.shape({})),
  isPrivate: PropTypes.bool,
  privacy: PropTypes.string,
  measurementUnit: PropTypes.string,
  fetchNegativeBehaviourOptions: PropTypes.func.isRequired,
  areNegativeBehaviourOptionsLoaded: PropTypes.bool,
};

const mapStateToProps = (state, props) => ({
  isSelf: getIsSelf(state, props),
  isPrivate: getAreBehavioursPrivate(state, props),
  behaviours: getUserBehaviours(state, props) || [],
  measurementUnit: getUserMeasurementUnit(state, props),
  areNegativeBehaviourOptionsLoaded: optionsSelectors.getAreNegativeBehaviourOptionsLoaded(
    state
  ),
});

const ConnectedNegativeBehaviourModuleCard = connect(mapStateToProps, {
  fetchNegativeBehaviourOptions:
    profileFormActions.fetchNegativeBehaviourOptions,
})(NegativeBehaviourModuleCard);

ConnectedNegativeBehaviourModuleCard.propTypes = {
  profileId: PropTypes.string,
};

export default ConnectedNegativeBehaviourModuleCard;
