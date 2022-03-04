import React from 'react';
import cx from 'classnames';
import moment from 'moment';
import { Link } from 'react-router-dom';
import isEmpty from 'lodash/isEmpty';
import { Icon } from 'semantic-ui-react';
import CategoriesIcons from '../../Elements/CategoriesIcons';
import { ChallengeColumn } from '../../Elements/Table';
import Intensity from '../Intensity';

import { bem } from './utils';
import UpcomingEvent from './UpcomingEvent';
import { Fragment } from 'react';

export default ({ onOpenModal }) => [
  {
    title: 'Name',
    sortBy: 'name',
    dataIndex:
      'id name location joinedAt privacy icon featured official latestEvent participants type challengeManager planID start finish intensity showRow',
    render: (
      id,
      name,
      location,
      joinedAt,
      privacy,
      icon,
      featured,
      official,
      latestEvent,
      participants,
      type,
      manager,
      planID,
      start,
      finish,
      intensity,
      showRow
    ) => (
      <div className="info-name cell-content">
        <ChallengeColumn
          icon={icon}
          id={id}
          name={name}
          location={location}
          featured={featured}
          onOpenModal={onOpenModal}
          privacy={privacy}
          official={official}
          latestEvent={latestEvent}
          joinedAt={joinedAt}
          showRow={showRow}
          challenge={{
            name,
            type,
            manager,
            planID,
            joinedAt,
            participants,
            start,
            finish,
            intensity,
          }}
        />
      </div>
    ),
  },
  {
    title: 'Dates',
    sortBy: 'regular',
    dataIndex:
      'start finish featured position participants latestEvent joinedAt showRow',
    render: (
      start,
      finish,
      featured,
      position,
      participants,
      latestEvent,
      joinedAt,
      showRow
    ) => (
      <div className="cell-content flex flex-col">
        <div
          className={cx('dates mt-2 info', featured ? 'dates--featured' : '')}
        >
          {moment(start).format('MMM D')} -{' '}
          {moment(finish).format('MMM D, YYYY')}
        </div>
        {!isEmpty(latestEvent) && !!joinedAt && showRow && (
          <div className={cx(bem('position'), 'flex items-center flex-col')}>
            <div>
              <span className={bem('event-title')}>Your position:</span>
              <div>
                <span className={bem('event-name')}>
                  {position || participants}/{participants}
                </span>
              </div>
            </div>
          </div>
        )}
      </div>
    ),
  },
  {
    title: 'Categories',
    dataIndex: 'categories featured score latestEvent joinedAt showRow',
    render: (categories, featured, score, latestEvent, joinedAt, showRow) => (
      <div className="cell-content flex-col">
        <div
          className={cx(
            'available-icons',
            featured ? 'available-icons--featured' : ''
          )}
        >
          <CategoriesIcons categories={categories} />
        </div>
        {!isEmpty(latestEvent) && !!joinedAt && showRow && (
          <div className={cx(bem('position'), 'flex items-center flex-col')}>
            <div>
              <span className={bem('event-title')}>Your score:</span>
              <div className={bem('event-score')}>
                {score ? (
                  <Fragment>
                    <Icon name="hourglass two" />
                    <span className={bem('event-name')}>{score}</span>
                  </Fragment>
                ) : (
                  '-'
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    ),
  },
  {
    title: 'Frequency',
    sortBy: 'frequency',
    dataIndex:
      'frequency featured participants latestEvent upcomingEvent joinedAt id type challengeManager name planID showRow',
    render: (
      frequency,
      featured,
      participants,
      latestEvent,
      upcomingEvent,
      joinedAt,
      id,
      type,
      manager,
      name,
      planID,
      showRow
    ) => (
      <div className="cell-content flex-col">
        <div
          className={cx(
            bem('frequency'),
            featured ? bem('frequency__featured') : ''
          )}
        >
          {frequency}x / week
        </div>
        {!isEmpty(latestEvent) && !!joinedAt && showRow && (
          <UpcomingEvent
            challenge={{
              id,
              name,
              type,
              manager,
              planID,
              joinedAt,
              participants,
            }}
            event={upcomingEvent}
          />
        )}
      </div>
    ),
  },
  {
    title: 'Creator',
    sortBy: 'creator',
    dataIndex: 'creator creatorId',
    render: (creator, creatorId) => (
      <div className="cell-content flex flex-col">
        <Link to={`/profile/${creatorId}`} className="mt-2">
          {creator}
        </Link>
      </div>
    ),
  },
  {
    title: 'Members',
    sortBy: 'participants',
    dataIndex: 'participants featured',
    render: (participants, featured) => (
      <div className="cell-content flex flex-col">
        <span
          className={cx(
            bem('members-text'),
            featured ? bem('members-text__featured') : ''
          )}
        >
          {participants || 0}
        </span>
      </div>
    ),
  },
];
