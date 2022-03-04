/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import React from 'react';
import { connect } from 'react-redux';
import { Icon, Label } from 'semantic-ui-react';
import * as groupChatActions from '../../Actions/action_group_chat';

const SideBarIcon = ({
  count,
  openSideBar,
  mode,
  icon,
  isNew,
  divider,
  activeMode,
  selectThread,
}) => {
  const isActive = activeMode === mode;
  return (
    <React.Fragment>
      {isActive && (
        <div
          className="clickable"
          onClick={() => [openSideBar(undefined), selectThread()]}
        >
          <Icon className="times" />
        </div>
      )}

      {!isActive && (
        <div className="clickable" onClick={() => openSideBar(mode)}>
          {count > 0 && <Label className="count-badge"> {count} </Label>}
          <Icon className={`${icon} ${isNew ? 'new' : ''}`} />
        </div>
      )}
      {divider && <div className="divider" />}
    </React.Fragment>
  );
};

export default connect(null, { selectThread: groupChatActions.selectThread })(
  SideBarIcon
);
