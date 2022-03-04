import React, { useEffect, useState } from 'react';
import BEMHelper from 'react-bem-helper';
import { Link } from 'react-router-dom';

import ProfileService from '../../../Services/ProfileService';

import { CategoryIcons } from '../CardBase/CardBase';
import AvatarWrapper from '../AvatarWrapper';

import '../CardBase/CardBase.scss';
import './PlanCard.scss';

const bem = BEMHelper({ name: 'CardBase', outputIsString: true });

const PlanCard = ({ plan }) => {
  const [myPlan, setMyPlan] = useState();
  const [avatar, setAvatar] = useState();

  // if pre-loaded plan passed in, just use it
  useEffect(() => {
    if (plan) {
      setMyPlan(plan);
      ProfileService.getProfile(plan.user.id)
        .then((profile) => {
          if (profile && profile.avatar) {
            setAvatar(profile.avatar);
          }
        })
        .catch((err) => console.log('getProfile() ' + JSON.stringify(err)));
    }
  }, [plan]);

  if (!myPlan) {
    return null;
  }

  return (
    <div className={bem('container')}>
      <table>
        <tbody>
          <tr>
            <td style={{ verticalAlign: 'top' }}>
              <div className={bem('col1')}>
                <Link to={`/profile/${myPlan.user.id}`}>
                  <div className={bem('image')}>
                    <AvatarWrapper id={myPlan.user.id} avatar={avatar} />
                  </div>

                  <div>
                    <span className={bem('text1')}>
                      {`by ${myPlan.user.name || 'unknown'}`}
                    </span>
                  </div>
                </Link>
              </div>
            </td>
            <td>
              <div className={bem('col2')}>
                <div className={bem('iconRow')}>
                  <CategoryIcons cats={myPlan.categories.map((c) => c.slug)} />
                </div>

                <div className={bem('title')}>{myPlan.name}</div>

                <div className={bem('title2')}>
                  {Math.ceil(
                    myPlan.frequency.reduce((total, val) => total + val, 0) /
                      myPlan.frequency.length
                  )}
                  x/week for {myPlan.weeks}{' '}
                  {myPlan.weeks === 1 ? 'week' : 'weeks'}
                </div>

                <div className={bem('title3')}>Choose Time and Location</div>
                <br />

                <div className={bem('goContainer')}>
                  <Link to={`/plan/create`}>
                    <span className={bem('goButton')}>View Plans</span>
                  </Link>
                </div>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default PlanCard;
