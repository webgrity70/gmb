import React, { useEffect, useState } from 'react';
import BEMHelper from 'react-bem-helper';
import { Link } from 'react-router-dom';

import transformGroupType from '../../../utils/transformGroupType';
import GroupsService from '../../../Services/GroupsService';

import '../CardBase/CardBase.scss';
import './GroupCard.scss';

import { CategoryIcons } from '../CardBase/CardBase';
import AccountabilityScore from '../../Elements/AccountabilityScore';

const bem = BEMHelper({ name: 'CardBase', outputIsString: true });

const GroupCard = ({ id, group }) => {
  const [myGroup, setMyGroup] = useState();

  // if given an id, load group
  useEffect(() => {
    if (id) {
      GroupsService.getOne(id).then((gr) => {
        if (gr) {
          setMyGroup(gr);
        }
      });
    }
  }, [id]);

  // else if given a pre-loaded group, just use it
  useEffect(() => {
    if (group) {
      setMyGroup(group);
    }
  }, [group]);

  if (!myGroup) {
    return <h1>Loading...</h1>;
  }

  const icons = group.categories
    .filter((cat) => cat.active)
    .map((ic) => ic.category.slug);

  //console.log( 'MYGROUP ' + JSON.stringify( myGroup, null, 2 ) );

  return (
    <div className={bem('container', null, 'GroupCard')}>
      <table>
        <tbody>
          <tr>
            <td style={{ verticalAlign: 'top' }}>
              <div className={bem('col1')}>
                <img
                  className={bem('image')}
                  src={myGroup.icon}
                  alt={myGroup.name}
                />

                <div className={bem('text1')} style={{ textAlign: 'center' }}>
                  <AccountabilityScore
                    points={myGroup.score}
                    className={'xs'}
                  />
                </div>

                <div className={bem('text3', null, 'GroupCard__text3')}>
                  {transformGroupType(myGroup.type).toUpperCase()}
                </div>

                <div className={bem('text3')}>
                  <b>{myGroup.members}</b>
                  &nbsp;
                  {myGroup.members === 1 ? 'member' : 'members'}
                </div>
              </div>
            </td>
            <td>
              <div className={bem('col2')}>
                <div className={bem('iconRow')}>
                  <CategoryIcons cats={icons} />
                </div>

                <div className={bem('title')}>{myGroup.name}</div>
                <br />

                <div className={bem('title3')}>{`${myGroup.location}`}</div>
                <br />

                <div className={bem('goContainer')}>
                  <Link to={`/groups/${myGroup.id}`}>
                    <span className={bem('goButton')}>View Group</span>
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

export default GroupCard;
