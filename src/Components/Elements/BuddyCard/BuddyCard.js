import React from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import _ from 'lodash';

import AccountabilityScore from '../AccountabilityScore';
import CategoryIcon from '../../Utils/CategoryIcon';
import Avatar from '../Avatar';
import './BuddyCard.scss';

const BuddyCard = ({ category, buddy }) => {
  const accountLevel = _.get(buddy, 'levels.global.points', buddy.accountLevel);
  const nonBeta = buddy.nonBeta || buddy.non_beta || false;
  const id = buddy.pk || buddy.id;
  return (
    <div className="BuddyCard">
      <div
        className={`BuddyCard__header ${category.slug}`}
        style={{ opacity: id ? 1 : 0.5 }}
      >
        {CategoryIcon.renderColorfulIcon(category.slug, true)}
      </div>
      <div className="BuddyCard__content">
        <Link
          className="BuddyCard__buddy clickable"
          disabled={id === undefined}
          to={`/profile/${id}`}
        >
          {id && (
            <div
              className="BuddyCard__avatar"
              style={{ display: id ? '' : 'none' }}
            >
              <Avatar avatar={buddy.avatar} />
            </div>
          )}
          <div className="BuddyCard__name">
            {id && buddy.name}
            {id && (
              <AccountabilityScore
                points={accountLevel}
                nonbeta={nonBeta}
                className="xs"
              />
            )}
          </div>
        </Link>
      </div>
    </div>
  );
};

BuddyCard.propTypes = {
  category: PropTypes.shape({
    slug: PropTypes.string,
  }).isRequired,
  buddy: PropTypes.shape({
    pk: PropTypes.number,
    avatar: PropTypes.object,
    name: PropTypes.string,
    levels: PropTypes.object,
  }).isRequired,
};

export default BuddyCard;
