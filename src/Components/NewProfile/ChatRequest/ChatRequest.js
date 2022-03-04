/* eslint-disable jsx-a11y/anchor-is-valid */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { toast } from 'react-toastify';
import PropTypes from 'prop-types';
import BEMHelper from 'react-bem-helper';
import cx from 'classnames';
import { Dropdown, Icon, Button } from 'semantic-ui-react';
import {
  getUserInfo,
  getMyProfileId,
  getUserCategories,
  getUserProfileData,
  getIsUserCategoriesLoaded,
} from '../../../selectors/profile';
import './ChatRequest.scss';
import * as profileActions from '../../../Actions/actions_profile';
import { CategoryIcon } from '../../Elements/CategoriesIcons';
import ProfileService from '../../../Services/ProfileService';
import { TrackEvent } from '../../../Services/TrackEvent';

const bem = BEMHelper({ name: 'ChatRequest', outputIsString: true });

function ChatRequest({
  myId,
  nonBeta,
  userInfo,
  profileId,
  categories,
  myUserInfo,
  myCategories,
  sendBetaInvite,
  sendBuddyRequest,
  cancelBuddyRequest,
}) {
  const [sentRequests, setSentRequets] = useState([]);
  const requestsOff = userInfo && !userInfo.accepts_buddy_requests;
  const myActiveCategories = myCategories
    ? myCategories.filter(({ buddy }) => !!buddy)
    : [];
  const canAdd = myActiveCategories.length < myUserInfo.available_categories;
  useEffect(() => {
    async function loadInfo() {
      const requests = categories.map(({ id }) =>
        ProfileService.getBuddyForCategory(profileId, id).then((res) => ({
          ...res,
          id,
        }))
      );
      try {
        const data = await Promise.all(requests);
        setSentRequets(data.filter((e) => e.sent_request).map(({ id }) => id));
      } catch (e) {
        toast.error('Something went wrong');
      }
    }
    loadInfo();
  }, [categories]);

  async function onClickCategory(id) {
    const inviteFunc = nonBeta ? sendBetaInvite : sendBuddyRequest;
    await inviteFunc(profileId, id);
    setSentRequets([...sentRequests, id]);
    TrackEvent('priprofile-category-buddysearch');
  }
  async function onRevokeRequest(id) {
    await cancelBuddyRequest(profileId, id);
    setSentRequets(sentRequests.filter((e) => e !== id));
  }
  return (
    <Dropdown
      icon={null}
      floating
      className={bem()}
      trigger={
        <Button color="orange" className={bem('trigger')}>
          Chat Request
          <Icon name="dropdown" className="pl-4" />
        </Button>
      }
    >
      <Dropdown.Menu className={bem('menu')}>
        <div className={bem('header')}>
          <span>In which category would you like to be buddies?</span>
          <span>Each category can only have 1 match.</span>
        </div>
        <div className={bem('categories')}>
          {categories.map((category) => {
            const unavailableBuddy =
              category.buddy && category.buddy.id !== myId;
            const requestSent = sentRequests.includes(category.id);
            const waitingForResponse = !requestSent && sentRequests.length > 0;
            const alreadyBuddyCategory = myCategories.find(
              (e) => e.id === category.id && e.buddy
            );
            const unavailable =
              requestsOff || requestSent || waitingForResponse;
            const message = (() => {
              if (requestSent) return 'Chat Request sent!';
              if (requestSent) return 'Chat Request sent!';
              if (requestsOff) return 'User not accepting chat requests.';
              if (waitingForResponse)
                return 'You have already sent a request. Please wait for it to be accepted or declined before sending another.';
              if (alreadyBuddyCategory)
                return 'You already have a Buddy in this category. Click to send anyway.';
              if (unavailableBuddy) return 'Already has a Buddy. Send anyway?';
              if (!canAdd)
                return 'Your available spaces are filled. Click to send anyway.';
              return 'Available';
            })();
            return (
              <div
                key={`chat-requests-category-${category.id}`}
                className={cx(bem('category'), {
                  'opacity-50': waitingForResponse,
                  'cursor-pointer': !unavailable,
                })}
                {...(!unavailable && {
                  onClick: () => onClickCategory(category.id),
                })}
              >
                <div className="mr-3">
                  <CategoryIcon
                    name={category.name}
                    slug={category.slug}
                    colorNoCircle
                  />
                </div>
                <div className={bem('category-text')}>
                  <span>{category.name}</span>
                  <span>{message}</span>
                </div>
                <div>
                  {requestSent && (
                    <a onClick={() => onRevokeRequest(category.id)}>Revoke</a>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </Dropdown.Menu>
    </Dropdown>
  );
}

const mapStateToProps = (state, props) => {
  const myId = getMyProfileId(state);
  const profileData = getUserProfileData(state, props);
  return {
    myId,
    categories: getUserCategories(state, props) || [],
    userInfo: getUserInfo(state, props),
    nonBeta: profileData ? profileData.non_beta : false,
    myUserInfo: getUserInfo(state, { profileId: myId }),
    isCategoriesLoaded: getIsUserCategoriesLoaded(state, props) || false,
    myCategories: getUserCategories(state, { profileId: myId }) || [],
  };
};

ChatRequest.propTypes = {
  nonBeta: PropTypes.bool,
  myId: PropTypes.number,
  myUserInfo: PropTypes.func,
  profileId: PropTypes.number,
  userInfo: PropTypes.shape(),
  sendBetaInvite: PropTypes.func,
  sendBuddyRequest: PropTypes.func,
  cancelBuddyRequest: PropTypes.func,
  myCategories: PropTypes.arrayOf(PropTypes.shape()),
  categories: PropTypes.arrayOf(PropTypes.shape()).isRequired,
};

export default connect(mapStateToProps, {
  sendBuddyRequest: profileActions.sendBuddyRequest,
  cancelBuddyRequest: profileActions.cancelBuddyRequest,
  sendBetaInvite: profileActions.sendBetaInvite,
})(ChatRequest);
