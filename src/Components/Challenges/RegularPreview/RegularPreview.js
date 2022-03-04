/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import moment from 'moment-timezone';
import cx from 'classnames';
import { Link } from 'react-router-dom';
import BEMHelper from 'react-bem-helper';
import { Modal, Button, Confirm, Progress, Icon } from 'semantic-ui-react';
import { connect } from 'react-redux';
import Loading from '../../Loading';
import WeeksEvents from '../../Elements/WeeksEvents/WeeksEvents';
import NotificationsModal from '../../NotificationsModal';
import { getChallengeDetails } from '../../../selectors/challenges';
import HowToEarnPoints from '../HowToEarnPoints/HowToEarnPoints';
import * as challengeActions from '../../../Actions/actions_challenges';
import { getMyProfileId } from '../../../selectors/profile';
import JoinModal from '../JoinModal';
import {
  getLoadingJoinRegularChallenge,
  getChallengesDetailsLoading,
} from '../../../selectors/requests';
import history from '../../../history';
import { deletePlan as deletePlanAction } from '../../../Actions/actions_plan';
import './RegularPreview.scss';

export const bem = BEMHelper({ name: 'RegularPreview', outputIsString: true });

function RegularPreview({
  id,
  open,
  loading,
  onClose,
  myUserId,
  challenge,
  deletePlan,
  loadingJoin,
  fetchDetails,
  createAndJoin,
  deleteChallenge,
}) {
  const [openNotificationsModal, setOpenNotificationsModal] = useState(false);
  const [openJoinModal, setOpenJoinModal] = useState(false);
  const [openConfirmDelete, setOpenConfirmDelete] = useState(false);
  const baseModalProps = {
    open,
    onClose: () => onClose(),
    dimmer: 'inverted',
    className: bem(),
    closeOnDimmerClick: false,
    closeIcon: { name: 'close', color: 'grey' },
  };
  useEffect(() => {
    if (id) fetchDetails(id, true);
  }, [id, fetchDetails]);
  if (loading && open) {
    return (
      <Modal {...baseModalProps}>
        <Loading />
      </Modal>
    );
  }
  if (!challenge || !challenge.events || !open)
    return <Modal {...baseModalProps} />;
  const finished = challenge.events.filter((e) =>
    moment(e.date)
      .add(60 + e.duration, 'minutes')
      .isBefore(moment())
  ).length;
  const progress = ((finished / challenge.events.length) * 100).toFixed(0);
  const startMomentDate = moment(challenge.startDate);
  const endMomentDate = moment(challenge.endDate);
  const isStarted = startMomentDate.isBefore(moment());
  const isFinished = endMomentDate.isBefore(moment());
  const startedCondition = challenge.mustJoinBeforeStart && isStarted;
  const shouldShowActions =
    myUserId === challenge.challengeManager.id &&
    challenge.participants === 1 &&
    !isStarted &&
    !isFinished;
  async function onJoin() {
    setOpenJoinModal(false);
    await createAndJoin(
      {
        id,
        name: challenge.name,
        events: challenge.events,
        timezone: challenge.templateTimezone,
        startDate: challenge.startDate,
        templateID: challenge.templateID,
        timezoneRestriction: challenge.timezoneRestriction,
      },
      myUserId
    );
  }
  function onDelete() {
    setOpenConfirmDelete(false);
    if (challenge.planID) deletePlan(challenge.planID, true);
    deleteChallenge(id);
    onClose();
  }
  function onJoinSchedule() {
    history.push(`/schedule-challenge/${id}`);
  }
  function onCloseNotifications(shouldSubmit) {
    if (shouldSubmit) {
      onJoin();
    }
    setOpenNotificationsModal(false);
  }
  return (
    <>
      <Modal {...baseModalProps} id={`challenge-${id}`}>
        <Modal.Content>
          <div className={bem('members')}>{challenge.participants} members</div>
          <div className="flex flex-col items-center">
            <span className={bem('title')}>{challenge.name}</span>
            <div className="text-center mb-4">
              {challenge.challengeManager && (
                <div className={bem('text')}>
                  BY{' '}
                  <Link to={`/profile/${challenge.challengeManager.id}`}>
                    {challenge.challengeManager.name}
                  </Link>
                  {'  '}| {moment(challenge.startDate).format('MMM D')} -{' '}
                  {moment(challenge.endDate).format('MMM D, YYYY')}
                </div>
              )}
              <HowToEarnPoints
                trigger={
                  <span className={bem('details')}>
                    How to earn the most points?
                  </span>
                }
              />
            </div>
          </div>
          <div className={bem('statistics')}>
            <span>{finished} Finished Events </span>
            <span>| {challenge.events.length} Scheduled</span>
          </div>
          <Progress percent={progress} className={bem('progress')} />
          {!!challenge.challengeJoinedDate && (
            <div className={bem('joined')}>
              <div className="text-center md:text-left">
                Joined{' '}
                {moment(challenge.joinedAt).clone().format('MMM D, YYYY')}
              </div>
              <div className="flex justify-between flex-row">
                <Link to={`/challenges/${challenge.id}`}>
                  Go to challenge page
                </Link>
              </div>
            </div>
          )}
          <WeeksEvents
            events={challenge.events}
            showTime={challenge.canChangeTime === 'no'}
            timezone={challenge.templateTimezone}
            timezoneRestriction={challenge.timezoneRestriction}
            className={cx({
              joined: !!challenge.challengeJoinedDate || startedCondition,
            })}
          />
          {!challenge.challengeJoinedDate && !startedCondition && !isFinished && (
            <div className={bem('join')}>
              <div className="flex flex-col items-start flex-1">
                <h5>
                  Want to join this challenge with {challenge.participants}{' '}
                  other member
                  {challenge.participants !== 1 && 's'}?
                </h5>
                <p>
                  By joining this challenge you can chat with other joined
                  members and see when they check in.
                </p>
                <Link to={`/challenges/${id}`}>Go to challenge page</Link>
              </div>
              <div>
                <Button
                  color="orange"
                  onClick={() => setOpenJoinModal(true)}
                  disabled={loadingJoin}
                  loading={loadingJoin}
                >
                  Join Challenge
                </Button>
              </div>
            </div>
          )}
        </Modal.Content>
        {shouldShowActions && (
          <Modal.Actions>
            <div
              className="mx-4 pointer"
              onClick={() => setOpenConfirmDelete(true)}
            >
              <Icon name="trash" color="orange" />
              <span>Delete</span>
            </div>
            <div
              className="pointer"
              onClick={() => history.push(`/edit-challenge/${id}`)}
            >
              <Icon name="pencil" color="orange" />
              <span>Edit</span>
            </div>
          </Modal.Actions>
        )}
        <NotificationsModal
          type="challenge"
          showToast={false}
          open={openNotificationsModal}
          onClose={onCloseNotifications}
        />
        <JoinModal
          open={openJoinModal}
          onClose={() => setOpenJoinModal(false)}
          onJoin={() => setOpenNotificationsModal(true)}
          onJoinSchedule={onJoinSchedule}
          canChangeTime={challenge.canChangeTime}
          canChangeDetails={challenge.canChangeDetails}
          canChangeDuration={challenge.canChangeDuration}
          canChangeLocation={challenge.canChangeLocation}
        />
      </Modal>
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
const mapStateToProps = (state, { id }) => ({
  myUserId: getMyProfileId(state),
  loading: getChallengesDetailsLoading(state),
  challenge: getChallengeDetails(state, { id }),
  loadingJoin: getLoadingJoinRegularChallenge(state),
});

RegularPreview.propTypes = {
  id: PropTypes.number,
  open: PropTypes.bool,
  onClose: PropTypes.func,
  loading: PropTypes.bool,
  myUserId: PropTypes.number,
  deletePlan: PropTypes.func,
  loadingJoin: PropTypes.bool,
  challenge: PropTypes.shape(),
  fetchDetails: PropTypes.func,
  createAndJoin: PropTypes.func,
  deleteChallenge: PropTypes.func,
};

export default connect(mapStateToProps, {
  deletePlan: deletePlanAction,
  fetchDetails: challengeActions.fetchChallengeDetails,
  createAndJoin: challengeActions.createPlanJoinRegularChallenge,
  deleteChallenge: challengeActions.deleteChallenge,
})(RegularPreview);
