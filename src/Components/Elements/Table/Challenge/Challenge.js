/* eslint-disable jsx-a11y/anchor-is-valid */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import React, { useState } from 'react';
import cx from 'classnames';
import moment from 'moment-timezone';
import { Icon } from 'semantic-ui-react';
import isEmpty from 'lodash/isEmpty';
import PropTypes from 'prop-types';
import BEMHelper from 'react-bem-helper';
import Countdown from 'react-countdown';
import { Popup } from 'semantic-ui-react';

import defaultChallenge from '../../../../Assets/images/challenge.png';
import './Challenge.scss';
import ChallengeDetailsModal from '../../../Challenges/ChallengeDetailsModal';
import Intensity from '../../../Challenges/Intensity';

import Counter from '../../../Dashboard/Counter';

const TYPES = {
  PRIVATE: 'Private',
};

const bem = BEMHelper({ name: 'ChallengeColumn', outputIsString: true });

const ChallengeColumn = ({
  id,
  name,
  location,
  privacy,
  icon,
  joinedAt,
  onlyIcon,
  featured,
  official,
  latestEvent,
  challenge,
  onOpenModal,
  showRow,
}) => {
  const [openDetailsModal, setOpenDetailsModal] = useState(false);

  const startDate = moment(challenge.start);
  const endDate = moment(challenge.finish);

  const challengeDateIsOnGoing = moment() > startDate && moment() < endDate;
  const [isOnGoing, setIsOnGoing] = useState(challengeDateIsOnGoing);

  function renderStatus() {
    if (isOnGoing) {
      return (
        <>
          <span className="mr-1">{`Ending in: `}</span>
          <Countdown date={endDate.clone().format()} renderer={Counter} />
        </>
      );
    }
    if (moment() < startDate) {
      return (
        <>
          <span className="mr-1">
            {`Starts ${
              startDate.diff(moment(), 'hours') < 6 ? 'soon' : ''
            } in: `}
          </span>
          <Countdown
            date={startDate.clone().format()}
            renderer={Counter}
            onComplete={() => setIsOnGoing(true)}
          />
        </>
      );
    }
    return null;
  }

  return (
    <div className={bem()} onClick={() => onOpenModal(id)}>
      <div className={bem('icon')}>
        <img src={icon || defaultChallenge} alt={name} />
        {official && (
          <div className={bem('official')}>
            <Icon name="check" />
          </div>
        )}
      </div>
      {!onlyIcon && (
        <div className={bem('description')}>
          {featured && <div className={bem('featured')}>Featured</div>}
          <div className={bem('header')}>
            <div>{name}</div>
            {!!joinedAt && <span className={bem('joined')}>Joined</span>}
          </div>
          <div
            className={cx(
              bem('description-details'),
              'mb-1',
              bem('status'),
              featured ? bem('status--featured') : '',
              'd-flex'
            )}
          >
            {renderStatus()}
          </div>
          <div className={cx(bem('description-details'), 'd-flex')}>
            <Icon
              name={
                privacy === TYPES.PRIVATE ? 'circle outline' : 'circle notch'
              }
            />
            <span className="mr-8">
              {privacy === TYPES.PRIVATE ? 'Private' : 'Open'}
            </span>
            <span className="mr-8">
              <Popup
                trigger={<div>{challenge.type}</div>}
                inverted
                content={
                  challenge.type === 'Flexible'
                    ? 'Edit the schedule'
                    : 'Fixed schedule'
                }
              />
            </span>
            <span className="mr-8">
              <Popup
                trigger={
                  <div>
                    <Intensity intensity={challenge.intensity} noText />
                  </div>
                }
                inverted
                content={challenge.intensity}
              />
            </span>
            <span className={bem('description-details--location')}>
              {location}
            </span>
          </div>
          {!isEmpty(latestEvent) && !!joinedAt && showRow && (
            <div className={bem('event')}>
              <div className={bem('event-triangle')} />
              <span className={bem('event-title')}>Last Event:</span>
              <div onClick={(e) => e.stopPropagation()}>
                <span className={bem('event-name')}>{latestEvent.habit}</span>
                <ChallengeDetailsModal
                  id={id}
                  challenge={{
                    checkInWindowEnd: moment(latestEvent.date).add(
                      Number(latestEvent.duration) + 1440,
                      'minutes'
                    ),
                    planId: challenge.planID,
                    eventId: latestEvent.eventID,
                    date: latestEvent.date,
                    duration: latestEvent.duration,
                    templateID: latestEvent.templateID,
                    category: latestEvent.category,
                    name: challenge.name,
                    specifics: latestEvent.specifics,
                    milestone: latestEvent.milestone,
                    habit: latestEvent.habit,
                    joinedAt,
                    prompts: latestEvent.prompts.map((p) =>
                      typeof p === 'object' ? p.prompt : p
                    ),
                    participants: challenge.participants,
                    type: challenge.type,
                    place: latestEvent.place,
                    challengeManager: challenge.manager,
                  }}
                  open={openDetailsModal}
                  onClose={() => setOpenDetailsModal(false)}
                  onOpen={() => setOpenDetailsModal(true)}
                  trigger={<a>details...</a>}
                />
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

ChallengeColumn.propTypes = {
  id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  privacy: PropTypes.string,
  icon: PropTypes.string,
  name: PropTypes.string,
  onlyIcon: PropTypes.bool,
  featured: PropTypes.bool,
  official: PropTypes.bool,
  onOpenModal: PropTypes.func,
  challenge: PropTypes.shape(),
  joinedAt: PropTypes.oneOfType([PropTypes.string, PropTypes.oneOf([null])]),
  location: PropTypes.oneOfType([PropTypes.string, PropTypes.oneOf([null])]),
  latestEvent: PropTypes.oneOfType([
    PropTypes.shape(),
    PropTypes.oneOf([null]),
  ]),
};

ChallengeColumn.defaultProps = {
  onlyIcon: false,
};

export default ChallengeColumn;
