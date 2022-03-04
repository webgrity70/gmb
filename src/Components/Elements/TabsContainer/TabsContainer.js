/* eslint-disable react/default-props-match-prop-types */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */
import React, { useState } from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import BEMHelper from 'react-bem-helper';
import useForceUpdate from '../../../utils/useForceUpdate';
import './TabsContainer.scss';

const bem = BEMHelper({ name: 'TabsContainer', outputIsString: true });

const TabsContainer = ({ panes, onChange, headerClassName, currentTab }) => {
  const [currentTabIndex, setTab] = useState(currentTab || 0);
  const activeTabIndex = onChange ? currentTab : currentTabIndex;
  const forceUpdate = useForceUpdate();

  const renderBody = () => {
    const { Component, props } = panes[activeTabIndex];
    return (
      <div className={cx(bem('body'), 'body ui attached active tab segment')}>
        <Component {...props} />
      </div>
    );
  };
  const changeTab = (index) => {
    if (onChange) onChange(index);
    if (index !== activeTabIndex && !onChange) setTab(index);
    else forceUpdate();
  };
  const renderHeader = () => (
    <div
      className={cx(
        bem('header'),
        'ui top attached tabular menu',
        headerClassName || null
      )}
    >
      {panes.map((pane, index) => {
        if (!panes[index].Component) return <div className="item" />;
        const { titleIcon, ExtraTitle, title } = pane;
        const key = `${title.replace(/\s/g, '')}-${index}`;
        const activeClass = index === activeTabIndex && 'active';
        const className = cx('item', 'pointer', activeClass);
        return (
          <div className={className} onClick={() => changeTab(index)} key={key}>
            {titleIcon && <div className={bem('header-icon')}>{titleIcon}</div>}
            <span>{title}</span>
            {ExtraTitle && (
              <div className={bem('header-extra')}>
                <ExtraTitle />
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
  return (
    <div className="TabsContainer">
      {renderHeader()}
      {renderBody()}
    </div>
  );
};

TabsContainer.propTypes = {
  onChange: PropTypes.func,
  headerClassName: PropTypes.string,
  currentTab: PropTypes.oneOfType([PropTypes.number, PropTypes.oneOf([null])]),
  panes: PropTypes.arrayOf(
    PropTypes.shape({
      title: PropTypes.string.isRequired,
      titleIcon: PropTypes.element,
      Component: PropTypes.oneOfType([
        PropTypes.element,
        PropTypes.func,
        PropTypes.object,
      ]),
      ExtraTitle: PropTypes.oneOfType([PropTypes.element, PropTypes.func]),
    })
  ).isRequired,
};

TabsContainer.defaultProps = {
  panes: [],
};

export default TabsContainer;
