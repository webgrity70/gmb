import React from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import BEMHelper from 'react-bem-helper';
import cx from 'classnames';
import './ListItems.scss';
import { Icon } from 'semantic-ui-react';

const TYPES = {
  APPS: 'apps',
  GROUPS: 'groups',
};

const baseClass = 'ListItems';
const bem = BEMHelper({ name: baseClass, outputIsString: true });

function getPropsAndWrap({ item, isHoverable, type }) {
  const isApp = type === TYPES.APPS;
  const isGroup = type === TYPES.GROUPS;
  const isVerifiedApp = isApp && item.verifiedGroup;
  const isRedirectable = (isVerifiedApp || isGroup) && isHoverable;
  const Wrap = isRedirectable ? Link : 'div';
  const id = item.group || item.id;
  const props = isRedirectable
    ? { to: `/groups/${id}` }
    : { ...(isApp && { 'data-tooltip': 'Your app is not yet verified' }) };
  return { Wrap, props };
}
const ListItems = ({
  className,
  hoverable,
  items,
  onRemove,
  type,
  borderOnImage,
}) => (
  <div className={cx(baseClass, className)}>
    {items.map((item, index) => {
      const itemClassName = bem(hoverable ? 'item-hoverable' : 'item');
      const key = item.id || `item-${index}`;
      const { props, Wrap } = getPropsAndWrap({
        type,
        item,
        isHoverable: hoverable,
      });
      return (
        <div className={itemClassName} key={key}>
          {onRemove && <Icon onClick={() => onRemove(item)} name="close" />}
          <Wrap {...props}>
            <div>
              {item.icon && (
                <div
                  {...(borderOnImage && { className: bem('item-borderer') })}
                >
                  <img src={item.icon} alt={item.name} />
                </div>
              )}
              <div className={bem('details')}>
                <div className={bem('details-text')}>
                  <span>{item.name}</span>
                </div>
                {item.description && (
                  <div className={bem('details-text')}>{item.description}</div>
                )}
              </div>
            </div>
          </Wrap>
        </div>
      );
    })}
  </div>
);
ListItems.propTypes = {
  className: PropTypes.string,
  items: PropTypes.arrayOf(PropTypes.object),
  borderOnImage: PropTypes.bool,
  hoverable: PropTypes.bool,
  onRemove: PropTypes.func,
  type: PropTypes.oneOf(['groups', 'apps']),
};

ListItems.defaultProps = {
  borderOnImage: true,
  hoverable: true,
  items: [],
};

export default ListItems;
