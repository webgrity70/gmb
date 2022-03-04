import React, { Fragment } from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import BEMHelper from 'react-bem-helper';
import { Dropdown } from 'semantic-ui-react';
import './Dropdown.scss';

const baseClass = 'GMBDropdown';
const bem = BEMHelper({ name: baseClass, outputIsString: true });

const GMBDropdown = ({ Title, options, className, text }) => {
  const menuClassName = classNames(baseClass, className);
  return (
    <Dropdown
      className={menuClassName}
      floating
      {...(Title && !text && { trigger: Title })}
      {...(text && { text })}
      {...(!text && { icon: false })}
    >
      <Dropdown.Menu className={bem('container')}>
        {options.map((option) => {
          switch (option.type) {
            case 'label':
              return <div className={bem('label')}>{option.text}</div>;
            case 'divider':
              return <div className={bem('divider')} />;
            default:
              return (
                <Dropdown.Item
                  key={option.text.replace(/\s/g, '')}
                  className={bem('item')}
                  onClick={option.onClick}
                >
                  {option.icon}
                  {option.text}
                </Dropdown.Item>
              );
          }
        })}
      </Dropdown.Menu>
    </Dropdown>
  );
};

GMBDropdown.propTypes = {
  Title: PropTypes.node,
  className: PropTypes.string,
  text: PropTypes.string,
  options: PropTypes.arrayOf(
    PropTypes.shape({
      onClick: PropTypes.func,
      text: PropTypes.string,
    })
  ),
};

GMBDropdown.defaultProps = {
  Title: (
    <Fragment>
      <div className={bem('dot')} />
      <div className={bem('dot')} />
      <div className={bem('dot')} />
    </Fragment>
  ),
  options: [],
};

export default GMBDropdown;
