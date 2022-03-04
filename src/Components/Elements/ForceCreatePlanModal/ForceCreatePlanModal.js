import React from 'react';
import { Header, Image, Modal } from 'semantic-ui-react';
import { Link } from 'react-router-dom';

import quickStartLogo from '../../../Assets/images/WelcomeBuddy.png';
import './ForceCreatePlanModal.scss';

function ForceCreatePlanModal(props) {
  return (
    <Modal
      dimmer="inverted"
      {...props}
      closeOnDimmerClick={false}
      className="ForceCreatePlanModal"
    >
      <Modal.Content image>
        <Image
          className="ForceCreatePlanModal__image"
          wrapped
          src={quickStartLogo}
        />
        <Modal.Description>
          <Header>Want to search for Buddies?</Header>
          <p>Planning makes you 10x more likely to succeed with your Buddy.</p>
          <div className="action">
            <div>
              <Link
                to={{
                  pathname: '/plan',
                  state: { from: props.pathname },
                }}
                className="btn"
              >
                Choose a Plan
              </Link>
            </div>

            <div className="separator">or</div>

            <div>
              <Link to="/challenges" className="btn">
                Join a Challenge
              </Link>
            </div>
          </div>
        </Modal.Description>
      </Modal.Content>
    </Modal>
  );
}

export default ForceCreatePlanModal;
