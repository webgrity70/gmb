/* eslint-disable jsx-a11y/anchor-is-valid */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */
import React from 'react';
import cx from 'classnames';
import PropTypes from 'prop-types';
import BEMHelper from 'react-bem-helper';
import { Checkbox, Form, Icon } from 'semantic-ui-react';
import './CardType.scss';

const bem = BEMHelper({ name: 'CardType', outputIsString: true });

const CardType = ({
  name,
  description,
  customContent,
  link,
  active,
  icon,
  value,
  onClick,
  showShadow,
  showBorder,
}) => (
  <div
    className={cx(bem(), { active, showBorder, showShadow })}
    onClick={() => onClick && onClick()}
  >
    <div>
      <div className={bem('header')}>
        <Form.Field>
          <Checkbox radio value={value} checked={active} onChange={onClick} />
        </Form.Field>
        <h3>{name}</h3>
        {icon && <Icon name={icon} />}
      </div>
      <p>{description}</p>
    </div>
    {link && <a onClick={() => window.open(link.url)}>{link.label}</a>}
    {customContent && customContent()}
  </div>
);

CardType.propTypes = {
  name: PropTypes.string,
  description: PropTypes.string,
  active: PropTypes.bool,
  onClick: PropTypes.func,
  value: PropTypes.string,
  showShadow: PropTypes.bool,
  showBorder: PropTypes.bool,
  icon: PropTypes.string,
  link: PropTypes.oneOfType([PropTypes.object, PropTypes.oneOf([null])]),
  customContent: PropTypes.func,
};

CardType.defaultProps = {
  showBorder: true,
  showShadow: true,
};

export default CardType;
