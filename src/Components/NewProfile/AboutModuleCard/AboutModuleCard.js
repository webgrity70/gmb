import React, { useState } from 'react';
import { withRouter } from 'react-router-dom';
import { compose } from 'recompose';
import queryString from 'query-string';
import PropTypes from 'prop-types';
import cx from 'classnames';
import { connect } from 'react-redux';
import BEMHelper from 'react-bem-helper';
import ModuleCard from '../ModuleCard';
import EditableModuleCard from '../ModuleCard/EditableModuleCard';
import AboutModuleInfo from './Info';
import AboutModuleEdit from './Edit';
import AboutFormContainer from './Edit/AboutFormContainer';

import './AboutModuleCard.scss';
import { getIsSelf, isAboutModuleComplete } from '../../../selectors/profile';
import EditModal from './EditModal';

const bem = BEMHelper({ name: 'ProfileAboutModuleCard', outputIsString: true });

function AboutModuleCard(props) {
  const { className, query, profileId, canEdit, incomplete } = props;
  const [isEditMode, setEditMode] = useState(false);
  const cardProps = {
    className: cx(bem(), className, {
      incomplete: incomplete && canEdit,
    }),
    icon: 'user',
    name: 'About',
  };
  const blockSection = query && query.section === 'about';
  if (blockSection) {
    return <EditModal profileId={profileId} />;
  }
  if (canEdit) {
    return (
      <AboutFormContainer
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
              <AboutModuleInfo profileId={profileId} />
            </EditableModuleCard.InfoContent>
            <EditableModuleCard.EditContent>
              <AboutModuleEdit profileId={profileId} form={form} />
            </EditableModuleCard.EditContent>
          </EditableModuleCard>
        )}
      </AboutFormContainer>
    );
  }

  return (
    <ModuleCard {...cardProps}>
      <AboutModuleInfo profileId={profileId} />
    </ModuleCard>
  );
}

AboutModuleCard.propTypes = {
  className: PropTypes.string,
  profileId: PropTypes.string,
  canEdit: PropTypes.bool,
  incomplete: PropTypes.bool,
  query: PropTypes.shape({}),
  location: PropTypes.shape({}),
  push: PropTypes.func,
};

const mapStateToProps = (state, props) => ({
  canEdit: getIsSelf(state, props),
  incomplete: !isAboutModuleComplete(state, props),
  query: queryString.parse(props.history.location.search),
});

export default compose(withRouter, connect(mapStateToProps))(AboutModuleCard);
