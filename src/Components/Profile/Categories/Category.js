/* eslint-disable radix */
import React from 'react';
import PropTypes from 'prop-types';
import isEmpty from 'lodash/isEmpty';
import cx from 'classnames';
import BEMHelper from 'react-bem-helper';
import BuddyCategory from './BuddyCategory';
import NoBuddyCategory from './NoBuddyCategory';

import './Category.scss';

const bem = BEMHelper({ name: 'ProfileCategory', outputIsString: true });

const Category = ({
  data,
  canAdd,
  disabled,
  categoryId,
  hasAccess,
  canEdit,
  cancelBuddyRequest,
  sendBetaInvite,
  sendBuddyRequest,
  user,
  currentSentRequest,
  sentRequest,
  updateCategory,
  alreadyBuddy,
  openChatWith,
  closeSidebarFunction,
}) => {
  if (isEmpty(data)) return null;
  const isActive = data.active;
  const showFrequency = isActive && data.frequency.length > 0;
  const showBehaviors = data.behaviours.length > 0;
  function getFrequency() {
    return (
      data.frequency.reduce((prev, current) => prev + current, 0) /
      data.frequency.length
    );
  }
  return (
    <div className={bem()}>
      <div className="content active">
        <div className={bem('plan')}>
          <div className={bem('title')}>Most Recent Plan</div>
          <div className={cx(bem('frequency'), { inactive: !showFrequency })}>
            {showFrequency ? `${parseInt(getFrequency())}x / week` : '-'}
          </div>
        </div>
        <span className={cx(bem('description'), { inactive: !isActive })}>
          {isActive ? data.plan.name : 'No Plan'}
        </span>
        <div className={bem('title')}>Behaviors</div>
        <div className={bem('description')}>
          {showBehaviors ? data.behaviours.join(', ') : '-'}
        </div>
      </div>
      {data.buddy && (
        <BuddyCategory
          category={data}
          canEdit={canEdit}
          alreadyBuddy={alreadyBuddy}
          updateCategory={updateCategory}
          cancelBuddyRequest={cancelBuddyRequest}
          sendBetaInvite={sendBetaInvite}
          sendBuddyRequest={sendBuddyRequest}
          user={user}
          sentRequest={sentRequest}
          disabled={disabled}
          openChatWith={openChatWith}
          canAdd={canAdd}
          categoryId={categoryId}
          currentSentRequest={currentSentRequest}
          closeSidebarFunction={closeSidebarFunction}
        />
      )}
      {!data.buddy && (
        <NoBuddyCategory
          canAdd={canAdd}
          disabled={disabled}
          hasAccess={hasAccess}
          canEdit={canEdit}
          cancelBuddyRequest={cancelBuddyRequest}
          sendBetaInvite={sendBetaInvite}
          sendBuddyRequest={sendBuddyRequest}
          user={user}
          sentRequest={sentRequest}
          categoryId={categoryId}
          currentSentRequest={currentSentRequest}
          isCategoryActive
        />
      )}
    </div>
  );
};

Category.propTypes = {
  data: PropTypes.shape(),
  canAdd: PropTypes.bool,
  disabled: PropTypes.bool,
  hasAccess: PropTypes.bool,
  canEdit: PropTypes.bool,
  cancelBuddyRequest: PropTypes.func,
  sendBetaInvite: PropTypes.func,
  sendBuddyRequest: PropTypes.func,
  user: PropTypes.shape(),
  sentRequest: PropTypes.bool,
  updateCategory: PropTypes.func,
  openChatWith: PropTypes.func,
  closeSidebarFunction: PropTypes.func,
  categoryId: PropTypes.number,
  alreadyBuddy: PropTypes.bool,
  currentSentRequest: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.number),
    PropTypes.oneOf([null]),
  ]),
};

export default Category;
