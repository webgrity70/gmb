import moment from 'moment';

import React, { useState, useEffect, useContext } from 'react';
import BEMHelper from 'react-bem-helper';
import { Link } from 'react-router-dom';

import ChallengesService from '../../../Services/ChallengesService';
import PlanService from '../../../Services/PlanService';
import { CategoryIcons } from '../CardBase/CardBase';

import '../CardBase/CardBase.scss';
import './ChallengeCard.scss';
import AvatarWrapper from '../AvatarWrapper';
import { Icon } from 'semantic-ui-react';
import Countdown from 'react-countdown';
import Counter from '../../Dashboard/Counter';
import Intensity from '../../Challenges/Intensity';
import PlanContext from '../../Plan/PlanContext';
import parseTimeFormat from '../../../utils/parseTimeFormat';

const bem = BEMHelper({ name: 'CardBase', outputIsString: true });

const ChallengeCard = ({ challenge }) => {
  const [myChallenge, setMyChallenge] = useState();
  const [numWeeks, setNumWeeks] = useState();
  const [freq, setFrequency] = useState();
  const [tzhours, settzhours] = useState();

  useEffect(() => {
    if (challenge) {
      ChallengesService.fetchChallengeDetails(challenge.id).then((det) => {
        setMyChallenge({ ...challenge, icon: det.icon });
      });
    }
  }, [challenge]);

  useEffect(() => {
    if (myChallenge) {
      if (myChallenge.challengeManager) {
        settzhours(
          Math.trunc(
            moment.tz(myChallenge.challengeManager.timezone).utcOffset() / 60
          )
        );
      }

      // load the base template for additional info
      PlanService.getTemplate(myChallenge.baseTemplate).then((temp) => {
        //console.log( 'CHALTEMP ' + JSON.stringify( temp, null, 2 ) );

        const start = moment(myChallenge.start || myChallenge.event.date);
        const finish = moment(myChallenge.finish);
        const duration = moment.duration(finish.diff(start));
        const numWeeks = Math.ceil(duration.asWeeks()) + 1;
        //console.log( `S${start} E${finish} D${duration} W${numWeeks} N${temp.events.length}` );

        setNumWeeks(numWeeks);

        const freq = Math.ceil(temp.events.length / numWeeks);
        setFrequency(freq);
      });
    }
  }, [myChallenge]);

  if (!myChallenge) {
    return 'Loading...';
  }

  function isFlashChallenge() {
    return !myChallenge.type || myChallenge.type === 'Flash';
  }

  //console.log( 'MYCHAL ' + JSON.stringify( myChallenge, null, 2 ) );

  // support Flash and Regular formats
  const event = myChallenge.upcomingEvent || myChallenge.event;
  const start = isFlashChallenge() ? event.date : myChallenge.start;
  const started = moment(start) <= moment();

  const avatar = myChallenge.challengeManager
    ? myChallenge.challengeManager.avatar
    : null;

  const { timeFormat } = useContext(PlanContext);
  const startDate = moment(start);
  const [time, format] = startDate
    .clone()
    .format(parseTimeFormat(timeFormat, startDate))
    .split(' ');

  return (
    <div className={bem('container')}>
      <table>
        <tbody>
          <tr>
            <td>
              <div className={bem('col1')}>
                {avatar && (
                  <div
                    className={bem(
                      'image',
                      null,
                      myChallenge.featured
                        ? 'ChallengeCard__featuredimage'
                        : null
                    )}
                  >
                    {myChallenge.icon && (
                      <AvatarWrapper url={myChallenge.icon} />
                    )}
                    {!myChallenge.icon && <AvatarWrapper avatar={avatar} />}
                  </div>
                )}

                <div className={bem('text1')}>
                  {myChallenge.challengeManager && (
                    <Link to={`/profile/${myChallenge.challengeManager.id}`}>
                      by {myChallenge.challengeManager.name}
                    </Link>
                  )}
                </div>

                <div className={bem('text2')}>
                  {started && <span>STARTED</span>}

                  {!started && (
                    <span style={{ whiteSpace: 'nowrap' }}>
                      <Countdown
                        date={moment(start).clone().format()}
                        renderer={Counter}
                        onComplete={() => {}}
                        key="starts-in"
                      />
                    </span>
                  )}
                </div>

                <div className={bem('text3')}>
                  <b>{myChallenge.participants}</b>&nbsp;
                  {myChallenge.participants === 1 ? 'member' : 'members'}
                </div>
              </div>
            </td>
            <td>
              <div className={bem('col2')}>
                <div className={bem('iconRow')}>
                  {isFlashChallenge() ? (
                    <CategoryIcons
                      cats={myChallenge.categories.map((cat) => cat.slug)}
                    />
                  ) : (
                    <CategoryIcons
                      cats={myChallenge.categories
                        .filter((cat) => cat.active)
                        .map((cat) => cat.category.slug)}
                    />
                  )}

                  <div
                    className={bem('iconText')}
                    style={{ float: 'right', display: 'inline-block' }}
                  >
                    {false && myChallenge.intensity && (
                      <Intensity intensity={myChallenge.intensity} />
                    )}

                    {isFlashChallenge() && (
                      <Icon style={{ color: 'blue' }} name="lightning" />
                    )}
                  </div>
                </div>

                <div className={bem('title')}>{myChallenge.name}</div>
                {!isFlashChallenge() && (
                  <div className={bem('title2')}>
                    {freq}x/week for {numWeeks}{' '}
                    {numWeeks === 1 ? 'week' : 'weeks'}
                  </div>
                )}
                <div className={bem('title3')}>
                  {isFlashChallenge() && (
                    <>
                      {moment(start).format('ddd MMM Do')} at &nbsp;
                      {time} {format && <span>{format.toUpperCase()}</span>}
                    </>
                  )}

                  {!isFlashChallenge() && (
                    <>
                      {moment(myChallenge.start).format('ddd MMM Do')} -&nbsp;
                      {moment(myChallenge.end).format('ddd MMM Do')}
                    </>
                  )}
                </div>

                {false && (
                  <div className={bem('title4')}>
                    {event.place}&nbsp;
                    {<span> - {tzhours} hours from you</span>}
                  </div>
                )}
                <br />

                <div className={bem('goContainer')}>
                  {isFlashChallenge() ? (
                    <Link to={`/challenges/`}>
                      <span className={bem('goButton')}>View Challenges</span>
                    </Link>
                  ) : (
                    <Link to={`/challenges/${myChallenge.id}`}>
                      <span className={bem('goButton')}>
                        View Challenge Details
                      </span>
                    </Link>
                  )}
                </div>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default ChallengeCard;
