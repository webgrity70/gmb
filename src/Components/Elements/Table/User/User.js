import React, { useCallback } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Icon } from 'semantic-ui-react';
import { Link } from 'react-router-dom';
import BEMHelper from 'react-bem-helper';
import Avatar from '../../Avatar';
import first from '../../../../Assets/images/badget-1.png';
import second from '../../../../Assets/images/badget-2.png';
import thrid from '../../../../Assets/images/badget-3.png';
import { contactMember as contactMemberAction } from '../../../../Actions/actions_groups';
import { selectThread as selectThreadAction } from '../../../../Actions/action_chat';
import { getMyProfileId } from '../../../../selectors/profile';
import './User.scss';

const badgets = {
  1: first,
  2: second,
  3: thrid,
};

const bem = BEMHelper({ name: 'TableUser', outputIsString: true });

const UserColumn = ({
  groupId,
  avatar,
  userId,
  userName,
  gender,
  age,
  userLocation,
  selectThread,
  rank,
  canOpenChat,
  isPrivate,
  hasPermission,
  contactMember,
}) => {
  const privateHasPermission = isPrivate && hasPermission;
  const permissionToShow = !isPrivate || privateHasPermission;

  const openChat = useCallback(async () => {
    try {
      const { thread } = await contactMember({ userId, groupId });
      if (thread) selectThread({ threadId: thread });
    } catch (e) {
      console.log(e);
    }
  }, [contactMember, userId, groupId]);
  return (
    <div className={bem()}>
      {rank !== undefined && (
        <div className="ml-4 mr-8">
          {rank <= 3 && (
            <img
              src={badgets[rank]}
              alt={`user-rank-${rank}`}
              className={bem('badge')}
            />
          )}
          {(!rank || rank > 3) && (
            <div className={bem('rank')}>{rank || '-'}</div>
          )}
        </div>
      )}
      <div className="avatar">
        <Avatar avatar={avatar} {...(permissionToShow && { id: userId })} />
      </div>
      <div className={bem('description')}>
        {permissionToShow ? (
          <Link to={`/profile/${userId}`}>{userName}</Link>
        ) : (
          <div className={bem('private-user')}>{userName}</div>
        )}
        <div>
          <span>
            {gender}
            {gender && age && permissionToShow && ','} {permissionToShow && age}
          </span>
        </div>
      </div>
      <div className="flex flex-col ml-4">
        <div
          className={bem('chat')}
          {...(canOpenChat && { onClick: openChat })}
        >
          {canOpenChat ? (
            <>
              <Icon name="comment" />
              <span>Open Chat</span>
            </>
          ) : (
            <span />
          )}
        </div>
        <span>{userLocation}</span>
      </div>
    </div>
  );
};

UserColumn.propTypes = {
  avatar: PropTypes.shape(),
  userId: PropTypes.number,
  contactMember: PropTypes.func,
  userName: PropTypes.string,
  groupId: PropTypes.number,
  selectThread: PropTypes.func,
  canOpenChat: PropTypes.bool,
  isPrivate: PropTypes.bool,
  hasPermission: PropTypes.bool,
  age: PropTypes.number,
  gender: PropTypes.oneOfType([PropTypes.string, PropTypes.oneOf([null])]),
  userLocation: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.oneOf([null]),
  ]),
};

const mapStateToProps = (state, { isAdmin, userId }) => {
  const myId = getMyProfileId(state);
  return {
    canOpenChat: isAdmin && userId !== myId,
  };
};

export default connect(mapStateToProps, {
  contactMember: contactMemberAction,
  selectThread: selectThreadAction,
})(UserColumn);
