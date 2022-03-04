/* eslint-disable jsx-a11y/anchor-is-valid */
/* eslint-disable react/jsx-no-target-blank */
import React, { useContext, useState } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { compose } from 'redux';
import cx from 'classnames';
import withSizes from 'react-sizes';
import moment from 'moment';
import ShowMoreText from 'react-show-more-text';
import { Icon, Button, Popup } from 'semantic-ui-react';
import InviteFriendButton from '../../Elements/InviteFriendButton';
import { initThread } from '../../../Actions/actions_challenges_chat';
import { CategoryIcon } from '../../Elements/CategoriesIcons';
import Flag from '../../Elements/Flag';
import Avatar from '../../Elements/Avatar';
import defaultChallenge from '../../../Assets/images/challenge.png';
import useCopyClipboardTimeout from '../../../hooks/use-clipboard-timeout';
import parseTimeFormat from '../../../utils/parseTimeFormat';
import PlanContext from '../../Plan/PlanContext';
import Dropdown from './Dropdown';
import {
  createPlanJoinRegularChallenge,
  fetchMembers as fetchMembersAction,
} from '../../../Actions/actions_challenges';
import { getLoadingJoinRegularChallenge } from '../../../selectors/requests';
import JoinModal from '../JoinModal';
import { bem } from './utils';
import Title from './Title';
import EditLanguages from './EditLanguages';
import EditLocation from './EditLocation';
import ModalMap from '../../Elements/ModalMap';
import history from '../../../history';
import './ChallengeHeader.scss';
import Intensity from '../Intensity';
import Notifications from '../Notifications/Notifications';

function ChallengeHeader({
  id,
  url,
  icon,
  name,
  events,
  endDate,
  myUserId,
  openChat,
  location,
  isMobile,
  intensity,
  languages,
  startDate,
  locationID,
  chatJoined,
  categories,
  countryISO,
  templateID,
  userPlanID,
  loadingJoin,
  description,
  participants,
  createAndJoin,
  canChangeTime,
  templateTimezone,
  challengeManager,
  canChangeDetails,
  canChangeDuration,
  canChangeLocation,
  defaultChatMember,
  mustJoinBeforeStart,
  timezoneRestriction,
  fetchMembers,
}) {
  const { timeFormat } = useContext(PlanContext);
  const [openJoinModal, setOpenJoinModal] = useState(false);
  const startMomentDate = moment(startDate);
  const endMomentDate = moment(endDate);
  const hasStarted = startMomentDate.clone().isBefore(moment());
  const hasFinished = endMomentDate.clone().isBefore(moment());
  const imTheOwner = challengeManager && challengeManager.id === myUserId;
  const languagesText = languages.map(({ label }) => label).join(', ');
  const joinBeforeStartCond = hasStarted && mustJoinBeforeStart;
  const shouldShowJoin = !hasFinished && !joinBeforeStartCond && !chatJoined;
  const showDropdown = !hasFinished && (!!challengeManager || chatJoined);
  const website = (() => {
    if (!url) return null;
    let w = url.replace(/(http|https):\/\//, '');
    if (url[url.length - 1] === '/') {
      w = w.substring(0, w.length - 1);
    }
    if (!w.includes('www')) {
      w = `www.${w}`;
    }
    return w;
  })();
  const [isProfileLinkCopied, copyProfileLink] = useCopyClipboardTimeout(
    window.location.href,
    3000
  );
  function onJoinSchedule() {
    const invitation = (() => {
      const {
        location: { search },
      } = window;
      if (!search.includes('invitation')) return null;
      const key = new URLSearchParams(search).get('invitation');
      return key;
    })();
    history.push(
      `/schedule-challenge/${id}${
        invitation ? `?invitation=${invitation}` : ''
      }`
    );
  }
  async function onJoin() {
    const {
      location: { search },
    } = window;
    const skipJoin = search.includes('invitation');

    setOpenJoinModal(false);
    await createAndJoin(
      {
        id,
        name,
        events,
        timezone: templateTimezone,
        startDate,
        templateID,
        timezoneRestriction,
      },
      myUserId,
      skipJoin
    );
    fetchMembers(id);
  }
  function onClickJoin() {
    setOpenJoinModal(true);
  }
  function onClickOpenChat() {
    openChat(id);
  }
  return (
    <div className={bem()}>
      <div className={bem('container')}>
        <div className="flex justify-end mb-2 md:mb-0">
          <InviteFriendButton />
        </div>
        <div className={bem('content')}>
          <div className={bem('main')}>
            <div className="GroupPageHeader__avatar-container">
              <div className={bem('avatar')}>
                <img src={icon || defaultChallenge} alt="icon" />
              </div>
            </div>
            <div className={bem('main-info')}>
              <div className={bem('main-info-top')}>
                <Title name={name} canEdit={imTheOwner} id={id} />
                <div className={bem('more')}>
                  {categories.map((category) => (
                    <span className={bem('category')} key={category.slug}>
                      <CategoryIcon {...category} fullColor />
                    </span>
                  ))}
                  {!isProfileLinkCopied ? (
                    <Button
                      basic
                      className={bem('share')}
                      onClick={() => copyProfileLink()}
                    >
                      <Icon name="share" />
                      Share Challenge
                    </Button>
                  ) : (
                    <span className={cx('md:ml-auto', bem('copied'))}>
                      Copied to clipboard!
                    </span>
                  )}
                </div>
              </div>
              <div className={bem('separator')} />
              <div className={bem('main-info-middle')}>
                <div className={bem('main-info-left')}>
                  <div className="flex mt-2 mb-3">
                    <Popup
                      trigger={
                        <div className={bem('duration')}>
                          <span>
                            {startMomentDate.clone().format('MMM Do')},{' '}
                            {startMomentDate
                              .clone()
                              .format(parseTimeFormat(timeFormat, startDate))}
                          </span>
                          <span className="mx-2">-</span>
                          <span>
                            {endMomentDate.clone().format('MMM Do')},{' '}
                            {endMomentDate
                              .clone()
                              .format(parseTimeFormat(timeFormat, startDate))}
                          </span>
                        </div>
                      }
                    >
                      <div>
                        <span>
                          {startMomentDate.clone().format('MMM Do YYYY')}
                        </span>
                        <span className="mx-2">-</span>
                        <span>
                          {endMomentDate.clone().format('MMM Do YYYY')}
                        </span>
                      </div>
                    </Popup>
                  </div>
                  <div className="flex flex-col md:flex-row">
                    <div className="flex">
                      <Flag
                        country={countryISO}
                        text={countryISO ? location : null}
                      />
                      <p className={bem('location')}>
                        {location || 'Planet Earth'}
                      </p>
                      {countryISO && (
                        <ModalMap
                          placeId={locationID}
                          trigger={<a className={bem('map')}>view map</a>}
                        />
                      )}
                      {imTheOwner && (
                        <EditLocation id={id} placeId={locationID} />
                      )}
                    </div>
                    {!isMobile && <div className={bem('vertical-separator')} />}
                    <div className="flex">
                      <div className="flex">{languagesText}</div>
                      {imTheOwner && (
                        <EditLanguages id={id} value={languages} />
                      )}
                    </div>
                  </div>
                  <div className={bem('description')}>
                    <ShowMoreText lines={2} more="show more" less="show less">
                      {description}
                    </ShowMoreText>
                  </div>
                </div>
                {(website || challengeManager) && (
                  <div className={bem('main-info-right')}>
                    {challengeManager && (
                      <div className={bem('main-info-right')}>
                        <div className={bem('created-by')}>
                          <div>Created by:</div>
                          <div className="flex">
                            <div className={bem('created-by-icon-container')}>
                              <div>
                                <Avatar
                                  id={challengeManager.id}
                                  avatar={challengeManager.avatar}
                                  size="25px"
                                  avatarCallback={() => {}}
                                />
                              </div>
                            </div>
                            <span>{challengeManager.name}</span>
                          </div>
                        </div>
                      </div>
                    )}
                    {website && (
                      <a target="_blank" href={url}>
                        {website}
                      </a>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className={cx('py-5', bem('bottom'))}>
        <div className={bem('container')}>
          <div
            className={cx(
              'flex items-center',
              !showDropdown ? 'justify-end' : 'justify-between'
            )}
          >
            {showDropdown && (
              <Dropdown
                id={id}
                text="Menu"
                hasManager={!!challengeManager}
                planId={userPlanID}
                isOwner={imTheOwner}
                isMember={chatJoined}
                templateID={templateID}
                hasStarted={hasStarted}
                isEmpty={participants === 1}
                userId={defaultChatMember}
                className={bem('dropdown')}
              />
            )}
            <div className="flex items-center flex-row">
              {!shouldShowJoin && (
                <div className="mr-5">
                  <Notifications challengeId={id} />
                </div>
              )}
              <Intensity intensity={intensity} />
              <span className={bem('members')}>
                {participants} {participants > 1 ? 'Members' : 'Member'}
              </span>
              {chatJoined && !isMobile && !hasFinished && (
                <Button color="orange" onClick={onClickOpenChat}>
                  Open challenge chat
                </Button>
              )}
              {shouldShowJoin && !isMobile && (
                <Button
                  color="orange"
                  loading={loadingJoin}
                  disabled={loadingJoin}
                  onClick={onClickJoin}
                >
                  Join Challenge
                </Button>
              )}
            </div>
          </div>
          {chatJoined && isMobile && !hasFinished && (
            <Button color="orange" onClick={onClickOpenChat}>
              Open challenge chat
            </Button>
          )}
          {shouldShowJoin && isMobile && (
            <Button
              color="orange"
              loading={loadingJoin}
              disabled={loadingJoin}
              onClick={onClickJoin}
            >
              Join Challenge
            </Button>
          )}
        </div>
      </div>
      <footer className={bem('footer')}>
        <div className={bem('footer-middle-line')} />
        <div className={bem('footer-full-line')} />
      </footer>
      <JoinModal
        open={openJoinModal}
        onClose={() => setOpenJoinModal(false)}
        onJoin={onJoin}
        onJoinSchedule={onJoinSchedule}
        canChangeTime={canChangeTime}
        canChangeDetails={canChangeDetails}
        canChangeDuration={canChangeDuration}
        canChangeLocation={canChangeLocation}
      />
    </div>
  );
}

ChallengeHeader.propTypes = {
  id: PropTypes.number,
  url: PropTypes.string,
  name: PropTypes.string,
  isMobile: PropTypes.bool,
  openChat: PropTypes.func,
  endDate: PropTypes.string,
  chatJoined: PropTypes.bool,
  myUserId: PropTypes.number,
  loadingJoin: PropTypes.bool,
  startDate: PropTypes.string,
  intensity: PropTypes.string,
  templateID: PropTypes.number,
  userPlanID: PropTypes.number,
  locationID: PropTypes.string,
  createAndJoin: PropTypes.func,
  description: PropTypes.string,
  participants: PropTypes.number,
  canChangeTime: PropTypes.string,
  canChangeDetails: PropTypes.bool,
  canChangeDuration: PropTypes.bool,
  canChangeLocation: PropTypes.bool,
  fetchMembers: PropTypes.func,
  templateTimezone: PropTypes.string,
  challengeManager: PropTypes.shape(),
  defaultChatMember: PropTypes.number,
  mustJoinBeforeStart: PropTypes.bool,
  timezoneRestriction: PropTypes.string,
  events: PropTypes.arrayOf(PropTypes.shape()),
  languages: PropTypes.arrayOf(PropTypes.shape()),
  categories: PropTypes.arrayOf(PropTypes.shape()),
  icon: PropTypes.oneOfType([PropTypes.string, PropTypes.oneOf([null])]),
  location: PropTypes.oneOfType([PropTypes.string, PropTypes.oneOf([null])]),
  countryISO: PropTypes.oneOfType([PropTypes.string, PropTypes.oneOf([null])]),
};

const mapStateToProps = (state) => ({
  loadingJoin: getLoadingJoinRegularChallenge(state),
});

export default compose(
  withSizes(({ width }) => ({
    isMobile: width < 768,
  })),
  connect(mapStateToProps, {
    createAndJoin: createPlanJoinRegularChallenge,
    openChat: initThread,
    fetchMembers: fetchMembersAction,
  })
)(ChallengeHeader);
