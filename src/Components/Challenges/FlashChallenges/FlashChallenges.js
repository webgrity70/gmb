import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import moment from 'moment';
import BEMHelper from 'react-bem-helper';
import { Icon, Popup } from 'semantic-ui-react';
import ChallengesGrid from '../ChallengesGrid';
import {
  fetchFlashChallenges as fetchFlashChallengesAction,
  changeIntervalDate as changeIntervalDateAction,
} from '../../../Actions/actions_challenges';
import { getIntervalDate } from '../../../selectors/challenges';
import './FlashChallenges.scss';

const bem = BEMHelper({ name: 'FlashChallenges', outputIsString: true });

function FlashChallenges({
  changeIntervalDate,
  intervalDate,
  fetchFlashChallenges,
  myChallenges = false,
}) {
  const canNavigatePrev = intervalDate.startDate.clone().isAfter(moment());
  function onChangeInterval(type) {
    if (type === 'next') {
      const startDate = intervalDate.endDate.clone().add(1, 'day');
      changeIntervalDate({
        startDate,
        endDate: startDate.clone().add(7, 'days'),
      });
    } else {
      const endDate = intervalDate.startDate.clone().subtract(1, 'day');
      changeIntervalDate({
        startDate: endDate.clone().subtract(7, 'days'),
        endDate,
      });
    }
  }

  useEffect(() => {
    fetchFlashChallenges(intervalDate);
  }, [intervalDate]);

  return (
    <div className={bem()}>
      <div className="flex justify-between flex-wrap">
        <div className={bem('title')}>
          <Icon name="lightning" />
          <h5>Flash Challenges</h5>
          <Popup
            trigger={<i className="fas fa-question-circle ml-2 pointer" />}
            on="click"
            hoverable
            inverted
          >
            A Flash Challenge is a one off event that you can do with others
            anywhere in the world. Ignite your impulse to take action now.
          </Popup>
        </div>
        <div className={bem('interval')}>
          {canNavigatePrev && (
            <Icon
              name="chevron left"
              onClick={() => onChangeInterval('prev')}
            />
          )}
          <span>
            {intervalDate.startDate.clone().format('MMM DD')} -{' '}
            {intervalDate.endDate.clone().format('MMM DD')}{' '}
          </span>
          <Icon name="chevron right" onClick={() => onChangeInterval('next')} />
        </div>
      </div>
      <ChallengesGrid
        startDate={intervalDate.startDate.clone().format()}
        endDate={intervalDate.endDate.clone().format()}
        myChallenges={myChallenges}
      />
    </div>
  );
}
FlashChallenges.propTypes = {
  fetchFlashChallenges: PropTypes.func,
  changeIntervalDate: PropTypes.func,
  intervalDate: PropTypes.shape(),
};

export default connect((state) => ({ intervalDate: getIntervalDate(state) }), {
  fetchFlashChallenges: fetchFlashChallengesAction,
  changeIntervalDate: changeIntervalDateAction,
})(FlashChallenges);
