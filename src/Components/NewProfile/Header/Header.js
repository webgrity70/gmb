/* eslint-disable no-useless-escape */
/* eslint-disable no-else-return */
import React, { useState, useEffect, Fragment } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import queryString from 'query-string';
import {
  Popup,
  Grid,
  Container,
  Button,
  Divider,
  Icon,
} from 'semantic-ui-react';
import PropTypes from 'prop-types';
import moment from 'moment';
import cx from 'classnames';
import BEMHelper from 'react-bem-helper';
import InviteFriendButton from '../../Elements/InviteFriendButton';
import useClipboardTimeout from '../../../hooks/use-clipboard-timeout';
import EditLocationModal from '../EditLocationModal';
import EditLanguagesModal from '../EditLanguagesModal';
import Avatar from '../Avatar';
import './Header.scss';
import {
  getIsSelf,
  getUserInfo,
  areLanguagesCompleted,
  isLocationCompleted,
  isBasicInfoComplete,
} from '../../../selectors/profile';
import GMBFlag from '../../Elements/Flag';
import ChatRequest from '../ChatRequest';
import InviteToAGroup from '../../Elements/InviteToAGroup';

const bem = BEMHelper({ name: 'ProfilePageHeader', outputIsString: true });

function handleMinLanguages() {
  const width = window.innerWidth;
  const isMobile = width <= 414;
  const isSM = width > 991 && width <= 1125;
  if (isSM || isMobile) return 1;
  return 2;
}

function ProfilePageHeader(props) {
  const {
    profileId,
    name,
    gender,
    age,
    timezone,
    countryCode,
    location,
    query,
    languages = [],
    canEdit,
    history,
    incompleteLanguages,
    incompleteLocation,
    incompleteBasicInfo,
  } = props;

  const [isLanguagesModalOpen, setLanguagesModalOpen] = useState(false);
  const [blockCloseLanguages, setBlockCloseLanguages] = useState(false);
  const [blockCloseLocation, setBlockCloseLocation] = useState(false);

  const [isLocationModalOpen, setLocationModalOpen] = useState(false);
  const [isProfileLinkCopied, copyProfileLink] = useClipboardTimeout(
    window.location.href,
    3000
  );

  const openLanguagesModal = () => setLanguagesModalOpen(true);
  const closeLanguagesModal = () => {
    if (canEdit && query.section === 'languages') {
      history.push(`${history.location.pathname}?section=preferences`);
    }
    setLanguagesModalOpen(false);
  };
  const openLocationModal = () => setLocationModalOpen(true);
  const closeLocationModal = () => {
    if (canEdit && query.section === 'location') {
      history.push(`${history.location.pathname}?section=completed`);
    }
    setLocationModalOpen(false);
  };
  const openSettings = () => history.push('/settings');
  function showLanguages() {
    const minLanguages = handleMinLanguages();
    const remaining = languages.length - minLanguages;
    return (
      <Fragment>
        <div
          className={cx(bem('languages'), {
            incomplete: incompleteLanguages && canEdit,
          })}
        >
          {languages.length === 0 && (
            <span className={bem('language')}>No language</span>
          )}
          {languages.slice(0, minLanguages).map((language) => (
            <div className={bem('language')} key={language.label}>
              <span className={bem('language-name')}>{language.label}</span>
              <span
                className={bem('language-proficiency')}
              >{`(${language.proficiency})`}</span>
            </div>
          ))}
          {remaining > 0 && (
            <Popup position="top center" trigger={<span>+{remaining}</span>}>
              <Popup.Content className="flex flex-col">
                {languages.map((e) => (
                  <span>
                    {e.label} ({e.proficiency}){' '}
                  </span>
                ))}
              </Popup.Content>
            </Popup>
          )}
          {canEdit && (
            <Button
              className={bem('languages-edit')}
              icon
              onClick={openLanguagesModal}
            >
              <Icon name="pencil" color="orange" />
            </Button>
          )}
        </div>
      </Fragment>
    );
  }
  function genderAgeLocationLabel() {
    const timezoneObj = moment.tz.zone(timezone);
    const timezoneAbbr = timezoneObj && timezoneObj.abbr(new Date());
    const validFields = [gender, age, timezoneAbbr].filter(Boolean);
    if (!validFields) {
      return '';
    }
    return `${validFields.join(', ')}.`;
  }
  useEffect(() => {
    if (canEdit) {
      switch (query.section) {
        case 'location': {
          setBlockCloseLocation(true);
          openLocationModal();
          break;
        }
        case 'languages': {
          setBlockCloseLanguages(true);
          openLanguagesModal();
          break;
        }
        case 'preferences': {
          const element = document.getElementById('preferences-btn');
          if (element) element.click();
          break;
        }
        default:
          break;
      }
    }
  });
  return (
    <div className={cx(bem(), { [bem('', 'editable')]: canEdit })}>
      <Container>
        <div className={cx(bem('top-actions'), 'mb-2 md:mb-0')}>
          <InviteFriendButton />
        </div>
        <Grid stackable>
          <Grid.Column computer={4} tablet={5}>
            <div className="flex-center-all">
              <Avatar profileId={profileId} />
            </div>
          </Grid.Column>
          <Grid.Column computer={12} tablet={11}>
            <div className="flex flex-col justify-center h-full md:py-2">
              <div className="flex flex-col items-center md:flex-row md:items-end">
                <div
                  className={cx(
                    bem('basic-info'),
                    'flex flex-col items-baseline md:flex-row',
                    {
                      incomplete: incompleteBasicInfo && canEdit,
                    }
                  )}
                >
                  <h2 className={bem('name')}>{name}</h2>
                  <span
                    className={cx(bem('gender-age'), 'my-2 md:my-0 md:mx-4')}
                  >
                    {genderAgeLocationLabel()}
                    {canEdit && (
                      <Button
                        className={bem('settings-edit')}
                        icon
                        onClick={openSettings}
                      >
                        <Icon name="pencil" color="orange" />
                      </Button>
                    )}
                  </span>
                </div>
                <div className={bem('right-buttons')}>
                  <>
                    {!isProfileLinkCopied ? (
                      <Popup
                        content="Share Profile"
                        on="hover"
                        trigger={
                          <div className={bem('share-profile')}>
                            <Icon
                              name="share alternate"
                              onClick={() => copyProfileLink()}
                            />
                          </div>
                        }
                      />
                    ) : (
                      <span className="mt-4 md:mt-0 md:ml-auto">
                        Copied to clipboard!
                      </span>
                    )}
                  </>
                  {!canEdit && (
                    <InviteToAGroup userId={parseInt(profileId, 10)} />
                  )}
                  {!canEdit && <ChatRequest profileId={profileId} />}
                </div>
              </div>
              <Divider />
              <div className="flex flex-col items-center md:flex-row md:items-stretch">
                <div
                  className={cx(
                    bem('languages-location'),
                    'flex flex-col items-center md:items-start lg:flex-row lg:items-stretch'
                  )}
                >
                  <div
                    className={cx(bem('location'), {
                      incomplete: incompleteLocation && canEdit,
                    })}
                  >
                    <GMBFlag className="flag mr-2" country={countryCode} />
                    {canEdit && (
                      <Button
                        className={bem('location-edit')}
                        icon
                        onClick={openLocationModal}
                      >
                        <Icon name="pencil" color="orange" />
                      </Button>
                    )}
                    {location ? (
                      <span className={bem('location-name')}>{location}</span>
                    ) : null}
                  </div>
                  <div className={bem('languages-divider')} />
                  {showLanguages()}
                </div>
              </div>
            </div>
          </Grid.Column>
        </Grid>
      </Container>
      <EditLanguagesModal
        profileId={profileId}
        open={isLanguagesModalOpen}
        onClose={closeLanguagesModal}
        blockClose={blockCloseLanguages}
      />
      <EditLocationModal
        profileId={profileId}
        open={isLocationModalOpen}
        onClose={closeLocationModal}
        blockClose={blockCloseLocation}
      />
    </div>
  );
}

ProfilePageHeader.propTypes = {
  name: PropTypes.string,
  profileId: PropTypes.string,
  timezone: PropTypes.string,
  gender: PropTypes.string,
  age: PropTypes.number,
  countryCode: PropTypes.string,
  location: PropTypes.string,
  incompleteLanguages: PropTypes.bool,
  incompleteLocation: PropTypes.bool,
  languages: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string,
      proficiency: PropTypes.string,
    })
  ),
  canEdit: PropTypes.bool,
  history: PropTypes.shape(),
  incompleteBasicInfo: PropTypes.bool,
  query: PropTypes.shape(),
};

const mapStateToProps = (state, props) => {
  const userInfo = getUserInfo(state, props) || {};
  return {
    name: userInfo.name,
    gender: userInfo.gender,
    timezone: userInfo.timezone,
    age: userInfo.age,
    countryCode: userInfo.country_iso
      ? userInfo.country_iso.toLowerCase()
      : undefined,
    location: userInfo.location,
    languages: userInfo.languages,
    canEdit: getIsSelf(state, props),
    incompleteLanguages: !areLanguagesCompleted(state, props),
    incompleteLocation: !isLocationCompleted(state, props),
    incompleteBasicInfo: !isBasicInfoComplete(state, props),
    query: queryString.parse(props.history.location.search),
  };
};

const ConnectedProfilePageHeader = connect(
  mapStateToProps,
  {}
)(ProfilePageHeader);

ConnectedProfilePageHeader.propTypes = {
  profileId: PropTypes.string,
};

export default withRouter(ConnectedProfilePageHeader);
