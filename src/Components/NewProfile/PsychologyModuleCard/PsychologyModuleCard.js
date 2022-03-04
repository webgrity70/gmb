import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { getIsSelf } from '../../../selectors/profile';
import ModuleCard from '../ModuleCard';
import EditableModalModuleCard from '../ModuleCard/EditableModalModuleCard';
import PsychologyModuleInfo from './Info';
import PsychologyModuleEdit, { baseClass as editableClassName } from './Edit';

const PsychologyModuleCard = ({ profileId, isSelf }) => {
  const cardProps = {
    icon: 'heart outline',
    name: 'Psychology',
  };
  if (isSelf) {
    return (
      <EditableModalModuleCard
        {...cardProps}
        modalContent={PsychologyModuleEdit}
        modalProps={{ className: editableClassName, profileId }}
      >
        <PsychologyModuleInfo profileId={profileId} />
      </EditableModalModuleCard>
    );
  }
  return (
    <ModuleCard {...cardProps}>
      <PsychologyModuleInfo profileId={profileId} />
    </ModuleCard>
  );
};

PsychologyModuleCard.propTypes = {
  profileId: PropTypes.string,
  isSelf: PropTypes.bool,
  isPrivate: PropTypes.bool,
  privacy: PropTypes.string,
};

const mapStateToProps = (state, props) => ({
  isSelf: getIsSelf(state, props),
});

const ConnectedPsychologyModuleCard = connect(
  mapStateToProps,
  {}
)(PsychologyModuleCard);

ConnectedPsychologyModuleCard.propTypes = {
  profileId: PropTypes.string,
};

export default ConnectedPsychologyModuleCard;
