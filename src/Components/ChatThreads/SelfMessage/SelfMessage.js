import React from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import { Feed } from 'semantic-ui-react';
import cx from 'classnames';
import BEMHelper from 'react-bem-helper';
import Avatar from '../../Elements/Avatar';
import TimePassed from '../../Elements/TimePassed';
import './SelfMessage.scss';
import MarkDown from '../../Elements/MarkDown';

const bem = BEMHelper({ name: 'ChatSelfMessage', outputIsString: true });

function SelfMessage({
  message,
  timestamp,
  user,
  className,
  groupPrevious,
  showAvatar,
}) {
  return (
    <div className={cx(bem(), className)}>
      <Feed.Event>
        <Feed.Content className="px-4 flex flex-col items-end">
          {!groupPrevious && (
            <Feed.Summary className="flex w-full items-center justify-end py-2">
              <Feed.Date>
                <TimePassed time={timestamp} />
              </Feed.Date>
              {showAvatar && (
                <Link
                  to={`/profile/${user.id}`}
                  className={bem('user-link', '', 'flex items-center')}
                >
                  <span className="mr-4">You</span>
                  <Feed.Label>
                    <div className={bem('avatar')}>
                      <Avatar avatar={user.avatar} />
                    </div>
                  </Feed.Label>
                </Link>
              )}
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

SelfMessage.defaultProps = {
  showAvatar: true,
};

SelfMessage.propTypes = {
  message: PropTypes.string,
  timestamp: PropTypes.string,
  showAvatar: PropTypes.bool,
  user: PropTypes.shape({}),
  className: PropTypes.string,
  groupPrevious: PropTypes.bool,
};

export default SelfMessage;
