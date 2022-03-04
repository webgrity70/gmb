import React, { useContext, useState } from 'react';
import { connect } from 'react-redux';
import moment from 'moment';
import PropTypes from 'prop-types';
import omit from 'lodash/omit';
import BEMHelper from 'react-bem-helper';
import { Grid, Icon, Button } from 'semantic-ui-react';
import cx from 'classnames';
import Countdown from 'react-countdown';
import {
  getGlobalFlashChallenge,
  getIntervalDate,
} from '../../../selectors/challenges';
import { getSlug } from '../../NewPlan/utils';
import { CategoryIcon } from '../../Elements/CategoriesIcons';
import PlanContext from '../../Plan/PlanContext';
import Counter from '../../Dashboard/Counter';
import ChallengeDetailsModal from '../ChallengeDetailsModal';
import parseTimeFormat from '../../../utils/parseTimeFormat';
import {
  removeOnGoing as removeOnGoingAction,
  fetchFlashChallenges as fetchFlashChallengesAction,
} from '../../../Actions/actions_challenges';
import './ChallengeCard.scss';

const bem = BEMHelper({ name: 'ChallengeCard', outputIsString: true });

function ChallengeCard({
  challenge,
  removeOnGoing,
  intervalDate,
  fetchFlashChallenges,
  myChallenges = false,
  index,
}) {
  const [openDetailsModal, setOpenDetailsModal] = useState(false);
  const { timeFormat } = useContext(PlanContext);
  const slug = getSlug(challenge.event.category);
  const startDate = moment(challenge.event.date);
  const endDate = startDate.clone().add(challenge.event.duration, 'minutes');
  const [time, format] = startDate
    .clone()
    .format(parseTimeFormat(timeFormat, startDate))
    .split(' ');

  const challengeDateIsOnGoing = moment() > startDate && moment() < endDate;
  const [isOnGoing, setIsOnGoing] = useState(challengeDateIsOnGoing);

  function renderStatus() {
    if (isOnGoing) {
      return (
        <>
          <span>Ending in:</span>
          <Countdown date={endDate.clone().format()} renderer={Counter} />
        </>
      );
    }
    if (moment() < startDate) {
      return (
        <>
          <span>
            Starts {startDate.diff(moment(), 'hours') < 6 && 'soon'} in:
          </span>
          <Countdown
            date={startDate.clone().format()}
            renderer={Counter}
            onComplete={() => setIsOnGoing(true)}
          />
        </>
      );
    }
    return null;
  }
  function onClose(reload) {
    if (reload) {
      removeOnGoing(challenge.id);
      fetchFlashChallenges(intervalDate);
    }
    setOpenDetailsModal(false);
  }
  const modalData = {
    ...omit(challenge, 'event'),
    ...challenge.event,
    checkInWindowEnd: moment(challenge.event.date).add(
      Number(challenge.event.duration) + 60,
      'minutes'
    ),
    planId: challenge.planID,
    eventId: challenge.event.eventID,
  };

  if (myChallenges && challenge.joinedAt === null) {
    return null;
  }

  return (
    <Grid.Column
      className={cx({
        [bem('middle')]: index % 3 === 1,
        [bem('left')]: index % 3 === 0,
        [bem('right')]: index % 3 === 2,
      })}
    >
      <ChallengeDetailsModal
        id={challenge.id}
        challenge={modalData}
        open={openDetailsModal}
        onClose={onClose}
        onOpen={() => setOpenDetailsModal(true)}
        trigger={
          <div className={bem(null, { featured: challenge.featured })}>
            <div
              className={bem('header', [
                slug,
                challenge.featured && 'featured',
              ])}
            >
              <CategoryIcon slug={slug} active colorNoCircle />
              <span>
                {startDate.clone().format('ddd, MMM DD YYYY').toUpperCase()}
              </span>
              {challenge.featured && (
                <div className={bem('featured')}>
                  <Icon name="star outline" />
                  Featured
                </div>
              )}
            </div>
            <div
              className={cx(
                bem('body', { featured: challenge.featured }),
                'py-4 px-6 flex flex-1 flex-col'
              )}
            >
              <div className="flex flex-1">
                <div className={bem('time')}>
                  <span>{time}</span>
                  {format && <span>{format.toUpperCase()}</span>}
                </div>
                <div className={bem('title')}>
                  <h6>{challenge.name}</h6>
                  <span>{challenge.participants} members</span>
                </div>
              </div>
              <div className="flex pt-5 justify-between items-end">
                <div
                  className={bem('starts', challenge.featured && 'featured')}
                >
                  {renderStatus()}
                </div>
                <div>
                  <Button className={bem('info')}>More Info</Button>
                </div>
              </div>
            </div>
          </div>
        }
      />
    </Grid.Column>
  );
}

ChallengeCard.propTypes = {
  challenge: PropTypes.shape(),
  intervalDate: PropTypes.shape(),
  removeOnGoing: PropTypes.func,
  fetchFlashChallenges: PropTypes.func,
};

export default ChallengeCard;

const globalMapStateToProps = (state, { id }) => ({
  challenge: getGlobalFlashChallenge(state, { id }),
  intervalDate: getIntervalDate(state),
});

export const GlobalFlashChallengeCard = connect(globalMapStateToProps, {
  removeOnGoing: removeOnGoingAction,
  fetchFlashChallenges: fetchFlashChallengesAction,
})(ChallengeCard);
