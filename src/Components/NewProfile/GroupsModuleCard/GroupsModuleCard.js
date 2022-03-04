import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { getIsSelf, getAreGroupsPrivate } from '../../../selectors/profile';
import ModuleCard from '../ModuleCard';
import EditableModalModuleCard from '../ModuleCard/EditableModalModuleCard';
import GroupsModuleInfo from './Info';
import GroupsModuleEdit, { baseClass as editableClassName } from './Edit';

const GroupsModuleCard = ({ profileId, isPrivate, isSelf, privacy }) => {
  const cardProps = {
    icon: 'circle outline',
    name: ' Groups',
    privacy: isPrivate || isSelf ? privacy : '',
  };
  if (isSelf) {
    return (
      <EditableModalModuleCard
        {...cardProps}
        modalContent={GroupsModuleEdit}
        modalProps={{ className: editableClassName, profileId }}
      >
        <GroupsModuleInfo profileId={profileId} />
      </EditableModalModuleCard>
    );
  }
  return (
    <ModuleCard {...cardProps}>
      {!isPrivate && <GroupsModuleInfo profileId={profileId} />}
    </ModuleCard>
  );
};

GroupsModuleCard.propTypes = {
  profileId: PropTypes.string,
  isSelf: PropTypes.bool,
  isPrivate: PropTypes.bool,
  privacy: PropTypes.string,
};

const mapStateToProps = (state, props) => ({
  isSelf: getIsSelf(state, props),
  isPrivate: getAreGroupsPrivate(state, props),
});

const ConnectedGroupsModuleCard = connect(
  mapStateToProps,
  {}
)(GroupsModuleCard);

ConnectedGroupsModuleCard.propTypes = {
  profileId: PropTypes.string,
};

export default ConnectedGroupsModuleCard;
