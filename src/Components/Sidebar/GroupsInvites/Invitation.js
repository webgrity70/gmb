import React, { Fragment } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { Button, Icon } from 'semantic-ui-react';
import moment from 'moment';
import Avatar from '../../Elements/Avatar';
import { bem } from './index';
import { sentByMe } from './utils';
import * as groupActions from '../../../Actions/actions_groups';

const Invitation = ({
  myId,
  name,
  id,
  status,
  accept,
  reject,
  invitedBy,
  invitedUser,
  createdAt,
}) => {
  const key = `${id}-${invitedUser.id}-${invitedBy.id}`;
  const invitationSentByMe = sentByMe({ myId, invitedBy });
  const showActions = invitationSentByMe || status !== 'Pending';
  const acceptInvitation = () => accept(id, key);
  const rejectInvitation = () => reject(id, key);

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
            to join <Link to={`/groups/${id}`}>{name}</Link>.
          </div>
        </Fragment>
      ) : (
        <Fragment>
          <div className={bem('invitation-text')}>
            Sent you a invitation to join{' '}
            <Link to={`/groups/${id}`}>{name}</Link>.
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
            Accept
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
  accept: PropTypes.func,
  reject: PropTypes.func,
};

const mapDispatchToprops = {
  accept: groupActions.acceptInvitation,
  reject: groupActions.rejectInvitation,
};

export default connect(null, mapDispatchToprops)(Invitation);
