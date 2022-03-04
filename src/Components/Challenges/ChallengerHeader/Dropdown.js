import React, { useState } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Icon, Confirm } from 'semantic-ui-react';
import { bem } from './utils';
import Dropdown from '../../Elements/Dropdown';
import {
  deletePlan as deletePlanAction,
  deleteTemplate as deleteTemplateAction,
} from '../../../Actions/actions_plan';
import * as challengeActions from '../../../Actions/actions_challenges';
import { selectThread as selectThreadAction } from '../../../Actions/action_chat';
import { contactOwner as contactOwnerAction } from '../../../Actions/actions_challenges_chat';
import history from '../../../history';

function HeaderDropdown({
  id,
  planId,
  userId,
  isOwner,
  isEmpty,
  isMember,
  hasManager,
  hasStarted,
  deletePlan,
  templateID,
  contactOwner,
  selectThread,
  leaveChallenge,
  deleteTemplate,
  deleteChallenge,
  ...props
}) {
  const [openConfirmDelete, setOpenConfirmDelete] = useState(false);
  function onLeave() {
    if (planId) deletePlan(planId, true, true);
    leaveChallenge(id, isOwner);
  }
  async function onDelete() {
    setOpenConfirmDelete(false);
    if (planId) deletePlan(planId, true, true);
    await deleteChallenge(id);
    deleteTemplate(templateID, true);
  }
  async function onContactOwner() {
    try {
      const { thread } = await contactOwner({ challengeId: id, userId });
      if (thread) selectThread({ threadId: thread });
    } catch (e) {
      console.log(e);
    }
  }
  const options = [];
  const contactOwnerOpt = {
    text: 'Contact Owner',
    onClick: onContactOwner,
    icon: <Icon name="comment" />,
  };
  if (isOwner || isMember) {
    options.push({
      text: 'Leave Challenge',
      onClick: onLeave,
      icon: <Icon name="sign-out" />,
    });
  }
  if (isOwner) {
    if (!hasStarted && isEmpty) {
      options.push({
        text: 'Edit Challenge',
        icon: <Icon name="pencil" />,
        onClick: () => history.push(`/edit-challenge/${id}`),
      });
    }
    options.push({
      text: 'Delete Challenge',
      icon: <Icon name="sign-out" />,
      onClick: () => setOpenConfirmDelete(true),
    });
    /*
    if (hasStarted && isEmpty) {
      options.push({
        text: 'Leave Challenge',
        onClick: onLeave,
        icon: <Icon name="sign-out" />,
      });
    } else {
      options.push({
        text: 'Delete Challenge',
        icon: <Icon name="sign-out" />,
        onClick: () => setOpenConfirmDelete(true),
      });
    } */
  } else if (hasManager) {
    options.push(contactOwnerOpt);
  }

  return (
    <>
      <Dropdown options={options} {...props} />
      <Confirm
        open={openConfirmDelete}
        content="Are you sure you want delete this challenge?"
        confirmButton="Yes, I’m sure"
        onCancel={() => setOpenConfirmDelete(false)}
        className={bem('confirm')}
        onConfirm={onDelete}
      />
    </>
  );
}

HeaderDropdown.propTypes = {
  id: PropTypes.number,
  isEmpty: PropTypes.bool,
  userId: PropTypes.number,
  planId: PropTypes.number,
  isOwner: PropTypes.bool,
  isMember: PropTypes.bool,
  hasManager: PropTypes.bool,
  hasStarted: PropTypes.bool,
  deletePlan: PropTypes.func,
  templateID: PropTypes.number,
  contactOwner: PropTypes.func,
  selectThread: PropTypes.func,
  deleteTemplate: PropTypes.func,
  leaveChallenge: PropTypes.func,
  deleteChallenge: PropTypes.func,
};

export default connect(null, {
  deletePlan: deletePlanAction,
  contactOwner: contactOwnerAction,
  selectThread: selectThreadAction,
  leaveChallenge: challengeActions.leaveChallenge,
  deleteChallenge: challengeActions.deleteChallenge,
  deleteTemplate: deleteTemplateAction,
})(HeaderDropdown);
