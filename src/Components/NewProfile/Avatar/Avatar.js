import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import cx from 'classnames';
import BEMHelper from 'react-bem-helper';
import CircularProgressBar from '../../Elements/CircularProgressBar';
import Avatar from '../../Elements/Avatar';
import AvatarModal from '../../Profile/AvatarModal';
import * as profileSelectors from '../../../selectors/profile';
import * as profileActions from '../../../Actions/actions_profile';

import './Avatar.scss';

const bem = BEMHelper({ name: 'ProfilePageAvatar', outputIsString: true });

function ProfilePageAvatar(props) {
  const {
    nextLevel = {},
    levelColor,
    isSelf,
    points,
    avatar,
    className,
    fetchUserInfo,
    profileId,
  } = props;
  const [isModalOpen, toggleModal] = useState(false);
  return (
    <>
      <div className={cx(bem(), className)}>
        <CircularProgressBar
          sqSize={210}
          points={points}
          maxPoints={nextLevel.xpRequirement}
          strokeColor={levelColor}
          nextLevel={nextLevel.name}
        >
          <div className={bem('user-avatar')}>
            <Avatar
              avatar={avatar}
              canEdit={isSelf}
              avatarCallback={() => toggleModal(true)}
            />
          </div>
        </CircularProgressBar>
      </div>
      <AvatarModal
        closeModal={() => toggleModal(false)}
        open={isModalOpen}
        onSave={() => fetchUserInfo(profileId)}
        avatar={avatar}
      />
    </>
  );
}

ProfilePageAvatar.propTypes = {
  profileId: PropTypes.string,
  className: PropTypes.string,
  levelColor: PropTypes.string,
  nextLevel: PropTypes.shape({}),
  avatar: PropTypes.shape({}),
  isSelf: PropTypes.bool,
  points: PropTypes.number,
  fetchUserInfo: PropTypes.func.isRequired,
};

const mapStateToProps = (state, props) => {
  const currentLevel = profileSelectors.getUserCurrentLevel(state, props) || {};
  return {
    nextLevel: profileSelectors.getUserNextLevel(state, props) || {},
    levelColor: currentLevel.color,
    points: profileSelectors.getUserScorePoints(state, props),
    avatar: profileSelectors.getUserAvatar(state, props),
    isSelf: profileSelectors.getIsSelf(state, props),
  };
};

const ConnectedProfilePageAvatar = connect(
  mapStateToProps,
  // TODO: Connect to redux for real
  { fetchUserInfo: profileActions.fetchUserInformation }
)(ProfilePageAvatar);

ConnectedProfilePageAvatar.propTypes = {
  profileId: PropTypes.string.isRequired,
};

export default ConnectedProfilePageAvatar;
