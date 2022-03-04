import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import EditableModalModuleCard from '../ModuleCard/EditableModalModuleCard';
import { getIsSelf } from '../../../selectors/profile';
import ModuleCard from '../ModuleCard';
import AppsModuleInfo from './Info';
import AppsModuleEdit, { baseClass as editableClassName } from './Edit';

const AppsModuleCard = ({ profileId, isSelf }) => {
  const cardProps = {
    icon: 'mobile alternate',
    name: 'Apps',
  };
  if (isSelf) {
    return (
      <EditableModalModuleCard
        {...cardProps}
        modalContent={AppsModuleEdit}
        modalProps={{ className: editableClassName, size: 'large', profileId }}
      >
        <AppsModuleInfo profileId={profileId} />
      </EditableModalModuleCard>
    );
  }
  return (
    <ModuleCard {...cardProps}>
      <AppsModuleInfo profileId={profileId} />
    </ModuleCard>
  );
};

AppsModuleCard.propTypes = {
  profileId: PropTypes.string,
  isSelf: PropTypes.bool,
};

const mapStateToProps = (state, props) => ({
  isSelf: getIsSelf(state, props),
});

const ConnectedAppsModuleCard = connect(mapStateToProps, {})(AppsModuleCard);

ConnectedAppsModuleCard.propTypes = {
  profileId: PropTypes.string,
};

export default ConnectedAppsModuleCard;
