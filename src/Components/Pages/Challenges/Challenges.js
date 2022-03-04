import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { change } from 'redux-form';
import BEMHelper from 'react-bem-helper';
import PropTypes from 'prop-types';
import moment from 'moment-timezone';
import { Tab, Menu, Icon, Dropdown } from 'semantic-ui-react';
import FlashChallenges from '../../Challenges/FlashChallenges';
import RegularChallenges from '../../Challenges/RegularChallenges';
import {
  fetchFlashChallenges as fetchFlashChallengesAction,
  fetchChallengeDetails as fetchChallengeDetailsAction,
} from '../../../Actions/actions_challenges';
import BehaviorModal from '../../NewPlan/BehaviorModal';
import {
  getIntervalDate,
  getChallengeInviteData,
} from '../../../selectors/challenges';
import ChallengeDetailsModal from '../../Challenges/ChallengeDetailsModal';
import history from '../../../history';
import './Challenges.scss';

const bem = BEMHelper({ name: 'ChallengesPage', outputIsString: true });
const formName = 'new-flash-challenge';

function Challenges({
  changeForm,
  intervalDate,
  computedMatch,
  challengeData,
  fetchFlashChallenges,
  fetchChallengeDetails,
}) {
  const [openBehaviorModal, setOpenBehaviorModal] = useState(false);
  const [openDetailsModal, setOpenDetailsModal] = useState(false);
  useEffect(() => {
    async function fetchData() {
      await fetchChallengeDetails(computedMatch.params.id, true);
      setOpenDetailsModal(true);
    }
    if (computedMatch.params.type === 'flash') {
      fetchData();
    }
  }, [computedMatch.params]);
  const startDate = moment();
  const endDate = moment().add(12, 'weeks');
  const formIntervalDate = { startDate, endDate };

  function onOpenModal() {
    changeForm(formName, 'challenge.active', true);
    changeForm(formName, 'type', 'single');
    changeForm(formName, 'date', moment());
    setOpenBehaviorModal(true);
  }
  function onCloseDetailsModal(reload) {
    if (reload) fetchFlashChallenges(intervalDate);
    setOpenDetailsModal(false);
  }
  function onCloseBehaviorModal(created) {
    if (created) fetchFlashChallenges(intervalDate);
    setOpenBehaviorModal(false);
  }
  const tabPanes = [
    {
      menuItem: <Menu.Item key="buddies">All Challenges</Menu.Item>,
      render: () => (
        <Tab.Pane attached={false}>
          <FlashChallenges />
          <RegularChallenges />
        </Tab.Pane>
      ),
    },
    {
      menuItem: <Menu.Item key="myBuddies">My Challenges</Menu.Item>,
      render: () => (
        <Tab.Pane attached={false}>
          <FlashChallenges myChallenges />
          <RegularChallenges myChallenges />
        </Tab.Pane>
      ),
    },
  ];
  return (
    <div className={bem()}>
      <div className={bem('container')}>
        <div className="flex items-center justify-center mb-8 flex-wrap">
          <h2 className={bem('title')}> Browse Challenges or...</h2>
          <Dropdown text="CREATE ONE" className={bem('create')}>
            <Dropdown.Menu>
              <Dropdown.Item onClick={onOpenModal}>
                <Icon name="lightning" />
                Flash Challenge
              </Dropdown.Item>
              <Dropdown.Item onClick={() => history.push('/challenges/new')}>
                <Icon name="hourglass half" />
                Regular Challenge
              </Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        </div>
        <Tab panes={tabPanes} className={bem('tabs')} />
      </div>
      <BehaviorModal
        open={openBehaviorModal}
        onClose={onCloseBehaviorModal}
        planEndDate={moment().add(12, 'weeks')}
        type="single"
        form={formName}
        currentIntervalDate={formIntervalDate}
        title="New flash challenge"
        hideOptions
        isFlashChallenge
        isSingleEvent
      />
      {challengeData && (
        <ChallengeDetailsModal
          id={Number(computedMatch.params.id)}
          open={openDetailsModal}
          onClose={onCloseDetailsModal}
          challenge={challengeData}
        />
      )}
    </div>
  );
}

Challenges.propTypes = {
  changeForm: PropTypes.func,
  challengeData: PropTypes.shape(),
  intervalDate: PropTypes.shape(),
  computedMatch: PropTypes.shape(),
  fetchChallengeDetails: PropTypes.func,
  fetchFlashChallenges: PropTypes.func,
};

const mapStateToProps = (state, props) => ({
  intervalDate: getIntervalDate(state),
  challengeData: getChallengeInviteData(state, props),
});

export default connect(mapStateToProps, {
  changeForm: change,
  fetchFlashChallenges: fetchFlashChallengesAction,
  fetchChallengeDetails: fetchChallengeDetailsAction,
})(Challenges);
