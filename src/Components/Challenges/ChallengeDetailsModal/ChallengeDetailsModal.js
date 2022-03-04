/* eslint-disable jsx-a11y/anchor-is-valid */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable no-underscore-dangle */
import React, { useContext, useEffect, useState, useMemo } from 'react';
import { connect } from 'react-redux';
import moment from 'moment';
import { Link } from 'react-router-dom';
import groupBy from 'lodash/groupBy';
import { toast } from 'react-toastify';
import cx from 'classnames';
import { Modal, Button, Loader, Icon } from 'semantic-ui-react';
import PlanContext from '../../Plan/PlanContext';
import parseTimeFormat from '../../../utils/parseTimeFormat';
import {
  getTotalPoints,
  getSlug,
  parseMinutesToTimeShort,
} from '../../NewPlan/utils';
import { CategoryIcon } from '../../Elements/CategoriesIcons';
import MarkDown from '../../Elements/MarkDown';
import MediaModal from '../../Elements/MediaModal';
import history from '../../../history';
import {
  bem,
  propTypes,
  getDateStatuses,
  mapStateToProps,
  mapDispatchToProps,
} from './utils';
import Intentions from './Intentions';
import InviteModal from '../InviteModal';
import Header from './Header';
import Details from './Details';
import Footer from './Footer';
import './ChallengeDetailsModal.scss';
import truncate from 'truncate-html';
import { Fragment } from 'react';
import orderBy from 'lodash/orderBy';
function ChallengeDetailsModal({
  id,
  open,
  onOpen,
  myUser,
  onClose,
  trigger,
  checkins,
  openChat,
  pathname,
  challenge,
  userOwner,
  deletePlan,
  loadingJoin,
  loadingLeave,
  confirmations,
  members,
  leaveChallenge,
  fetchChallengeDetails,
  fetchChallengeCheckins,
  fetchChallengeMembers,
  createPlanJoinFlashChallenge,
  fetchChallengeConfirmations,
}) {
  const [openMediaModal, setOpenMediaModal] = useState(false);
  const [mediaData, setMediaData] = useState('');
  const setMediaModal = (value) => {
    setMediaData(value);
    setOpenMediaModal(true);
  };

  const { timeFormat } = useContext(PlanContext);
  const [openInviteModal, setInviteModalOpen] = useState(false);
  const date = moment(challenge.date);
  const { isStarted, isConfirmationStarted, isFinished } = getDateStatuses({
    date,
    duration: challenge.duration,
  });

  const myConfirmation =
    confirmations && confirmations.find((e) => e.userID === myUser.pk);
  const myCheckin = checkins && checkins.find((e) => e.userID === myUser.pk);
  const _isJoinedFallback =
    confirmations && confirmations.some((e) => e.userID === myUser.pk);
  const isJoined = !!challenge.joinedAt || _isJoinedFallback;
  const checkinWindowEndFinished = moment(challenge.checkInWindowEnd).isBefore(
    moment()
  );

  const checkInValue = useMemo(() => {
    if (myCheckin && isStarted) {
      if (myCheckin.value === null && !checkinWindowEndFinished)
        return 'Waiting';
      return myCheckin.value ? 'Yes' : 'No';
    }
    return null;
  }, [myCheckin, isStarted]);

  const confirmationInValue = useMemo(() => {
    if (myConfirmation) {
      if (myConfirmation.value) return myConfirmation.value ? 'Yes' : 'No';
      return isStarted ? '' : 'Waiting';
    }
    return null;
  }, [myConfirmation, isStarted]);

  const usersWinners = useMemo(() => {
    if (!open || !checkins || !confirmations || challenge.participants === 1)
      return [];

    const missingConfirmation = confirmations.some((e) => e.value === null);
    const missingCheckin = checkins.some((e) => {
      const confirmedYes = confirmations.some(
        (c) => c.value && c.userID === e.userID
      );
      return e.value === null && confirmedYes;
    });

    const someoneMissing = missingConfirmation || missingCheckin;
    if (someoneMissing && !checkinWindowEndFinished) return [];

    const usersScores = checkins.map((e) => {
      const userConfirmation = confirmations.find((c) => c.userID === e.userID);
      const confirmationXp = userConfirmation ? userConfirmation.xp : 0;

      return {
        userID: e.userID,
        userName: e.userName,
        points: e.xp + confirmationXp,
      };
    });

    const byPoints = groupBy(usersScores, 'points');
    const winnerKey = Object.keys(byPoints).pop();

    return winnerKey && Number(winnerKey) > 0 ? byPoints[winnerKey] : [];
  }, [open, checkins, confirmations]);

  const imWinner =
    usersWinners && usersWinners.some((e) => e.userID === myUser.pk);

  const winnersLabel = (() => {
    if (imWinner) {
      if (usersWinners.length > 1) {
        return `You and ${usersWinners.length - 1} other${
          usersWinners.length - 1 === 1 ? '' : 's'
        }`;
      }
      return 'You';
    }
    return usersWinners.length;
  })();

  useEffect(() => {
    if (open && isJoined) fetchChallengeConfirmations(id, challenge.templateID);
  }, [open, id, challenge.templateID, isJoined, fetchChallengeConfirmations]);

  useEffect(() => {
    if (open && isJoined) {
      fetchChallengeCheckins(id, challenge.templateID, !isJoined);
    }
  }, [open, id, challenge.templateID, isJoined, fetchChallengeCheckins]);

  useEffect(() => {
    if (open && challenge.type !== 'Flash') fetchChallengeDetails(id);
  }, [open, id, fetchChallengeDetails, challenge.type]);

  useEffect(() => {
    // only load full member list if not started yet, we dont need it after
    if (fetchChallengeMembers && open && !isStarted) {
      fetchChallengeMembers(id);
    }
  }, [open, id, isStarted, fetchChallengeMembers]);

  /*  // fake some member data after load
  const alphabet = `ABCDEFGHIJKLMNOPQRSTUVWXYZ`.split( '' );
  useEffect( () => {
    if( members && members.length === 1 ){

      // add some fake members for testing
      const numToAdd = 50;
      for( let i = 0; i < numToAdd; i++ ){
        members.push( {
          name: '1234512345'.split( '' )
            .map( () => alphabet[ Math.trunc( Math.random() * alphabet.length )])
            .join( '' ),
          id: Math.trunc( Math.random() * 12000 )
        })
      }
    }
  }, [members] );

  // if members list populated, sort by name
  if( members && members.length > 1 ){

    members.sort( ( a,b ) => a.name.localeCompare( b.name ) );
  }

  // fake some confirmation data after load
  useEffect( () => {
    if( confirmations && confirmations.length === 1 ){
      // add some fake members for testing

      const numToAdd = 50;
      for( let i = 0; i < numToAdd; i++ ){
        confirmations.push( {
          ...confirmations[ 0 ],
          userID: Math.trunc( Math.random() * 1000 ),
          userName: '1234512345'.split( '' ).map( () => alphabet[ Math.trunc( Math.random() * alphabet.length )]).join( '' )
        } );
      }
    }
  }, [ confirmations ] );

  // fake some confirmation data after load
  useEffect( () => {

    if( checkins && checkins.length === 1 ){

      const numToAdd = 50;
      for( let i = 0; i < numToAdd; i++ ){
        checkins.push( {
          ...checkins[ 0 ],
          userID: Math.trunc( Math.random() * 1000 ),
          userName: '1234512345'.split( '' ).map( () => alphabet[ Math.trunc( Math.random() * alphabet.length )]).join( '' ),
          date: moment().clone().add( Math.trunc( Math.random() * -120 ), 'minutes' )
        })
      }
    }
  }, [ checkins ] );
 */

  const isFlashChallenge = !challenge.type || challenge.type === 'Flash';
  const baseModalProps = {
    open,
    onClose: () => onClose(),
    onOpen,
    trigger,
    dimmer: 'inverted',
    closeOnDimmerClick: false,
    className: bem('', { flash: isFlashChallenge }),
    closeIcon: { name: 'close', color: 'grey' },
  };

  if (!open || !challenge) {
    return <Modal {...baseModalProps} />;
  }

  const hasInteracted =
    checkInValue === 'yes' ||
    checkInValue === 'no' ||
    confirmationInValue === 'no' ||
    confirmationInValue === 'yes';

  const intentionsLoaded = !!confirmations && !!checkins;
  const loaded = intentionsLoaded || !isJoined;

  const isMyChallenge =
    challenge.challengeManager && challenge.challengeManager.id === myUser.pk;

  const shouldShowIntentionsOnCompleted =
    (myConfirmation && myConfirmation.value !== null) ||
    (myCheckin && myCheckin.value !== null);

  const shouldShowIntentionsOnEnd =
    checkinWindowEndFinished && !!myConfirmation && !!myCheckin;

  const shouldShowTotal =
    shouldShowIntentionsOnCompleted || shouldShowIntentionsOnEnd;

  const startDateFormatted = date
    .clone()
    .format(parseTimeFormat(timeFormat, challenge.date))
    .toUpperCase();

  function onJoin() {
    if (isFinished)
      toast.error('You just missed it! This challenge has already begun.');
    else {
      const {
        location: { search },
      } = window;
      const skipJoin = search.includes('invitation');
      createPlanJoinFlashChallenge(challenge, myUser, skipJoin);
    }
  }

  function onCheckIn() {
    const url = `/dashboard/check-in/${challenge.eventId}`;
    if (url !== pathname) {
      history.push(url);
    } else {
      onClose();
    }
  }

  async function onLeave() {
    if (challenge.planId) deletePlan(challenge.planId, true, true);
    await leaveChallenge(id);
    onClose(true);
    /* if (!isMyChallenge) {
      await leaveChallenge(id);
      onClose(true);
    } else {
      toast.success('Successfully left Challenge.');
      onClose(true);
    } */
  }

  function onOpenChat() {
    onClose();
    openChat(id);
  }

  const baseIntentionProps = {
    myUser,
    onCheckIn,
    isStarted,
    isFinished,
    timeFormat,
    isFlashChallenge,
    checkinWindowEndFinished,
    category: challenge.category,
    checkInWindowEnd: challenge.checkInWindowEnd.format(),
    usersWinners: usersWinners.map((e) => e.userID),
  };

  const hasConfirmations = (confirmations || []).some((e) => e.value !== null);

  return (
    <>
      <MediaModal
        open={openMediaModal}
        onClose={() => setOpenMediaModal(false)}
        mediaData={mediaData}
      />
      <Modal {...baseModalProps} id={`challenge-${id}`}>
        <Modal.Content>
          <Header
            id={id}
            myUser={myUser}
            imWinner={imWinner}
            name={challenge.name}
            isFlashChallenge={isFlashChallenge}
          />

          <div className={bem('title-container', { flash: isFlashChallenge })}>
            <CategoryIcon
              slug={getSlug(challenge.category)}
              name={challenge.category}
              colorNoCircle
            />
            <span className={bem('title')}>
              {challenge.habit} for{' '}
              {parseMinutesToTimeShort(challenge.duration)}
            </span>
            {shouldShowTotal && (
              <span
                className={bem('points', [
                  getSlug(challenge.category),
                  'total',
                ])}
              >
                +
                {getTotalPoints({
                  checkInPoints: (myCheckin && myCheckin.xp) || 0,
                  intentionPoints: (myConfirmation && myConfirmation.xp) || 0,
                  milestonePoints: challenge.milestonePoints || 0,
                })}
              </span>
            )}
          </div>

          <Details
            date={date}
            loaded={loaded}
            onClose={onClose}
            isJoined={isJoined}
            userOwner={userOwner}
            timeFormat={timeFormat}
            isMyChallenge={isMyChallenge}
            duration={challenge.duration}
            checkInWindowEnd={challenge.checkInWindowEnd}
            startDateFormatted={startDateFormatted}
          />

          <div className={bem('content')}>
            {isJoined && (
              <Fragment>
                <div
                  className={bem('joined', {
                    loading: loadingLeave,
                    regular: !isFlashChallenge,
                  })}
                >
                  <div className="text-center md:text-left">
                    Joined{' '}
                    {moment(challenge.joinedAt).clone().format('MMM D, YYYY')}
                  </div>
                  <div className="flex justify-between flex-row">
                    {!isFlashChallenge && (
                      <span onClick={onLeave}>
                        {loadingLeave && <Loader active inline />}
                        Leave Challenge
                      </span>
                    )}

                    {challenge.planId && isFlashChallenge && (
                      <span onClick={onLeave}>
                        {loadingLeave && <Loader active inline />}
                        Leave Challenge
                      </span>
                    )}

                    {!isStarted && (
                      <InviteModal
                        challengeId={id}
                        open={openInviteModal}
                        isFlash={isFlashChallenge}
                        onOpen={() => setInviteModalOpen(true)}
                        onClose={() => setInviteModalOpen(false)}
                        trigger={<span className="ml-0 md:ml-8">Invite</span>}
                      />
                    )}

                    {isJoined && !isFinished && (
                      <span
                        onClick={onOpenChat}
                        className={cx('md:mt-0 md:ml-4', {
                          'ml-4': !isFlashChallenge,
                        })}
                      >
                        Open Chat
                      </span>
                    )}
                  </div>
                </div>

                {checkinWindowEndFinished && usersWinners.length > 0 && (
                  <div className={bem('statistics')}>
                    <div className="mr-1 flex flex-1 flex-col">
                      <span>Highest Score</span>
                      <span>{usersWinners[0].points}</span>
                    </div>

                    <div className="ml-1 flex flex-1 flex-col">
                      <span>Winner{usersWinners.length > 1 && 's'}</span>
                      <span>{winnersLabel}</span>
                    </div>
                  </div>
                )}
              </Fragment>
            )}

            {!isFlashChallenge && (
              <div className="flex mb-2 sm:mb-1">
                <span className={cx(bem('label', 'fixed'), 'my-auto mr-2')}>
                  Challenge:
                </span>

                <span
                  className={cx(
                    bem('value'),
                    'flex flex-col md:flex-row items-start md:items-center'
                  )}
                >
                  <Link to={`/challenges/${id}`} className={bem('pill')}>
                    <Icon name="hourglass two" />
                    {challenge.name}
                  </Link>

                  {challenge.challengeManager && (
                    <div className="hidden-el md:flex">
                      <span className={cx(bem('label'), 'mx-3')}>|</span>
                      <span className={cx(bem('label'), 'mr-2')}>
                        Created by:
                      </span>

                      <span className={bem('value')}>
                        <Link to={`/profile/${challenge.challengeManager.id}`}>
                          {challenge.challengeManager.name}
                        </Link>
                      </span>
                    </div>
                  )}
                </span>
              </div>
            )}

            {isFlashChallenge && challenge.challengeManager && (
              <div className="flex mb-2 sm:mb-1">
                <span className={cx(bem('label', 'fixed'), 'mr-2')}>
                  Created by:
                </span>
                <span className={bem('value')}>
                  <Link to={`/profile/${challenge.challengeManager.id}`}>
                    {challenge.challengeManager.name}
                  </Link>
                </span>
              </div>
            )}

            {challenge.milestone && (
              <div className="flex mb-2 sm:mb-1">
                <span className={cx(bem('label', 'fixed'), 'mr-2')}>
                  Milestone:
                </span>
                <span className={bem('value')}>{challenge.milestone}</span>
                <span
                  className={bem('milestone', {
                    on: challenge.milestoneOnTrack,
                  })}
                >
                  {challenge.milestoneOnTrack && (
                    <Fragment>
                      On Track
                      <span className="ml-3">+{challenge.milestonePoints}</span>
                    </Fragment>
                  )}
                  {!challenge.milestoneOnTrack && challenge.milestonePoints && (
                    <Fragment>
                      Off Track
                      <span className="ml-3">+{challenge.milestonePoints}</span>
                    </Fragment>
                  )}
                </span>
              </div>
            )}

            <div
              className={cx(
                'flex',
                challenge.specifics ? 'mb-2 sm:mb-1' : 'mb-8'
              )}
            >
              <span className={cx(bem('label', 'fixed'), 'mr-2')}>
                Location:
              </span>
              <span className={bem('value')}>
                {
                  <MarkDown
                    source={challenge.place}
                    setMediaModal={setMediaModal}
                  />
                }
              </span>
            </div>

            {challenge.specifics && (
              <div className={bem('specifics')}>
                <span className={cx(bem('label', 'fixed'), 'mr-2')}>
                  Description:
                </span>
                <MarkDown
                  source={challenge.specifics}
                  setMediaModal={setMediaModal}
                />
              </div>
            )}

            {!isStarted && !hasConfirmations && (
              <Fragment>
                <div className={'flex flex-1 mb-2 mt-4 sm:mt-6'}>
                  <span className={`${bem('label')} mr-2`}>
                    Members: {members ? members.length : '?'}
                  </span>

                  <div className={bem('divider')} />
                </div>

                <div className="flex flex-1 mb-2 mt-4 sm:mt-6">
                  <ul className={bem('memberlist')} style={{ paddingLeft: 0 }}>
                    {orderBy(members || [], 'name').map((m) => (
                      <li style={{ listStyle: 'none', textAlign: 'left' }}>
                        <Link to={`/profile/${m.id}`} target="_blank">
                          {truncate(m.name, 10)}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              </Fragment>
            )}

            {isJoined && (
              <Fragment>
                {confirmations && (
                  <Fragment>
                    <div className="flex flex-1 mb-2 mt-4 sm:mt-6">
                      <span className={cx(bem('label'), 'mr-2')}>
                        Confirmed
                        {isConfirmationStarted && confirmationInValue
                          ? `: ${confirmationInValue}`
                          : ''}
                      </span>

                      <div className={bem('divider')} />
                    </div>

                    <Intentions
                      type="confirmation"
                      intentions={confirmations}
                      {...baseIntentionProps}
                    />
                  </Fragment>
                )}

                {checkins && (
                  <Fragment>
                    <div className="flex flex-1 mb-2 mt-4 sm:mt-6">
                      <span className={cx(bem('label'), 'mr-2')}>
                        Check-in
                        {isStarted && checkInValue ? `: ${checkInValue}` : ''}
                      </span>
                      <div className={bem('divider')} />
                    </div>

                    <Intentions
                      type="checkin"
                      intentions={checkins}
                      {...baseIntentionProps}
                    />
                  </Fragment>
                )}
              </Fragment>
            )}

            {!isJoined &&
              loaded &&
              !isStarted &&
              !isFinished &&
              isFlashChallenge && (
                <div className={cx(bem('box'), bem('join'))}>
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
                    {/* <Link to={`/challenges/${id}`}>Go to challenge page</Link> */}
                  </div>

                  <div>
                    <Button
                      color="orange"
                      onClick={onJoin}
                      loading={loadingJoin}
                    >
                      Join Challenge
                    </Button>
                  </div>
                </div>
              )}
          </div>

          {isJoined && (
            <Footer
              id={id}
              date={date}
              hasInteracted={hasInteracted}
              onClose={onClose}
              challenge={challenge}
              timeFormat={timeFormat}
              isStarted={isStarted}
              isFlashChallenge={isFlashChallenge}
              isMyChallenge={isMyChallenge}
              startDateFormatted={startDateFormatted}
            />
          )}
        </Modal.Content>
      </Modal>
    </>
  );
}
ChallengeDetailsModal.propTypes = propTypes;

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ChallengeDetailsModal);
