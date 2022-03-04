/* eslint-disable react/jsx-no-target-blank */
/* eslint-disable jsx-a11y/anchor-is-valid */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */
import React, { Fragment } from 'react';
import { compose } from 'redux';
import withSizes from 'react-sizes';
import { connect } from 'react-redux';
import get from 'lodash/get';
import PropTypes from 'prop-types';
import { Button, Container, Icon, Popup } from 'semantic-ui-react';
import { joinGroup as joinGroupAction } from '../../../Actions/actions_groups';
import * as groupChatActions from '../../../Actions/action_group_chat';
import transformGroupType from '../../../utils/transformGroupType';
import Avatar from '../../Elements/Avatar';
import AccountabilityScore from '../../Elements/AccountabilityScore';
import Dropdown from '../Dropdown';
import {
  isPosting,
  getNextLevel,
  getMembersCount,
} from '../../../selectors/groups';
import CircularProgressBar from '../../Elements/CircularProgressBar';
import { CategoryIcon } from '../../Elements/CategoriesIcons';
import Flag from '../../Elements/Flag';
import withGroupsLevels from '../../HoCs/resources/withGroupsLevels';
import InviteFriendButton from '../../Elements/InviteFriendButton';
import {
  isAlreadyChatMember,
  getGroupMembership,
} from '../../../selectors/groupChat';
import useCopyClipboardTimeout from '../../../hooks/use-clipboard-timeout';
import Notifications from '../Notifications/Notifications';
import './Header.scss';

function parseUrl(url) {
  if (!url) return null;
  let website = url.replace(/(http|https):\/\//, '');
  if (url[url.length - 1] === '/') {
    website = website.substring(0, website.length - 1);
  }
  if (!website.includes('www')) {
    website = `www.${website}`;
  }
  return website;
}

const Header = ({
  categories,
  countryISO,
  groupManager,
  icon,
  subTitle,
  languages,
  location,
  id,
  isPrivate,
  pendingRequest,
  name,
  hasPermission,
  official,
  initThread,
  joinGroup,
  isMobile,
  posting,
  type,
  url,
  score,
  nextLevel,
  membersCount,
  joinChat,
  alreadyChatMember,
}) => {
  const [isProfileLinkCopied, copyProfileLink] = useCopyClipboardTimeout(
    window.location.href,
    3000
  );
  const showRightInfo = groupManager || url;
  const website = parseUrl(url);
  function getButtonText() {
    if (hasPermission)
      return alreadyChatMember ? 'Open Group Chat' : 'Join Group Chat';
    if (pendingRequest) return 'Request Sent';
    return 'Join Group';
  }
  function handleBtnAction() {
    if (!hasPermission) {
      joinGroup(id, isPrivate);
    } else if (hasPermission && !alreadyChatMember) {
      joinChat(id);
    } else if (hasPermission && alreadyChatMember) {
      initThread(id);
    }
  }
  function MembersCount() {
    return (
      <Fragment>
        <span>{membersCount}</span>
        <span>{membersCount === 1 ? 'Member' : 'Members'}</span>
      </Fragment>
    );
  }

  return (
    <div>
      <Container>
        <div className="flex justify-end mb-2 md:mb-0">
          <InviteFriendButton />
        </div>
        <div className="GroupPageHeader">
          <div className="GroupPageHeader__main">
            <div className="GroupPageHeader__avatar-container">
              <CircularProgressBar
                sqSize={160}
                points={score}
                maxPoints={get(nextLevel, 'xpRequirement', score)}
                strokeColor={get(nextLevel, 'color', '#ADADAD')}
                nextLevel={get(nextLevel, 'name', 'None')}
              >
                <div className="GroupPageHeader__group-avatar">
                  <img src={icon} alt="icon" />
                </div>
              </CircularProgressBar>
            </div>

            <div className="GroupPageHeader__main-info">
              <div className="GroupPageHeader__main-info-top">
                <div className="GroupPageHeader__group-name">
                  <div>
                    {isPrivate && !hasPermission ? (
                      <Popup trigger={<Icon name="circle outline" />}>
                        <div className="GroupPageHeader__private-note-popup">
                          <p>Private Group:</p>
                          You need to request access and be accepted before you
                          can join the group
                        </div>
                      </Popup>
                    ) : (
                      <Icon
                        name={`circle ${isPrivate ? 'outline' : 'notch'}`}
                      />
                    )}
                    {name}
                  </div>
                  {subTitle && (
                    <span className="GroupPageHeader__sub-title">
                      {subTitle}
                    </span>
                  )}
                </div>
                <div className="GroupPageHeader__more-info">
                  {categories.map((category) => (
                    <span
                      className="GroupPageHeader__category-icon"
                      key={category.slug}
                    >
                      <CategoryIcon {...category} fullColor />
                    </span>
                  ))}
                  {!isProfileLinkCopied ? (
                    <Button
                      basic
                      className="GroupPageHeader__more-info--share"
                      onClick={() => copyProfileLink()}
                    >
                      <Icon name="share" />
                      Share Group
                    </Button>
                  ) : (
                    <span className="GroupPageHeader__copied md:ml-auto">
                      Copied to clipboard!
                    </span>
                  )}
                </div>
              </div>

              <div className="GroupPageHeader__separator" />
              <div className="GroupPageHeader__main-info-middle">
                <div className="GroupPageHeader__main-info-left">
                  {type !== 'Other' && (
                    <Fragment>
                      <span>{transformGroupType(type)}</span>
                      <div className="GroupPageHeader__vertical-separator" />
                    </Fragment>
                  )}
                  <Flag
                    country={countryISO}
                    text={countryISO ? location : null}
                  />
                  <p className="GroupPageHeader__location">
                    {location || 'Planet Earth'}
                  </p>
                  {languages.length > 0 && (
                    <div className="GroupPageHeader__vertical-separator" />
                  )}
                  <p className="GroupPageHeader__languages">
                    {languages.map((el) => (
                      <div key={el}>{el}</div>
                    ))}
                  </p>
                </div>
                {showRightInfo && (
                  <div className="GroupPageHeader__main-info-right">
                    {groupManager && (
                      <div className="GroupPageHeader__created-by">
                        Created by:
                        <div>
                          <div className="GroupPageHeader__created-by-icon-container">
                            <div>
                              <Avatar
                                id={groupManager.id}
                                avatar={groupManager.avatar}
                                size="25px"
                                avatarCallback={() => {}}
                              />
                            </div>
                          </div>
                          <span>{groupManager.name}</span>
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

              {/* <div className="GroupPageHeader__main-info-bottom">
                {hasPermission && <Dropdown hasPermission id={id} />}
                <div className="GroupPageHeader__more-icons">
                  <Icon className="GroupPageHeader__more-icon" name="shield alternate" />
                  <Icon
                    className="GroupPageHeader__more-icon"
                    name="hand point up outline"
                  />
                </div>
              </div>
                */}
            </div>
          </div>
          {official && (
            <div className="GroupPageHeader__official">
              <div>
                <Icon name="check" />
                OFFICIAL
              </div>
            </div>
          )}
        </div>
      </Container>
      <div className="GroupPageHeader__bottom py-4">
        <Container>
          <div className="flex items-center justify-between GroupPageHeader__tribe-menu">
            <div className="flex flex-col md:flex-row">
              {isMobile && (
                <div className="flex items-center justify-center mb-4">
                  <div className="GroupPageHeader__menu mr-8">
                    <Dropdown hasPermission id={id} text="Menu" />
                  </div>
                  <div className="GroupPageHeader__members ml-8">
                    {alreadyChatMember && <Notifications groupId={id} />}
                    <MembersCount />
                  </div>
                </div>
              )}
              <div className="GroupPageHeader__tribe">
                <AccountabilityScore
                  points={score}
                  levelcolor="#ADADAD"
                  levelName={isPrivate && hasPermission ? 'Pro Tribe' : 'Tribe'}
                />
              </div>
              {hasPermission && !isMobile && (
                <div className="GroupPageHeader__menu">
                  <Dropdown hasPermission id={id} text="Menu" />
                </div>
              )}
            </div>
            <div className="flex items-center flex-col md:flex-row">
              {!isMobile && (
                <div className="GroupPageHeader__members mb-4 md:mb-0 mr-0 md:mr-8">
                  {hasPermission && <Notifications groupId={id} />}
                  <MembersCount />
                </div>
              )}
              <div className="GroupPageHeader__tribe-btn-container">
                <Button
                  className="GroupPageHeader__tribe-btn"
                  color="orange"
                  loading={posting}
                  disabled={pendingRequest}
                  onClick={handleBtnAction}
                >
                  {getButtonText()}
                </Button>
              </div>
            </div>

            {/* isPrivate && hasPermission ? (
              <div className="GroupPageHeader__tribe-rating">
                <Icon name="long arrow alternate up" />
                <p>{`${maxScore} ~ ${minScore}`}</p>
                <Icon name="long arrow alternate down" />
              </div>
            ) : null */}
          </div>
        </Container>
      </div>
      <footer className="GroupPageHeader__footer">
        <div className="GroupPageHeader__footer-middle-line" />
        <div className="GroupPageHeader__footer-full-line" />
      </footer>
    </div>
  );
};

Header.propTypes = {
  categories: PropTypes.arrayOf(PropTypes.shape),
  countryISO: PropTypes.string,
  groupManager: PropTypes.oneOfType([
    PropTypes.object,
    PropTypes.oneOf([null]),
  ]),
  url: PropTypes.oneOfType([PropTypes.string, PropTypes.oneOf([null])]),
  hasPermission: PropTypes.bool,
  icon: PropTypes.string,
  isPrivate: PropTypes.bool,
  languages: PropTypes.arrayOf(PropTypes.string),
  location: PropTypes.string,
  subTitle: PropTypes.string,
  name: PropTypes.string,
  score: PropTypes.number,
  membersCount: PropTypes.number,
  posting: PropTypes.bool,
  id: PropTypes.number,
  joinGroup: PropTypes.func,
  pendingRequest: PropTypes.bool,
  official: PropTypes.bool,
  alreadyChatMember: PropTypes.bool,
  joinChat: PropTypes.func,
  initThread: PropTypes.func,
  isMobile: PropTypes.bool,
  type: PropTypes.string,
  nextLevel: PropTypes.shape({
    level: PropTypes.number,
    name: PropTypes.string,
    xpRequirement: PropTypes.number,
  }),
};

const mapStateToProps = (state, { score, id }) => ({
  posting: isPosting(state),
  nextLevel: getNextLevel(state, score),
  membersCount: getMembersCount(state),
  alreadyChatMember: isAlreadyChatMember(state, { groupId: id }),
});

const mapDispatchToProps = {
  joinGroup: joinGroupAction,
  joinChat: groupChatActions.joinChat,
  initThread: groupChatActions.initThread,
};

export default compose(
  withGroupsLevels({
    skipLoading: true,
  }),
  connect(mapStateToProps, mapDispatchToProps),
  withSizes(({ width }) => ({
    isMobile: width < 768,
  }))
)(Header);
