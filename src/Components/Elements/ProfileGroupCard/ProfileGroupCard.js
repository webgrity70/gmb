import React from 'react';
import PropTypes from 'prop-types';
import { Segment, Icon } from 'semantic-ui-react';
import 'moment-timezone';
import { Link } from 'react-router-dom';
import BEMHelper from 'react-bem-helper';
import CategoriesIcons from '../CategoriesIcons';
import calculateTZOffset from '../../../utils/calculateTZOffset';
import { GroupColumn, ScorerColumn } from '../Table';
import './ProfileGroupCard.scss';

const bem = BEMHelper({ name: 'ProfileGroupCard', outputIsString: true });

const TYPES = {
  PRIVATE: 'private',
};

const ProfileCard = ({ group }) => {
  if (!group) return null;
  return (
    <Segment className={bem()}>
      <div to={`/groups/${group.id}`} className={bem('avatar')}>
        <GroupColumn {...group} onlyIcon />
        <ScorerColumn accountLevel={group.score} />
        <div className={bem('location')}>{group.location}</div>
        <div className={bem('privacy')}>
          <Icon
            name={
              group.privacy === TYPES.PRIVATE
                ? 'circle outline'
                : 'circle notch'
            }
          />
          <div className={bem('privacy-text')}>
            {group.privacy === TYPES.PRIVATE ? 'Closed' : 'Open'}
          </div>
        </div>
      </div>
      <div className={bem('content')}>
        <div className={bem('details')}>
          <h4>{group.name}</h4>
          <span>{calculateTZOffset(group.timezone, group.timezoneOffset)}</span>
          <div>
            <CategoriesIcons categories={group.categories} />
          </div>
        </div>
        <Link to={`/groups/${group.id}`}>View Group</Link>
      </div>
    </Segment>
  );
};

ProfileCard.propTypes = {
  group: PropTypes.shape({
    id: PropTypes.number,
    timezone: PropTypes.string,
    timezoneOffset: PropTypes.number,
    score: PropTypes.number,
    privacy: PropTypes.string,
    locatioon: PropTypes.string,
  }),
};

export default ProfileCard;
