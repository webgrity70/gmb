/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import React from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import { Icon, Popup } from 'semantic-ui-react';
import './NewPlanCard.scss';

const NewPlanCard = ({ history, groupId }) => (
  <Popup
    inverted
    trigger={
      <div
        className="NewPlanCard"
        onClick={() => history.push(`/plan/new?group=${groupId}`)}
      >
        <Icon name="plus" />
        <span>Create New Plan</span>
      </div>
    }
  >
    Members cannot see plan templates here yet, but coming soon.
  </Popup>
);

NewPlanCard.propTypes = {
  history: PropTypes.shape(),
  groupId: PropTypes.number,
};

export default withRouter(NewPlanCard);
