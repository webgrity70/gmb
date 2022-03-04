import React, { useState, useEffect } from 'react';
import BEMHelper from 'react-bem-helper';
import { Link } from 'react-router-dom';

import AccountabilityScore from '../../Elements/AccountabilityScore';
import MatchMeter from '../../Elements/MatchMeter';
import ProfileService from '../../../Services/ProfileService';
import { CategoryIcons } from '../CardBase/CardBase';

import '../CardBase/CardBase.scss';
import './ProfileCard.scss';
import AvatarWrapper from '../AvatarWrapper';

const bem = BEMHelper({ name: 'CardBase', outputIsString: true });

const ProfileCard = ({ id, profile }) => {
  const [myProfile, setMyProfile] = useState();

  useEffect(() => {
    if (id) {
      ProfileService.getOne(id).then((prof) => {
        setMyProfile(prof);
      });
    }
  }, [id]);

  useEffect(() => {
    if (profile) {
      setMyProfile(profile);
    }
  }, [profile]);

  if (!myProfile) {
    return <h1>Loading...</h1>;
  }

  //console.log( JSON.stringify( myProfile, null, 2 ) );

  return (
    <div className={bem('container')}>
      <table>
        <tbody>
          <tr>
            <td>
              <div className={bem('col1')}>
                <div className={bem('image')}>
                  <AvatarWrapper avatar={myProfile.avatar} />
                </div>

                <AccountabilityScore
                  points={myProfile.levels.global.points}
                  className={'xs'}
                />
              </div>
            </td>
            <td>
              <div className={bem('col2')}>
                <div className={bem('iconRow')}>
                  <CategoryIcons
                    cats={myProfile.category_available
                      .filter((cat) => cat.active)
                      .map((cat) => cat.category.slug)}
                  />

                  {false && (
                    <div className={bem('iconText')}>
                      <MatchMeter
                        percentage={myProfile.percentage}
                        className={'xs'}
                      />
                    </div>
                  )}
                </div>

                <div className={bem('title')}>{myProfile.name}</div>

                <div className={bem('title3')}>
                  {myProfile.gender} {myProfile.age && <>, {myProfile.age}</>}
                </div>

                <div className={bem('title4')}>
                  {myProfile.location.length
                    ? myProfile.location
                    : myProfile.timezone_name}
                  &nbsp; ({myProfile.timezone_offset} hrs from you)
                </div>

                <br />

                <div className={bem('goContainer')}>
                  <Link to={`/profile/${myProfile.pk}`}>
                    <span className={bem('goButton')}>View Profile</span>
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

export default ProfileCard;
