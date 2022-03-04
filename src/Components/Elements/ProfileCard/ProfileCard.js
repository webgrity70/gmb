/* eslint-disable jsx-a11y/anchor-is-valid */
import React from 'react';
import PropTypes from 'prop-types';
import { Segment } from 'semantic-ui-react';
import _ from 'lodash';
import 'moment-timezone';
import { Link } from 'react-router-dom';
import moment from 'moment';

import AccountabilityScore from '../AccountabilityScore';
import Avatar from '../Avatar';
import Helpers from '../../Utils/Helpers';

import './ProfileCard.scss';
import CategoriesIcons from '../CategoriesIcons';
import MatchMeter from '../MatchMeter';

const ProfileCard = ({ buddy, actionsSection = null }) => {
  const accountLevel = _.get(buddy, 'levels.global.points', buddy.accountLevel);
  const nonBeta = buddy.nonBeta || buddy.non_beta || false;
  const availableCategories = _.get(
    buddy,
    'category_available',
    buddy.availableCategories
  )
    .filter(({ active }) => active)
    .map((category) => ({ ...category, active: true }));
  const id = buddy.pk || buddy.id;
  const timeZone = buddy.timezone_name || buddy.timezoneName;
  const timezoneOffset = buddy.timezone_offset || buddy.timezoneOffset;
  if (!buddy) return <React.Fragment />;
  const age = buddy.age || Helpers.calculateAge(buddy.date_of_birth);
  const lastOnline = buddy.lastOnline || buddy.last_online;

  return (
    <Segment className="ProfileCard">
      <div className="flex justify-between w-full">
        <AccountabilityScore
          points={accountLevel}
          nonbeta={nonBeta}
          className="md"
        />
        <div className="ProfileCard__avatar">
          <div>
            <Link to={`/profile/${id}`} className="mx-auto">
              <div className="image clickable">
                <div className="avatar-wrapper">
                  <Avatar avatar={buddy.avatar} />
                </div>
                {lastOnline === null && <div className="ProfileCard__online" />}
              </div>
            </Link>
          </div>
        </div>
        <div className="ProfileCard__progress">
          <MatchMeter percentage={buddy.percentage} />
        </div>
      </div>
      <div className="flex flex-col">
        <Link to={`/profile/${id}`} className="mx-auto">
          <div className="ProfileCard__name">{buddy.name}</div>
        </Link>
        {actionsSection}
        <div className="ProfileCard__description">
          <span>
            {buddy.gender && `${buddy.gender}, `}
            {age > 0 && age}
            {age > 0 && buddy.location && ', '}
          </span>
          <span>{buddy.location}</span>
        </div>
        <div className="ProfileCard__description">
          {timeZone && (
            <React.Fragment>
              {moment().tz(timeZone).zoneAbbr()}{' '}
              <span className="offset"> ({timezoneOffset} hrs. from you)</span>
            </React.Fragment>
          )}
        </div>
        {availableCategories.length > 0 && (
          <div className="ProfileCard__matchs">
            <span>Active categories:</span>
            <div>
              <CategoriesIcons categories={availableCategories} fullColor />
            </div>
          </div>
        )}
      </div>
    </Segment>
  );
};

ProfileCard.propTypes = {
  buddy: PropTypes.shape(),
  showTooltip: PropTypes.bool,
  actionsSection: PropTypes.node,
};

export default ProfileCard;
