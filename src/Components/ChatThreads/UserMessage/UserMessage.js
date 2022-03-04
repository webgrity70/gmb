import React from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import cx from 'classnames';
import { Feed } from 'semantic-ui-react';
import BEMHelper from 'react-bem-helper';
import Avatar from '../../Elements/Avatar';
import TimePassed from '../../Elements/TimePassed';

import './UserMessage.scss';
import MarkDown from '../../Elements/MarkDown';

const bem = BEMHelper({ name: 'ChatUserMessage', outputIsString: true });

function UserMessage({ message, timestamp, user, className, groupPrevious }) {
  return (
    <div className={cx(bem(), className)}>
      <Feed.Event>
        <Feed.Content className="px-4">
          {!groupPrevious && (
            <Feed.Summary className="flex items-center py-2">
              <Link
                to={`/profile/${user.id}`}
                className={bem('user-link', '', 'flex items-center')}
              >
                <Feed.Label>
                  <div className={bem('avatar')}>
                    <div>
                      <Avatar avatar={user.avatar} />
                    </div>
                    {/* user.lastOnline === null && <div className={bem('online')} /> */}
                  </div>
                </Feed.Label>
                <span className="ml-4">{user.name}</span>
              </Link>
              <Feed.Date>
                <TimePassed time={timestamp} />
              </Feed.Date>
            </Feed.Summary>
          )}
          <Feed.Extra className={bem('message')} text>
            <MarkDown source={message} basic />
          </Feed.Extra>
        </Feed.Content>
      </Feed.Event>
    </div>
  );
}

UserMessage.propTypes = {
  message: PropTypes.string,
  timestamp: PropTypes.string,
  user: PropTypes.shape(),
  className: PropTypes.string,
  groupPrevious: PropTypes.bool,
};

export default UserMessage;
