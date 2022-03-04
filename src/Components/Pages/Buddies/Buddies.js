import React, { Component } from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import { Sticky, Tab, Menu } from 'semantic-ui-react';
import 'moment-timezone';
import withSizes from 'react-sizes';
import BuddiesService from '../../../Services/BuddiesService';
// import DesktopBanner from '../../Elements/DesktopBanner';
import ProfileService from '../../../Services/ProfileService';
import ForceCreatePlanModal from '../../Elements/ForceCreatePlanModal';
import BuddySearch from '../../Buddies/BuddySearch';
import BuddyFilters from '../../Buddies/BuddyFilters';
import SearchControls from '../../Buddies/BuddySearch/SearchControls';

import FiltersContext, {
  Provider as FiltersContextProvider,
} from '../../Buddies/FiltersContext';

import './Buddies.scss';
import MyBuddies from '../../Buddies/BuddySearch/MyBuddies';

const defaultState = {
  buddyCategories: [],
  profile: { has_plan: true },
  stickyFilters: false,
  view: 'list',
};

const BUDDIES_STATE = 'gmb-buddies-state';

class Buddies extends Component {
  constructor(props, context) {
    super(props, context);
    try {
      const savedState = sessionStorage.getItem(BUDDIES_STATE);
      this.state = savedState ? JSON.parse(savedState) : defaultState;
    } catch (e) {
      this.state = defaultState;
    }
  }

  componentDidMount() {
    this.fetchProfile();
    this.fetchBuddies();
  }

  onStickFilters = () => {
    this.setState({
      stickyFilters: true,
    });
  };

  onUnstickFilters = () => {
    this.setState({
      stickyFilters: false,
    });
  };

  fetchProfile() {
    ProfileService.getProfile()
      .then((profile) => {
        this.setState({ profile });
      })
      .catch((error) => {
        // TODO: Why is it not using redux?
        console.error(error);
      });
  }

  fetchBuddies() {
    BuddiesService.getBuddies()
      .then((data) => {
        this.setState({ buddyCategories: data });
      })
      .catch((error) => {
        console.error(error);
      });
  }

  render() {
    const { buddyCategories, profile, view, stickyFilters } = this.state;
    const { isMobile } = this.props;
    const tabPanes = [
      {
        menuItem: <Menu.Item key="buddies">All Buddies</Menu.Item>,
        render: () => (
          <Tab.Pane attached={false}>
            <BuddySearch view={view} profile={profile} />
          </Tab.Pane>
        ),
      },
      {
        menuItem: <Menu.Item key="myBuddies">My Buddies</Menu.Item>,
        render: () => (
          <Tab.Pane attached={false}>
            <MyBuddies
              buddies={buddyCategories}
              profile={profile}
              view={view}
            />
          </Tab.Pane>
        ),
      },
    ];
    return (
      <FiltersContext.Consumer>
        {({ isFiltering }) => (
          <div className="BuddiesPage">
            {/* <DesktopBanner /> */}
            <ForceCreatePlanModal
              open={!profile.has_plan}
              pathname="/buddies"
            />
            <div
              className={cx({
                'BuddiesPage__browse--sticky-filters':
                  !isMobile && stickyFilters,
              })}
            >
              {!isMobile && isFiltering ? (
                <Sticky
                  onStick={this.onStickFilters}
                  onUnstick={this.onUnstickFilters}
                >
                  <BuddyFilters />
                </Sticky>
              ) : null}
              <div>
                <SearchControls
                  view={view}
                  onSwitchView={(e) => this.setState({ view: e })}
                  profile={profile}
                />
                <Tab
                  panes={tabPanes}
                  className={cx('BuddiesPage__tabs', {
                    filtering: isFiltering,
                  })}
                />
              </div>
              <div className="clearfix" />
            </div>
          </div>
        )}
      </FiltersContext.Consumer>
    );
  }
}

Buddies.propTypes = {
  isMobile: PropTypes.bool.isRequired,
};

const BuddiesWithSizes = withSizes(({ width }) => ({
  isMobile: width < 768,
}))(Buddies);

export default function ConnectedBuddies() {
  return (
    <FiltersContextProvider>
      <BuddiesWithSizes />
    </FiltersContextProvider>
  );
}
