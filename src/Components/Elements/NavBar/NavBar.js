/* eslint-disable react/destructuring-assignment */
/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { Fragment } from 'react';
import { connect } from 'react-redux';
import { compose } from 'redux';
import cx from 'classnames';
import withSizes from 'react-sizes';
import {
  Collapse,
  Navbar,
  NavbarBrand,
  NavbarNav,
  NavbarToggler,
  NavItem,
} from 'mdbreact';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import { Icon, Dropdown } from 'semantic-ui-react';
import UpgradeTrial from '../UpgradeTrial';
import gmbLogo from '../../../Assets/images/logo.png';
import gmbLogo2x from '../../../Assets/images/logo@2x.png';
import Avatar from '../Avatar';
import './NavBar.scss';
import {
  getUserHasNoCard,
  getIsPlanInTrial,
  getUserHasPlan,
} from '../../../reducers/session/selectors';
// import ProfileProgress from '../../ProfileProgress';
import HeadwayWidget from '../../Utils/HeadwayWidget';

class NavBar extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      collapse: false,
    };
    this.navbarToggle = this.navbarToggle.bind(this);
  }

  componentDidMount() {
    document.addEventListener('mousedown', this.handleClickOutside);
  }

  componentWillUnmount() {
    document.removeEventListener('mousedown', this.handleClickOutside);
  }

  setWrapperRef = (node) => {
    this.wrapperRef = node;
  };

  toggleMobile = () => {
    const { isMobile } = this.props;
    if (isMobile) this.navbarToggle();
  };

  handleClickOutside = (event) => {
    if (
      this.wrapperRef &&
      this.state.collapse &&
      !this.wrapperRef.contains(event.target)
    ) {
      this.setState({ collapse: false });
    }
  };

  handleActiveClassNames = (path) =>
    `${this.props.pathName === path ? 'active' : ''} nav-link`;

  navbarToggle() {
    const { collapse } = this.state;
    this.setState({ collapse: !collapse });
  }

  render() {
    const { collapse } = this.state;
    const {
      user,
      logoutMethod,
      navbar,
      pathName,
      isMobile,
      showUpgradeNow,
    } = this.props;
    const shouldShowNav =
      ['/login', '/register', '/beta'].findIndex((e) =>
        new RegExp(e).test(pathName)
      ) === -1 && pathName !== '/';
    const isProfileActive =
      [
        `/profile/${user.pk}`,
        '/settings',
        '/settings/account',
        '/settings/notifications',
        '/settings/privacy',
        '/settings/security',
        '/settings/subscriptions',
      ].indexOf(window.location.pathname) !== -1;
    return (
      <div
        className={`navigation ${!navbar ? 'gmb-none' : ''}`}
        id="top-navigation"
      >
        <Navbar
          className={`navbar-fixed-shadow ${!user ? 'login-register' : ''}`}
          dark
          expand="md"
          fixed="top"
        >
          <NavbarBrand tag="div">
            <Link to="/">
              <img
                src={gmbLogo}
                srcSet={`${gmbLogo2x} 2x`}
                className="img-responsive nav logo"
                alt=""
              />
            </Link>
            {Object.keys(user).length > 0 && shouldShowNav && <HeadwayWidget />}
            {showUpgradeNow && user && <UpgradeTrial />}
          </NavbarBrand>
          {/* user && shouldShowNav && isMobile && (
            <NavItem className="profile-progress-mobile">
              <ProfileProgress name="ProfileProgressMobile" />
            </NavItem>
          ) */}
          {Object.keys(user).length > 0 && shouldShowNav && (
            <React.Fragment>
              <NavbarToggler onClick={this.navbarToggle} />
              <Collapse id="navBar" isOpen={collapse} navbar>
                <div className="ml-auto" ref={this.setWrapperRef}>
                  <NavbarNav right>
                    <React.Fragment>
                      <NavItem
                        className="main-tabs dashboard close"
                        onClick={this.toggleMobile}
                      >
                        <div className="nav-link">
                          <Icon name="close" />
                        </div>
                      </NavItem>

                      {/* // removed Discover Page from Navbar */}

                      <NavItem
                        className="main-tabs dashboard"
                        onClick={this.toggleMobile}
                      >
                        <Link
                          to="/dashboard"
                          className={this.handleActiveClassNames('/dashboard')}
                        >
                          Dashboard
                        </Link>
                      </NavItem>
                      <NavItem
                        className="main-tabs"
                        onClick={this.toggleMobile}
                      >
                        <Link
                          to="/plan"
                          className={this.handleActiveClassNames('/plan')}
                        >
                          Plan
                        </Link>
                      </NavItem>
                      <NavItem
                        className="main-tabs"
                        onClick={this.toggleMobile}
                      >
                        <Link
                          to="/buddies"
                          className={this.handleActiveClassNames('/buddies')}
                        >
                          Buddies
                        </Link>
                      </NavItem>
                      <NavItem
                        className="main-tabs"
                        onClick={this.toggleMobile}
                      >
                        <Link
                          to="/groups"
                          className={this.handleActiveClassNames('/groups')}
                        >
                          Groups
                        </Link>
                      </NavItem>
                      <NavItem
                        className="main-tabs"
                        onClick={this.toggleMobile}
                      >
                        <Link
                          to="/challenges"
                          className={this.handleActiveClassNames('/challenges')}
                        >
                          Challenges
                        </Link>
                      </NavItem>
                      <NavItem className="main-tabs">
                        <a
                          className="nav-link flex items-center"
                          rel="noopener noreferrer"
                          target="_blank"
                          href="https://intercom.help/getmotivatedbuddies/"
                        >
                          <Icon name="help circle" /> Help
                        </a>
                      </NavItem>
                      {isMobile && (
                        <Fragment>
                          <NavItem
                            className="main-tabs"
                            onClick={this.toggleMobile}
                          >
                            <Link
                              to="/profile"
                              className={this.handleActiveClassNames(
                                '/profile'
                              )}
                            >
                              Profile
                            </Link>
                          </NavItem>
                          <NavItem
                            className="main-tabs"
                            onClick={this.toggleMobile}
                          >
                            <Link
                              to="/settings"
                              className={this.handleActiveClassNames(
                                '/settings'
                              )}
                            >
                              Settings
                            </Link>
                          </NavItem>
                          <NavItem
                            className="main-tabs"
                            onClick={this.toggleMobile}
                          >
                            <div className="nav-link">
                              <a
                                className="Ripple-parent"
                                rel="noopener noreferrer"
                                target="_blank"
                                href="https://intercom.help/getmotivatedbuddies/"
                              >
                                <Icon name="help circle" /> Help
                              </a>
                            </div>
                          </NavItem>
                          <NavItem
                            className="main-tabs"
                            onClick={this.toggleMobile}
                          >
                            <Link
                              to="/login"
                              onClick={logoutMethod}
                              className="nav-link"
                            >
                              Logout
                            </Link>
                          </NavItem>
                        </Fragment>
                      )}
                      {!collapse && !isMobile && (
                        <NavItem className="main-tabs user-info">
                          <Dropdown
                            icon={null}
                            className="gmbDropdown"
                            onClick={this.toggleMobile}
                            trigger={
                              <a
                                className={cx(
                                  'trigger dropdown-toggle nav-link',
                                  {
                                    active: isProfileActive,
                                  }
                                )}
                              >
                                <div className="avatar">
                                  <Avatar avatar={user.avatar} />
                                </div>
                                <span className="userName" />
                              </a>
                            }
                          >
                            <Dropdown.Menu className="user-settings-menu">
                              <Dropdown.Item>
                                <Link
                                  to="/profile"
                                  className="nav-link dropdown-active"
                                >
                                  Profile
                                </Link>
                              </Dropdown.Item>
                              <Dropdown.Item>
                                <Link
                                  to="/settings"
                                  className="nav-link dropdown-active"
                                >
                                  Settings
                                </Link>
                              </Dropdown.Item>
                              <Dropdown.Item>
                                <Link
                                  to="/login"
                                  onClick={logoutMethod}
                                  className="nav-link dropdown-active"
                                >
                                  Logout
                                </Link>
                              </Dropdown.Item>
                            </Dropdown.Menu>
                          </Dropdown>
                        </NavItem>
                      )}
                      {/* !collapse && !isMobile && (
                        <NavItem>
                          <ProfileProgress name="ProfileProgress" />
                        </NavItem>
                      ) */}
                    </React.Fragment>
                  </NavbarNav>
                </div>
              </Collapse>
            </React.Fragment>
          )}
        </Navbar>
      </div>
    );
  }
}

NavBar.propTypes = {
  logoutMethod: PropTypes.func.isRequired,
  showUpgradeNow: PropTypes.bool.isRequired,
  navbar: PropTypes.bool.isRequired,
  pathName: PropTypes.string,
  isMobile: PropTypes.bool,
  user: PropTypes.shape({}),
  // user: Will need to refactor GMB.js to add it as propType
};

const mapStateToProps = (state) => ({
  showUpgradeNow:
    getUserHasNoCard(state) && getIsPlanInTrial(state) && getUserHasPlan(state),
});

export default compose(
  withSizes(({ width }) => ({
    isMobile: width < 768,
  })),
  connect(mapStateToProps, null)
)(NavBar);
