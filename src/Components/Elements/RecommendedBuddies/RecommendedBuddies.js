/* eslint-disable camelcase */
import React from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import { Link } from 'react-router-dom';

import AccountabilityScore from '../AccountabilityScore';
import Avatar from '../Avatar';
import TimeFromYou from '../TimeFromYou';
import SortableHeader from '../SortableHeader';
import { TrackEvent } from '../../../Services/TrackEvent';
import CategoriesIcons from '../CategoriesIcons';
import MatchMeter from '../MatchMeter';
import './RecommendedBuddies.scss';

const RecommendedBuddies = ({
  buddies,
  orderBy,
  order,
  onOrderChange,
  showPercentage,
}) => {
  const trackUserProfile = (name, id) => {
    TrackEvent('buddies-search-user', { name, id });
  };

  return (
    <div className="RecommendedBuddies">
      <div className="table-responsive">
        <table className="table table-bordered">
          <thead>
            <tr>
              <SortableHeader
                label="Name"
                currentOrder={orderBy}
                order={order}
                orderBy="name"
                onOrderChange={onOrderChange}
              />
              <SortableHeader
                label="Score"
                currentOrder={orderBy}
                order={order}
                orderBy="score"
                onOrderChange={onOrderChange}
              />
              {showPercentage && (
                <SortableHeader
                  label="Match"
                  currentOrder={orderBy}
                  order={order}
                  orderBy="similarity"
                  onOrderChange={onOrderChange}
                />
              )}
              <th>Active</th>
              <SortableHeader
                label="Timezone"
                currentOrder={orderBy}
                order={order}
                orderBy="timezone_distance"
                onOrderChange={onOrderChange}
              />
            </tr>
          </thead>
          <tbody>
            {_.map(
              buddies,
              ({
                id,
                avatar,
                name,
                accountLevel,
                nonBeta,
                gender,
                percentage,
                location,
                timezoneName,
                timezoneOffset,
                availableCategories,
                lastOnline,
                last_online,
              }) => (
                <tr key={id}>
                  <td className="RecommendedBuddies__name">
                    <Link
                      to={`/profile/${id}`}
                      onClick={() => trackUserProfile(name, id)}
                    >
                      <div className="avatar">
                        <div>
                          <Avatar avatar={avatar} />
                        </div>
                        {(lastOnline === null || last_online === null) && (
                          <div className="RecommendedBuddies__online" />
                        )}
                      </div>
                      <div className="name">
                        <p> {name} </p>
                        <small>
                          {' '}
                          {gender}
                          {gender && location && ','} {location}{' '}
                        </small>
                      </div>
                    </Link>
                  </td>
                  <td>
                    <AccountabilityScore
                      points={accountLevel}
                      nonbeta={nonBeta}
                      className="xs"
                    />
                  </td>
                  {showPercentage && (
                    <td>
                      <div className="px-4 match-meter-container">
                        <MatchMeter percentage={percentage} />
                      </div>
                    </td>
                  )}
                  <td>
                    <div className="RecommendedBuddies__category-icons">
                      <CategoriesIcons
                        categories={availableCategories}
                        fullColor
                      />
                    </div>
                  </td>
                  <td className="timezone">
                    <TimeFromYou
                      timeZoneName={timezoneName}
                      timeZoneOffset={timezoneOffset}
                    />
                  </td>
                </tr>
              )
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
RecommendedBuddies.propTypes = {
  orderBy: PropTypes.string,
  order: PropTypes.string,
  onOrderChange: PropTypes.func,
  buddies: PropTypes.arrayOf(PropTypes.object),
  showPercentage: PropTypes.bool,
};

RecommendedBuddies.defaultProps = {
  showPercentage: true,
};

export default RecommendedBuddies;
