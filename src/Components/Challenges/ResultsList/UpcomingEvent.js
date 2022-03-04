/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useState } from 'react';
import PropTypes from 'prop-types';
import Countdown from 'react-countdown';
import moment from 'moment';
import Counter from '../../Dashboard/Counter';
import ChallengeDetailsModal from '../ChallengeDetailsModal';
import { bem } from './utils';
import { Fragment } from 'react';

function UpcomingEvent({ event, challenge }) {
  const [openDetailsModal, setOpenDetailsModal] = useState(false);
  return (
    <div className={bem('members')}>
      <div className={bem('members-holder')}>
        <div className={bem('event-triangle')} />
        <span className={bem('event-title')}>
          {event && moment(event.date).isAfter(moment())
            ? 'Next event starting in:'
            : 'No more events'}
        </span>
        <div className={bem('members-starting')}>
          {event && moment(event.date).isAfter(moment()) && (
            <Fragment>
              <Countdown
                date={moment(event.date).toDate()}
                renderer={Counter}
              />
              <ChallengeDetailsModal
                id={challenge.id}
                challenge={{
                  checkInWindowEnd: moment(event.date).add(
                    Number(event.duration) + 1440,
                    'minutes'
                  ),
                  planId: challenge.planID,
                  eventId: event.eventID,
                  date: event.date,
                  duration: event.duration,
                  templateID: event.templateID,
                  category: event.category,
                  name: challenge.name,
                  specifics: event.specifics,
                  milestone: event.milestone,
                  habit: event.habit,
                  joinedAt: challenge.joinedAt,
                  prompts: event.prompts.map((p) =>
                    typeof p === 'object' ? p.prompt : p
                  ),
                  participants: challenge.participants,
                  type: challenge.type,
                  place: event.place,
                  challengeManager: challenge.manager,
                }}
                open={openDetailsModal}
                onClose={() => setOpenDetailsModal(false)}
                onOpen={() => setOpenDetailsModal(true)}
                trigger={<a onClick={(e) => e.stopPropagation()}>details...</a>}
              />
            </Fragment>
          )}
        </div>
      </div>
    </div>
  );
}

UpcomingEvent.propTypes = {
  event: PropTypes.shape(),
  challenge: PropTypes.shape(),
};

export default UpcomingEvent;
