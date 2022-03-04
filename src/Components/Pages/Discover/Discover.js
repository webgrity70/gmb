import moment from 'moment';

import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import BEMHelper from 'react-bem-helper';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import PlanService from '../../../Services/PlanService';
import GroupService from '../../../Services/GroupsService';
import ChallengeService from '../../../Services/ChallengesService';
import BuddiesService from '../../../Services/BuddiesService';
import PlanCard from '../../FEv2/PlanCard/PlanCard';
import GroupCard from '../../FEv2/GroupCard/GroupCard';
import ChallengeCard from '../../FEv2/ChallengeCard';
import ProfileCard from '../../FEv2/ProfileCard';
import './Discover.scss';

const bem = BEMHelper({ name: 'DiscoverPage', outputIsString: true });

function DiscoverPage({ user }) {
  const [plans, setPlans] = useState();
  const [plansLimit, setPlansLimit] = useState(3);

  const [groups, setGroups] = useState();
  //const [challengeDetails, setChallengeDetails] = useState();
  const [flashChallenges, setFlashChallenges] = useState();
  const [fcLimit, setFCLimit] = useState(3);
  const [regularChallenges, setRegularChallenges] = useState();
  const [buddies, setBuddies] = useState();

  useEffect(() => {
    BuddiesService.getRecommendedMembers(3).then((buds) => {
      if (buds) {
        //console.log( JSON.stringify( buds.results.map( pr => pr.percentage ), null, 2 ) );
        setBuddies(buds.results);
      }
    });
  }, []);

  useEffect(() => {
    PlanService.getGlobalTemplates()
      .then((pls) => {
        if (pls) {
          setPlans(pls.results);
        }
      })
      .catch((err) => console.log('PlanService.getGlobalTemplates() ' + err));
  }, []);

  useEffect(() => {
    ChallengeService.fetchChallenges()
      .then((chs) => {
        if (chs) {
          //console.log( JSON.stringify( chs.results.map( ch => ch.start ), null, 2 ) );
          // disabled because fetchChallenges() doesnt provide open upcoming challenges
          setRegularChallenges(chs.results.slice(0, 3));
        }
      })
      .catch((err) =>
        console.log('fetchChallenges( startDate, endDate ) ' + err)
      );
  }, []);

  useEffect(() => {
    ChallengeService.fetchFlashChallenges({
      startDate: moment().utc().add(10, 'minutes'),
      endDate: moment().utc().add(2, 'week'),
    }).then((chs) => {
      if (chs) {
        //console.log(JSON.stringify(chs.results, null, 2));
        let upcomingFlashChallenges = chs.results.filter((challenge) => {
          const event = challenge.upcomingEvent || challenge.event;
          const start = event.date;
          const notended = moment().isBefore(
            moment(start).clone().add({ minutes: event.duration })
          );
          return notended;
        });
        setFlashChallenges(upcomingFlashChallenges);
      }
    });
  }, []);

  useEffect(() => {
    GroupService.getGroups({}).then((grs) => {
      if (grs) {
        const randomGroups = [
          grs.results[Math.trunc(grs.results.length * Math.random())],
          grs.results[Math.trunc(grs.results.length * Math.random())],
          grs.results[Math.trunc(grs.results.length * Math.random())],
        ];

        setGroups(randomGroups);
        //console.log( JSON.stringify( user, null, 2 ) );
      }
    });
  }, []);

  function renderViewMoreButton(url) {
    return (
      <div className={bem('viewMoreContainer')}>
        <Link to={url}>
          <button className={bem('viewMoreButton')}>View More</button>
        </Link>
      </div>
    );
  }

  return (
    <div className={'DiscoverPage'}>
      <div className={bem('header')}>
        <div className={bem('title')}>Discover</div>
      </div>

      <div className={bem('container')}>
        {flashChallenges && flashChallenges.length > 0 && (
          <>
            <h2 className={bem('title2 first-title')}>
              Join Upcoming Flash Challenges - Live Events
            </h2>
            <div className={bem('cardRow')}>
              {flashChallenges &&
                flashChallenges
                  .slice(0, fcLimit)
                  .map((ch, i) => <ChallengeCard key={i} challenge={ch} />)}
            </div>

            {false && flashChallenges && fcLimit < flashChallenges.length && (
              <div className={bem('viewMoreContainer')}>
                <button
                  onClick={() => setFCLimit(fcLimit + 3)}
                  className={bem('viewMoreButton')}
                >
                  View More
                </button>
              </div>
            )}
            {renderViewMoreButton('/challenges')}

            <div className={bem('divider')} />
          </>
        )}

        {regularChallenges && regularChallenges.length > 0 && (
          <>
            <h2 className={bem('title2')}>
              Join Ongoing Challenges to Work with Others
            </h2>
            <div className={bem('cardRow')}>
              {regularChallenges &&
                regularChallenges.map((ch, i) => (
                  <ChallengeCard key={i} challenge={ch} />
                ))}
            </div>

            {renderViewMoreButton('/challenges')}

            <div className={bem('divider')} />
          </>
        )}

        {buddies && buddies.length > 0 && (
          <>
            <h2 className={bem('title2')}>
              Send a Request to Recommended Buddies
            </h2>
            <div className={bem('cardRow')}>
              {buddies &&
                buddies.map((b, i) => <ProfileCard key={i} profile={b} />)}
            </div>

            {renderViewMoreButton('/buddies')}

            <div className={bem('divider')} />
          </>
        )}

        {plans && plans.length > 0 && (
          <>
            <h2 className={bem('title2')}>
              Choose an Individual Plan to Work at Your Own Pace
            </h2>
            <div className={bem('cardRow')}>
              {plans &&
                plans
                  .slice(0, plansLimit)
                  .map((pl, i) => <PlanCard key={i} plan={pl} />)}
            </div>

            {false && plans && plansLimit < plans.length && (
              <div className={bem('viewMoreContainer')}>
                <button
                  onClick={() => setPlansLimit(plansLimit + 3)}
                  className={bem('viewMoreButton')}
                >
                  View More
                </button>
              </div>
            )}

            {renderViewMoreButton('/plan/create')}

            <div className={bem('divider')} />
          </>
        )}

        {groups && groups.length && (
          <>
            <h2 className={bem('title2')}>
              Discover Buddies in Popular Groups
            </h2>

            <div className={bem('cardRow')}>
              {groups &&
                groups.map((gr, i) => <GroupCard key={i} group={gr} />)}
            </div>

            {renderViewMoreButton('/groups')}
          </>
        )}
      </div>
    </div>
  );
}

DiscoverPage.propTypes = {
  user: PropTypes.shape(),
};

const mapStateToProps = (state, { id }) => ({});

export default connect(mapStateToProps, {})(DiscoverPage);
