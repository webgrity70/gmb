import React, { Fragment } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { Button, Icon } from 'semantic-ui-react';
import moment from 'moment';
import Avatar from '../../Elements/Avatar';
import { sentByMe, bem } from './utils';
import * as challengeActions from '../../../Actions/actions_challenges';
import history from '../../../history';

const Invitation = ({
  myId,
  name,
  id,
  status,
  reject,
  type,
  invitedBy,
  invitedUser,
  createdAt,
  closeSidebarFunction,
}) => {
  const key = `${id}-${invitedUser.id}-${invitedBy.id}`;
  const invitationSentByMe = sentByMe({ myId, invitedBy });
  const showActions = invitationSentByMe || status !== 'Pending';
  function acceptInvitation() {
    const url =
      type === 'Flash'
        ? `/challenges/flash/${id}?invitation=${key}`
        : `/challenges/${id}?invitation=${key}`;
    history.push(url);
    closeSidebarFunction();
  }
  function rejectInvitation() {
    reject(id, key);
  }

  return (
    <div className={bem('invitation')}>
      <div className="flex items-center">
        <div className={bem('invitation-avatar')}>
          <Avatar avatar={invitedBy.avatar} />
        </div>
        <div className={bem('invitation-name')}>
          <Link to={`/profile/${invitedBy.id}`}>{invitedBy.name}</Link>
          <span className={bem('invitation-time')}>
            {moment(createdAt).fromNow()}
          </span>
        </div>
      </div>

      {invitationSentByMe ? (
        <Fragment>
          <div className={bem('invitation-text')}>
            You sent an invitation to{' '}
            <Link to={`/profile/${invitedUser.id}`}>{invitedUser.name} </Link>
            to join <Link to={`/challenges/${id}`}>{name}</Link>.
          </div>
        </Fragment>
      ) : (
        <Fragment>
          <div className={bem('invitation-text')}>
            Sent you a invitation to join{' '}
            <Link to={`/challenges/${id}`}>{name}</Link>.
          </div>
        </Fragment>
      )}
      <div className={bem('invitation-divider')} />
      {showActions ? (
        <div className={bem('invitation-status')}>{status}</div>
      ) : (
        <div className={bem('invitation-actions')}>
          <Button onClick={rejectInvitation}>
            <Icon name="times" />
            Decline
          </Button>
          <Button color="orange" onClick={acceptInvitation}>
            <Icon name="check" />
            View Challenge
          </Button>
        </div>
      )}
    </div>
  );
};

Invitation.propTypes = {
  myId: PropTypes.number,
  name: PropTypes.string,
  id: PropTypes.number,
  status: PropTypes.string,
  invitedBy: PropTypes.shape(),
  invitedUser: PropTypes.shape(),
  createdAt: PropTypes.string,
  closeSidebarFunction: PropTypes.func,
  reject: PropTypes.func,
  type: PropTypes.string,
};

const mapDispatchToprops = {
  reject: challengeActions.rejectInvitation,
};

export default connect(null, mapDispatchToprops)(Invitation);
