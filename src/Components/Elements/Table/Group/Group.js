import React from 'react';
import { Icon } from 'semantic-ui-react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import BEMHelper from 'react-bem-helper';
import transformGroupType from '../../../../utils/transformGroupType';
import { GROUP_STAFF } from '../../../../constants';
import './Group.scss';

const TYPES = {
  PRIVATE: 'Private',
};

const bem = BEMHelper({ name: 'TableGroup', outputIsString: true });

const GroupColumn = ({
  id,
  name,
  location,
  privacy,
  icon,
  onlyIcon,
  featured,
  official,
  subTitle,
  membershipLevel,
  type,
}) => (
  <Link className={bem()} to={`/groups/${id}`}>
    <div className={bem('icon')}>
      <img src={icon} alt={name} />
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
          <Icon
            name={privacy === TYPES.PRIVATE ? 'circle outline' : 'circle notch'}
          />
          {name}
          {subTitle && <span className={bem('sub-title')}>{subTitle}</span>}
          {GROUP_STAFF.includes(membershipLevel) && (
            <span className={bem('permission')}>{membershipLevel}</span>
          )}
        </div>
        <div className={bem('description-details')}>
          {type !== 'Other' && (
            <span className={bem('description-details--type')}>
              {transformGroupType(type)}
            </span>
          )}
          <span className={bem('description-details--location')}>
            {location}
          </span>
        </div>
      </div>
    )}
  </Link>
);

GroupColumn.propTypes = {
  id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  privacy: PropTypes.string,
  icon: PropTypes.string,
  name: PropTypes.string,
  onlyIcon: PropTypes.bool,
  featured: PropTypes.bool,
  official: PropTypes.bool,
  membershipLevel: PropTypes.string,
  type: PropTypes.string,
  subTitle: PropTypes.string,
  location: PropTypes.oneOfType([PropTypes.string, PropTypes.oneOf([null])]),
};

GroupColumn.defaultProps = {
  onlyIcon: false,
};

export default GroupColumn;
