import React, { useState } from 'react';
import PropTypes from 'prop-types';
import queryString from 'query-string';
import get from 'lodash/get';
import cx from 'classnames';
import { connect } from 'react-redux';
import { Button, Icon } from 'semantic-ui-react';
import BEMHelper from 'react-bem-helper';
import { useModuleCardContext } from '../../ModuleCard/EditableModuleCard';
import EditOccupationModal from '../../EditOccupationModal';
import './OccupationInfo.scss';
import {
  getUserAboutData,
  getUserOccupations,
  getIsSelf,
} from '../../../../selectors/profile';

const bem = BEMHelper({ name: 'ProfileOccupationInfo', outputIsString: true });

function OccupationInfo(props) {
  const {
    occupations = [],
    query,
    currentSchoolYear,
    educationLevel,
    className,
    profileId,
  } = props;
  const [isEditOpen, setEditOpen] = useState(false);
  const openModal = () => setEditOpen(true);
  const closeModal = () => setEditOpen(false);
  const { isEditMode } = useModuleCardContext();
  const blockSection = query && query.section === 'about';
  return (
    <p className={cx(bem(), className)}>
      <strong>Occupation: </strong>
      {occupations.map((occupation, i) => {
        const sep = i < occupations.length - 1 ? ', ' : '';
        if (occupation === 'Student' && currentSchoolYear && educationLevel) {
          return (
            <span key={occupation}>
              {occupation}{' '}
              <span className={bem('student-info')}>
                {`(${currentSchoolYear}, ${educationLevel})`}
              </span>
              {sep}
            </span>
          );
        }

        return <span key={occupation}>{`${occupation}${sep}`}</span>;
      })}
      {(isEditMode || blockSection) && (
        <Button className={bem('edit-btn')} icon onClick={openModal}>
          <Icon name="pencil" color="orange" />
        </Button>
      )}
      <EditOccupationModal
        open={isEditOpen}
        onClose={closeModal}
        profileId={profileId}
      />
    </p>
  );
}

OccupationInfo.propTypes = {
  className: PropTypes.string,
  currentSchoolYear: PropTypes.string,
  educationLevel: PropTypes.string,
  occupations: PropTypes.arrayOf(PropTypes.string),
  profileId: PropTypes.string,
  query: PropTypes.shape(),
};

const mapStateToProps = (state, props) => {
  const about = getUserAboutData(state, props);
  return {
    educationLevel: get(about, 'educationLevel'),
    currentSchoolYear: get(about, 'currentSchoolYear'),
    occupations: getUserOccupations(state, props),
    isSelf: getIsSelf(state, props),
    query: queryString.parse(state.router.location.search),
  };
};

const ConnectedOccupationInfo = connect(mapStateToProps, {})(OccupationInfo);

ConnectedOccupationInfo.propTypes = {
  profileId: PropTypes.string,
};

export default ConnectedOccupationInfo;
