import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import Countdown from 'react-countdown';
import { Link } from 'react-router-dom';
import { Grid } from 'semantic-ui-react';
import CategoryIcon from '../../Utils/CategoryIcon';
import Counter from '../Counter';
import PlanContext from '../../Plan/PlanContext';
import './UpcomingPlan.scss';
import parseTimeFormat from '../../../utils/parseTimeFormat';

function UpcomingPlan({ plan, onUpdatePlan }) {
  const { timeFormat } = useContext(PlanContext);

  return (
    <div className="DashboardUpcomingPlan">
      {!plan ? (
        <div className="make-your-plan flex-col md:flex-row">
          Nothing planned.
          <Link to="/plan" className="ml-2 mt-8 md:mt-0">
            {' '}
            Make a Plan.
          </Link>
        </div>
      ) : (
        <div className="plan-holder">
          <Grid padded>
            <Grid.Row columns={2}>
              <Grid.Column
                className="up-next-container"
                computer={8}
                mobile={16}
              >
                <div className="up-next">Up next</div>
                <div className="category">
                  <div className="icon">
                    {CategoryIcon.renderColorfulIcon(
                      plan.habit.category.slug,
                      true
                    )}
                  </div>
                </div>
                <div className="date-and-time">
                  {moment(plan.start_date).format('dddd, MMM. D')} at{' '}
                  {moment(plan.start_date).format(
                    parseTimeFormat(timeFormat, plan.start_date)
                  )}
                </div>

                <div className="activity">{plan.habit.name}</div>
                <div className="activity-location d-no-margin">
                  {`at ${plan.location} for 
                ${plan.session_duration} 
                ${plan.session_unit}`}
                </div>
              </Grid.Column>
              <Grid.Column mobile={16} computer={8}>
                <div className="countdown-centered">
                  <h4>Check In:</h4>
                  <Countdown
                    date={plan.start_date}
                    renderer={Counter}
                    onComplete={() => onUpdatePlan(plan.pk)}
                  />
                </div>
              </Grid.Column>
            </Grid.Row>
          </Grid>
        </div>
      )}
    </div>
  );
}

UpcomingPlan.propTypes = {
  onUpdatePlan: PropTypes.func.isRequired,
  plan: PropTypes.shape({}),
};

export default UpcomingPlan;
