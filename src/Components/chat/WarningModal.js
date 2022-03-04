import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import cx from 'classnames';
import { Button, Modal, Dropdown, Icon, Popup } from 'semantic-ui-react';
import { Link } from 'react-router-dom';
import Avatar from '../Elements/Avatar';
import {
  getUserCategories,
  getUserCategoriesSlot,
  getMyProfileId,
} from '../../selectors/profile';

const WarningModal = ({
  myCategories,
  haveSlots,
  className,
  toggleWarningSlotsPopup,
  toggleWarningBuddyPopup,
  popupTrigger,
  isPopup,
  thread,
  openWarningBuddyPopup,
  openWarningSlotsPopup,
  currentBuddyId,
  open,
  onChangeBuddy,
  onClose,
  activeBuddies,
  buddy,
  onDeclineRequest,
  onAcceptRequest,
}) => {
  const category = currentBuddyId
    ? myCategories.find((e) => e.buddy && e.buddy.id === currentBuddyId)
    : null;
  function onAccept() {
    onAcceptRequest(category);
  }
  function getFromThread(e) {
    return e.id === thread.category.pk;
  }
  function getFromDropdown(e) {
    return e.buddy && e.buddy.id === currentBuddyId;
  }
  function shoulShowWarning() {
    const current = myCategories.find(getFromThread);
    return current && current.buddy;
  }
  const shouldShowBuddyWarning = shoulShowWarning();
  function renderBuddiesWarningButtons() {
    return (
      <Fragment>
        <Button className="decline gmb-primary" onClick={onDeclineRequest}>
          Cancel
        </Button>
        <Button className="gmb-primary" onClick={onAccept}>
          Yes, Switch!
        </Button>
      </Fragment>
    );
  }
  function renderBuddiesSwitch(current) {
    return (
      <div className="buddies flex justify-between">
        <div className="flex flex-col items-center">
          <div className="avatar-container">
            <Avatar avatar={current.buddy.avatar} id={current.buddy.id} />
          </div>
          <span>{current.buddy.name}</span>
        </div>
        <div>
          <Icon name="arrow right" />
        </div>
        <div className="flex flex-col items-center">
          <div className="avatar-container">
            <Avatar avatar={buddy.avatar} id={buddy.id} />
          </div>
          <span>{buddy.name}</span>
        </div>
      </div>
    );
  }
  function renderBuddiesWarningText(current) {
    return (
      <div className="buddies-warning-text">
        <span className="title">Are you sure?</span>
        <div>
          By clicking Become Buddy with{' '}
          <Link to={`/profile/${buddy.id}`}>
            <b>{buddy.name}</b>
          </Link>
          , if they accept, you will immediately be unmatched with{' '}
          <Link to={`/profile/${current.buddy.id}`}>
            <b>{current.buddy.name}</b>
          </Link>{' '}
          in the <b>{current.name}</b> category. Once unmatched, your chat with{' '}
          <Link to={`/profile/${current.buddy.id}`}>
            <b>{current.buddy.name}</b>
          </Link>{' '}
          will disappear, and you will no longer be able to chat with them. You
          may re-request a chat at any time.
        </div>
        <span>
          Do you still want to Buddy up with{' '}
          <Link to={`/profile/${buddy.id}`}>
            <b>{buddy.name.slice(0, buddy.name.length - 1)}</b>
          </Link>
          ?
        </span>
      </div>
    );
  }
  function renderWarningBuddyDesktop() {
    const current = myCategories.find((e) =>
      !currentBuddyId ? getFromThread(e) : getFromDropdown(e)
    );
    if (!current || !current.buddy) return null;
    return (
      <div className="flex flex-col items-center px-8">
        {renderBuddiesWarningText(current)}
        {renderBuddiesSwitch(current)}
        <div className="m-top-10 w-full flex justify-center buttons-actions">
          {renderBuddiesWarningButtons()}
        </div>
      </div>
    );
  }
  function getWarningTexts() {
    if (activeBuddies.length === 4) {
      return {
        title: 'Oops, you have no more Buddy spaces left!',
        subTitle: 'You’re very popular!',
      };
    }
    if (shouldShowBuddyWarning && haveSlots) {
      return {
        title: 'You may have one Buddy per category.',
        subTitle: 'You can:',
      };
    }
    return {
      title: 'Oops, you have no more Buddy spaces left!',
      subTitle: 'You may have one Buddy per category. To get another Buddy:',
    };
  }
  function getLeftChoice() {
    if (activeBuddies.length === 4) {
      return (
        <div className="flex flex-col items-center SlotsWarning__level">
          <span>Invite more buddies to a group</span>
          <p>Stay in touch with everyone.</p>
          <Link to="/new-group">
            <Button color="orange">Create a Group</Button>
          </Link>
        </div>
      );
    }
    if (shouldShowBuddyWarning && haveSlots) {
      return (
        <div className="flex flex-col items-center SlotsWarning__level">
          <span>Request this Buddy in a different category</span>
          <div className="list pl-6">
            <div>1. Visit Buddy’s profile.</div>
            <div>2. Revoke this request.</div>
            <div>3. Send a new request in a different category.</div>
          </div>
          <Link to={`/profile/${buddy.id}`}>
            <Button color="orange">Revoke Request</Button>
          </Link>
        </div>
      );
    }
    return (
      <div className="flex flex-col items-center SlotsWarning__level">
        <span>Level Up</span>
        <p>Reach 50 points in any category.</p>
        <Link to="/plan/new">
          <Button color="orange">Schedule a behavior</Button>
        </Link>
      </div>
    );
  }
  function renderWarningSlotsDesktop() {
    const current = myCategories.find((e) =>
      !currentBuddyId ? getFromThread(e) : getFromDropdown(e)
    );
    const slotFilled = activeBuddies.some((e) => e.name === current.name);
    const buddies = !slotFilled
      ? activeBuddies
      : activeBuddies.filter((e) => e.name === current.name);
    const activeBuddiesOptions = buddies.map((e) => ({
      content: () => (
        <div className="flex items-center">
          <div className="avatar">
            <Avatar avatar={e.buddy.avatar} />
          </div>
          <span className="buddy-name">{e.buddy.name}</span>
        </div>
      ),
      value: e.buddy.id,
      text: e.buddy.name,
    }));
    const { title, subTitle } = getWarningTexts();
    return (
      <div className="SlotsWarning mt-4">
        <h3>{title}</h3>
        <span>{subTitle}</span>
        <div className="flex flex-1 w-full pt-8 pb-4">
          {getLeftChoice()}
          <div className="flex flex-col items-center SlotsWarning__switch justify-between">
            <span>Switch your current Buddy</span>
            <p>Lose your current Buddy!</p>
            <Dropdown
              options={activeBuddiesOptions}
              placeholder="Switch Buddy"
              selection
              selectOnBlur={false}
              onChange={onChangeBuddy}
            />
          </div>
        </div>
      </div>
    );
  }
  function renderModalWarningContent() {
    if (openWarningBuddyPopup) {
      return renderWarningBuddyDesktop();
    }
    if (openWarningSlotsPopup) return renderWarningSlotsDesktop();
    return null;
  }
  function renderWarningBuddyMobile() {
    const current = myCategories.find((e) => e.id === thread.category.pk);
    if (!current || !current.buddy) return null;
    return (
      <div className="will-unmatch">
        <Icon name="close" onClick={toggleWarningBuddyPopup} />
        {renderBuddiesWarningText(current)}
        {renderBuddiesSwitch(current)}
        {renderBuddiesWarningButtons()}
      </div>
    );
  }
  function renderWarningSlotsMobile() {
    return (
      <div className="will-unmatch w-full">
        <Icon name="close" onClick={toggleWarningSlotsPopup} />
        {renderWarningSlotsDesktop()}
      </div>
    );
  }
  if (isPopup) {
    return (
      <Popup
        className={cx(className, { slots: openWarningSlotsPopup })}
        open={open}
        trigger={popupTrigger}
        content={
          openWarningSlotsPopup
            ? renderWarningSlotsMobile()
            : renderWarningBuddyMobile()
        }
        on="click"
      />
    );
  }
  return (
    <Modal
      dimmer="inverted"
      open={open}
      onClose={onClose}
      className={className}
      size="small"
      closeIcon
    >
      <Modal.Content>{renderModalWarningContent()}</Modal.Content>
    </Modal>
  );
};

WarningModal.propTypes = {
  buddy: PropTypes.shape(),
  onDeclineRequest: PropTypes.func,
  onAcceptRequest: PropTypes.func,
  myCategories: PropTypes.arrayOf(PropTypes.shape()),
  activeBuddies: PropTypes.arrayOf(PropTypes.shape()),
  haveSlots: PropTypes.number,
  thread: PropTypes.shape(),
  openWarningBuddyPopup: PropTypes.bool,
  className: PropTypes.string,
  openWarningSlotsPopup: PropTypes.bool,
  currentBuddyId: PropTypes.oneOfType([
    PropTypes.number,
    PropTypes.oneOf([null]),
  ]),
  open: PropTypes.bool,
  onChangeBuddy: PropTypes.func,
  onClose: PropTypes.func,
  popupTrigger: PropTypes.node,
  isPopup: PropTypes.bool,
  toggleWarningSlotsPopup: PropTypes.func,
  toggleWarningBuddyPopup: PropTypes.func,
};

const mapStateToProps = (state) => {
  const myId = getMyProfileId(state);
  const myCategories = getUserCategories(state, { profileId: myId }) || [];
  const availablesSlots = getUserCategoriesSlot(state, { profileId: myId });
  const activeBuddies = myCategories.filter((e) => e.buddy);
  const haveSlots = activeBuddies.length < availablesSlots;
  return {
    myCategories,
    haveSlots,
    activeBuddies,
  };
};

const ConnectedWarningModal = connect(mapStateToProps)(WarningModal);

export default React.memo(ConnectedWarningModal);
