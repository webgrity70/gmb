import React from 'react';
import { connect } from 'react-redux';
import { Container, Grid, Message } from 'semantic-ui-react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import BEMHelper from 'react-bem-helper';
import AboutModuleCard from '../AboutModuleCard';
import AppsModuleCard from '../AppsModuleCard';
import GroupsModuleCard from '../GroupsModuleCard';
import NegativeBehaviourModuleCard from '../NegativeBehaviourModuleCard';
import PsychologyModuleCard from '../PsychologyModuleCard';
import PreferencesModuleCard from '../PreferencesModuleCard';

import './Information.scss';
import * as profileSelectors from '../../../selectors/profile';

const bem = BEMHelper({ name: 'ProfilePageInformation', outputIsString: true });

function ProfilePageInformation(props) {
  const {
    className,
    profileId,
    areBehavioursPrivate,
    areGroupsPrivate,
    percentage,
    isSelf,
  } = props;

  const getPrivacyLabel = (priv) => (priv ? 'Private' : 'Public');

  return (
    <div className={cx(bem(), className)}>
      <Container>
        <Grid stackable padded={false}>
          <Grid.Column tablet={16}>
            {isSelf && parseInt(percentage, 10) < 99 && (
              <Message
                className={cx(bem('blink'), 'text-center')}
                warning
                header="Please complete your profile."
              />
            )}
            <AboutModuleCard profileId={profileId} />
          </Grid.Column>
          <Grid.Column tablet={8}>
            <PsychologyModuleCard profileId={profileId} />
          </Grid.Column>
          <Grid.Column tablet={8}>
            <div>
              <PreferencesModuleCard profileId={profileId} />
              <NegativeBehaviourModuleCard
                profileId={profileId}
                privacy={getPrivacyLabel(areBehavioursPrivate)}
              />
            </div>
          </Grid.Column>
          <Grid.Column tablet={8}>
            <GroupsModuleCard
              profileId={profileId}
              privacy={getPrivacyLabel(areGroupsPrivate)}
            />
          </Grid.Column>
          <Grid.Column tablet={8}>
            <AppsModuleCard profileId={profileId} />
          </Grid.Column>
        </Grid>
      </Container>
    </div>
  );
}

ProfilePageInformation.propTypes = {
  className: PropTypes.string,
  profileId: PropTypes.string,
  areGroupsPrivate: PropTypes.bool,
  areBehavioursPrivate: PropTypes.bool,
  percentage: PropTypes.string,
  isSelf: PropTypes.bool,
};

const mapStateToProps = (state, props) => ({
  areGroupsPrivate: profileSelectors.getAreGroupsPrivate(state, props),
  areBehavioursPrivate: profileSelectors.getAreBehavioursPrivate(state, props),
  percentage: profileSelectors.getProfilePercentage(state, props),
  isSelf: profileSelectors.getIsSelf(state, props),
});

const ConnectedProfilePageInformation = connect(
  mapStateToProps,
  {}
)(ProfilePageInformation);

ConnectedProfilePageInformation.propTypes = {
  profileId: PropTypes.string.isRequired,
};

export default ConnectedProfilePageInformation;
