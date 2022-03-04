/* eslint-disable jsx-a11y/anchor-is-valid */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */

import React, { useState, useContext } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { Popup, Icon } from 'semantic-ui-react';
import BEMHelper from 'react-bem-helper';
import moment from 'moment';
import cx from 'classnames';
import truncate from 'truncate-html';
import { getSlug, parseMinutesToTimeShort } from '../../NewPlan/utils';
import { getMyProfileId } from '../../../selectors/profile';
import { shouldRenderCheckIn, eventDataToChallenge } from '../utils';
import CategoryIcon from '../../Elements/CategoriesIcons/CategoryIcon';
import Avatar from '../../Elements/Avatar';
import EventDetailsModal from '../EventDetailsModal';
import PlanContext from '../PlanContext';
import parseTimeFormat from '../../../utils/parseTimeFormat';
import MarkDown from '../../Elements/MarkDown';
import ChallengeStatus from '../ChallengeStatus';
import ChallengeDetailsModal from '../../Challenges/ChallengeDetailsModal';
import './PopupDetails.scss';

const bem = BEMHelper({ name: 'PopupEventDetails', outputIsString: true });

const PopupDetails = ({
  data,
  open,
  onClosePopup,
  trigger,
  position,
  myId,
}) => {
  if (!data) return null;
  const { timeFormat } = useContext(PlanContext);
  const [openModal, toggleModal] = useState(false);
  const basePopupProps = {
    open,
    position,
    className: bem(),
    trigger,
    id: `popup-${data.id}`,
  };
  const partOfChallenge = data.challengeID !== null;
  const date = moment(data.start);
  const challengeDateIsOnGoing =
    partOfChallenge &&
    moment() > date &&
    moment() < date.clone().add(data.duration, 'minutes');
  if (!open) return <Popup {...basePopupProps} />;

  const partOfPlan = data.planID !== null;
  const flashChallenge =
    data.challengeType !== null && data.challengeType === 'Flash';
  const milestone = data.milestone !== null;
  const showChallengePill = partOfChallenge && !data.hidePill;
  const checkInWindowEnd = data.challengeID
    ? moment(data.start).add(data.duration + 60, 'minutes')
    : moment(data.checkInWindowEnd);
  const status = partOfChallenge ? (
    <ChallengeStatus
      duration={data.duration}
      checkInWindowEnd={checkInWindowEnd.clone().format()}
      isOnGoing={challengeDateIsOnGoing}
      date={date}
      joined
      small
    />
  ) : null;
  function onOpenModal() {
    toggleModal(true);
  }
  function onCloseModal() {
    toggleModal(false);
    onClosePopup(data.id);
  }
  function onMouseLeavePopup() {
    if (!openModal) {
      onClosePopup(data.id);
    }
  }
  function getUserName() {
    if (!data.user || data.user.id === myId) return 'YOU';
    return data.user.name;
  }
  const detailsBaseProps = {
    onOpen: onOpenModal,
    onClose: onCloseModal,
    trigger: (
      <div
        onMouseLeave={onMouseLeavePopup}
        onClick={(e) => e.stopPropagation()}
      >
        <div className={cx('flex justify-between', bem('header'))}>
          {data.user && (
            <div className={cx('flex justify-between items-center')}>
              <div className={bem('avatar')}>
                <Avatar avatar={data.user.avatar} id={data.user.id} />
              </div>
              <div className={bem('username')}>
                <span>{getUserName()}</span>
              </div>
            </div>
          )}
          <div>
            {partOfPlan && !partOfChallenge && (
              <div className={bem('plan')}>
                <span>{truncate(data.planName, 3, { byWords: 3 })}</span>
              </div>
            )}
            {showChallengePill && (
              <div className={bem('flash')}>
                {!flashChallenge && <Icon name="hourglass two" />}
                <span>
                  {flashChallenge ? 'Flash challenge' : data.challengeName}
                </span>
              </div>
            )}
          </div>
        </div>
        <div className={cx('flex', bem('title'), { 'mt-3': data.user })}>
          <CategoryIcon
            active
            name={data.habit.category}
            slug={getSlug(data.habit.category)}
          />
          <span>
            {data.habit.name} for {parseMinutesToTimeShort(data.duration)}
          </span>
        </div>
        <div className={bem('datetime')}>
          {date.clone().format('MMM D, ddd')}
          {' | '}
          {date.clone().format(parseTimeFormat(timeFormat, data.start))}
          {partOfChallenge && ' | '}
          {status}
        </div>
        <div className={cx('flex', bem('location'))}>
          <Icon name="location arrow" />
          <div>Location:</div>
          <span>{<MarkDown source={data.location} />}</span>
        </div>
        {milestone && (
          <div className={cx('flex', bem('milestone'))}>
            <Icon name="flag" />
            <div>Milestone:</div>
            <div className="description">
              {data.milestone}
              {data.milestoneOnTrack ? (
                <span>On track</span>
              ) : data.milestonePoints ? (
                <span className="offTrack">Off track</span>
              ) : null}
            </div>
          </div>
        )}
        <div className={cx('flex', bem('description'))}>
          <Icon name="list" />
          <div>Description:</div>
          <div className="specifics">
            {data.specifics ? (
              <MarkDown source={data.specifics} truncate truncateLength={30} />
            ) : (
              '- -'
            )}
          </div>
        </div>
        <div className={bem('divider')} />
        <div className={cx('flex')}>
          <div className={bem('footer')}>
            Confirmed
            <br />
            <span>{data.intention ? 'Yes' : '- -'}</span>
          </div>
          <div className={bem('footer')}>
            Check-in
            <br />
            <span>{data.checkIn ? `${data.checkIn}%` : '- -'}</span>
          </div>
        </div>
        <div
          className={cx(
            bem('actions'),
            shouldRenderCheckIn({ ...data, checkInWindowEnd, myId })
              ? 'justify-between'
              : 'justify-end'
          )}
        >
          {shouldRenderCheckIn({ ...data, checkInWindowEnd, myId }) && (
            <Link to={`/dashboard/check-in/${data.id}`}>check-in now</Link>
          )}
          <a>more</a>
        </div>
      </div>
    ),
  };
  return (
    <Popup {...basePopupProps}>
      {partOfChallenge ? (
        <ChallengeDetailsModal
          {...detailsBaseProps}
          id={data.challengeID}
          open={openModal}
          challenge={eventDataToChallenge(data)}
        />
      ) : (
        <EventDetailsModal
          {...detailsBaseProps}
          event={data}
          openModal={openModal}
          timeFormat={timeFormat}
        />
      )}
    </Popup>
  );
};

PopupDetails.propTypes = {
  data: PropTypes.shape(),
  open: PropTypes.bool,
  onClosePopup: PropTypes.func,
  trigger: PropTypes.node,
  myId: PropTypes.number,
  position: PropTypes.string,
};

PopupDetails.defaultProps = {
  position: 'top center',
};

const mapStateToProps = (state) => ({
  myId: getMyProfileId(state),
});

export default connect(mapStateToProps)(PopupDetails);
