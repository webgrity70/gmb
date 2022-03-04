import React, { useState } from 'react';
import cx from 'classnames';
import PropTypes from 'prop-types';
import { Sticky, Tab, Menu } from 'semantic-ui-react';
import withSizes from 'react-sizes';
import BEMHelper from 'react-bem-helper';
import Controls from '../../Groups/Search/Controls';
import { Filters, Search, MyGroups } from '../../Groups';

import './Groups.scss';

const bem = BEMHelper({ name: 'GroupsPage', outputIsString: true });

const Groups = ({ isMobile }) => {
  const [isFiltering, setFiltering] = useState(false);
  const [stickyFilters, setStickyFilters] = useState(false);
  const [view, setView] = useState('list');
  const showSticky = !isMobile && isFiltering;
  const tabPanes = [
    {
      menuItem: <Menu.Item key="groups">All Groups</Menu.Item>,
      render: () => (
        <Tab.Pane attached={false}>
          <Search view={view} />
        </Tab.Pane>
      ),
    },
    {
      menuItem: <Menu.Item key="myGroups">My Groups</Menu.Item>,
      render: () => (
        <Tab.Pane attached={false}>
          <MyGroups view={view} />
        </Tab.Pane>
      ),
    },
  ];
  return (
    <div className={bem()}>
      <div
        className={cx({
          'GroupsPage__browse--sticky-filters': !isMobile && stickyFilters,
        })}
      >
        {showSticky && (
          <Sticky
            onStick={() => setStickyFilters(true)}
            onUnstick={() => setStickyFilters(false)}
          >
            <Filters />
          </Sticky>
        )}
        <div>
          <Controls
            view={view}
            onSwitchView={setView}
            isFiltering={isFiltering}
            setFiltering={setFiltering}
          />
          <Tab
            panes={tabPanes}
            className={cx(bem('tabs'), { filtering: isFiltering })}
          />
        </div>
        <div className="clearfix" />
      </div>
    </div>
  );
};

Groups.propTypes = {
  isMobile: PropTypes.bool,
};

export default withSizes(({ width }) => ({
  isMobile: width < 768,
}))(Groups);
