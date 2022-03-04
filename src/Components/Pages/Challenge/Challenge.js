import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Icon } from 'semantic-ui-react';
import BEMHelper from 'react-bem-helper';
import { fetchChallengeDetails as fetchChallengeDetailsAction } from '../../../Actions/actions_challenges';
import TabsContainer from '../../Elements/TabsContainer/TabsContainer';
import { getChallengeDetails } from '../../../selectors/challenges';
import Header from '../../Challenges/ChallengerHeader';
import Calendar from '../../Challenges/ChallengeCalendar';
import Members from '../../Challenges/ChallengeMembers';
import ComingSoon from '../../Elements/ComingSoon';
import './Challenge.scss';

const bem = BEMHelper({ name: 'ChallengePage', outputIsString: true });

function Challenge({
  user,
  challenge,
  match: {
    params: { id },
  },
  fetchChallengeDetails,
}) {
  useEffect(() => {
    fetchChallengeDetails(id, true);
  }, [id, fetchChallengeDetails]);
  if (!challenge) return null;
  const panes = [
    {
      title: 'Calendar',
      titleIcon: <Icon name="calendar" />,
      Component: Calendar,
      props: { id: Number(id), user },
    },
    {
      title: 'Challenge Stats',
      titleIcon: <Icon name="line graph" />,
      Component: ComingSoon,
    },
    {
      title: 'Posts',
      titleIcon: <Icon name="bullhorn" />,
      Component: ComingSoon,
    },
  ];
  return (
    <div className={bem()}>
      <Header myUserId={user.pk} {...challenge} />
      <div className={bem('tabs')}>
        <TabsContainer panes={panes} />
      </div>
      <Members id={Number(id)} participants={challenge.participants} />
    </div>
  );
}

Challenge.propTypes = {
  match: PropTypes.shape(),
  user: PropTypes.shape(),
  challenge: PropTypes.shape(),
  fetchChallengeDetails: PropTypes.func,
};

const mapStateToProps = (state, props) => ({
  challenge: getChallengeDetails(state, props),
});

export default connect(mapStateToProps, {
  fetchChallengeDetails: fetchChallengeDetailsAction,
})(Challenge);
