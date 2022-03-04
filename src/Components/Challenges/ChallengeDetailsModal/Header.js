import React from 'react';
import { connect } from 'react-redux';
import get from 'lodash/get';
import isEmpty from 'lodash/isEmpty';
import PropTypes from 'prop-types';
import { Icon } from 'semantic-ui-react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCrown } from '@fortawesome/free-solid-svg-icons';
import { bem } from './utils';
import { getChallengeDetails } from '../../../selectors/challenges';
import Avatar from '../../Elements/Avatar';

function CDHeader({
  name,
  imWinner,
  participants,
  myUser,
  manager,
  isFlashChallenge,
}) {
  return (
    <div className={bem('header', { flash: isFlashChallenge })}>
      <div className={bem('header-text')}>
        {isFlashChallenge ? (
          <>
            <div>
              <Icon name="lightning" />
              Flash Challenge:
            </div>
            <div>{name}</div>
          </>
        ) : (
          <div className="relative">
            <div className={bem('avatar')}>
              {!isEmpty(manager) && (
                <Avatar avatar={manager.avatar} id={manager.id} />
              )}
            </div>
            {!isEmpty(manager) && (
              <span className="ml-10">
                {manager.name === myUser.name ? 'You' : manager.name}
              </span>
            )}
          </div>
        )}
      </div>
      <div className="flex flex-wrap ml-0 md:ml-4 mt-1 md:mt-0">
        {imWinner && (
          <div className={bem('winner')}>
            <FontAwesomeIcon icon={faCrown} />
            Winner
          </div>
        )}
        {participants > 0 && (
          <div className={bem('participants', { flash: isFlashChallenge })}>
            {participants} member{participants !== 1 && 's'}
          </div>
        )}
      </div>
    </div>
  );
}

CDHeader.propTypes = {
  name: PropTypes.string,
  imWinner: PropTypes.bool,
  myUser: PropTypes.shape(),
  manager: PropTypes.shape(),
  participants: PropTypes.number,
  isFlashChallenge: PropTypes.bool,
};

const mapStateToProps = (state, { id }) => {
  const details = getChallengeDetails(state, { id });

  return {
    participants: get(details, 'participants', 0),
    manager: get(details, 'challengeManager', {}),
  };
};

export default connect(mapStateToProps)(CDHeader);
