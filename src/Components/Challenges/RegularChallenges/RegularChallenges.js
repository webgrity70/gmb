import React from 'react';
import BEMHelper from 'react-bem-helper';
import { Icon, Popup } from 'semantic-ui-react';
import RegularTable from '../RegularTable';
import './RegularChallenges.scss';

const bem = BEMHelper({ name: 'RegularChallenges', outputIsString: true });

function RegularChallenges({ myChallenges = false }) {
  return (
    <div className={bem()}>
      <div className="flex justify-between flex-wrap">
        <div className={bem('title')}>
          <Icon name="hourglass two" />
          <h5>Regular Challenges</h5>
          <Popup
            trigger={<i className="fas fa-question-circle ml-2 pointer" />}
            on="click"
            hoverable
            inverted
          >
            A regular challenge is a plan that can last up to 12 weeks that you
            can do with others.
          </Popup>
        </div>
      </div>
      <RegularTable myChallenges={myChallenges} />
    </div>
  );
}
export default RegularChallenges;
