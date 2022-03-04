import React from 'react';
import { withRouter } from 'react-router-dom';
import { compose } from 'recompose';
import queryString from 'query-string';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import cx from 'classnames';
import BEMHelper from 'react-bem-helper';
import EditableModalModuleCard from '../ModuleCard/EditableModalModuleCard';
import {
  getIsSelf,
  isMeetingPreferenceCompleted,
} from '../../../selectors/profile';
import ModuleCard from '../ModuleCard';
import PreferencesModuleInfo from './Info';
import PreferencesModuleEdit from './Edit';
import './PreferencesModuleCard.scss';

const bem = BEMHelper({ name: 'PreferencesModuleCard', outputIsString: true });

const PreferencesModuleCard = ({
  query,
  push,
  location,
  profileId,
  incomplete,
  isSelf,
}) => {
  const cardProps = {
    icon: 'group',
    name: 'Buddy Preferences',
    className: cx(bem(), { incomplete: incomplete && isSelf }),
  };
  if (isSelf) {
    const blockSection = query && query.section === 'preferences';
    const modalProps = {
      profileId,
      size: 'small',
      ...(blockSection && {
        closeIcon: null,
        closeOnDimmerClick: false,
        closeOnDocumentClick: false,
      }),
    };
    return (
      <EditableModalModuleCard
        {...cardProps}
        triggerEditId="preferences-btn"
        modalContent={({ closeModal }) => {
          function onCloseModal(params) {
            closeModal(params);
            if (blockSection) push(`${location.pathname}?section=about`);
          }
          return (
            <PreferencesModuleEdit
              closeModal={onCloseModal}
              profileId={profileId}
              blockClose={blockSection}
            />
          );
        }}
        modalProps={modalProps}
      >
        <PreferencesModuleInfo profileId={profileId} />
      </EditableModalModuleCard>
    );
  }
  return (
    <ModuleCard {...cardProps}>
      <PreferencesModuleInfo profileId={profileId} />
    </ModuleCard>
  );
};

PreferencesModuleCard.propTypes = {
  profileId: PropTypes.string,
  isSelf: PropTypes.bool,
  query: PropTypes.shape({}),
  location: PropTypes.shape({}),
  push: PropTypes.func,
};

const mapStateToProps = (state, props) => ({
  isSelf: getIsSelf(state, props),
  incomplete: !isMeetingPreferenceCompleted(state, props),
  query: queryString.parse(props.history.location.search),
  push: props.history.push,
  location: props.history.location,
});

PreferencesModuleCard.propTypes = {
  profileId: PropTypes.string.isRequired,
  incomplete: PropTypes.bool,
};

export default compose(
  withRouter,
  connect(mapStateToProps)
)(PreferencesModuleCard);
