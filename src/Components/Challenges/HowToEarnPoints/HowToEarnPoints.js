import React, { useState } from 'react';
import BEMHelper from 'react-bem-helper';
import PropTypes from 'prop-types';
import { Modal, Button } from 'semantic-ui-react';
import confirm from '../../../Assets/images/img-confirm.png';
import checkin from '../../../Assets/images/img-checkin.png';

import './HowToEarnPoints.scss';

const bem = BEMHelper({ name: 'HowToEarnPoints', outputIsString: true });

function HowToEarnPoints({ trigger }) {
  const [open, setOpen] = useState(false);
  return (
    <Modal
      open={open}
      trigger={trigger}
      onOpen={() => setOpen(true)}
      onClose={() => setOpen(false)}
      closeOnDimmerClick={false}
      dimmer="inverted"
      className={bem()}
      size="tiny"
      closeIcon={{ name: 'close', color: 'grey' }}
    >
      <Modal.Content>
        <h2>How to earn the most points?</h2>
        <h4>1. Confirm your participation</h4>
        <img src={confirm} alt="Earn Points Confirm" className="mb-4" />
        <h4>
          2. Check in at 100% at the end of your challenge within 1 hour and
          earn extra points by leaving a note
        </h4>
        <img src={checkin} alt="Earn Points Checkin" className="mb-8" />
        <Button color="orange" onClick={() => setOpen(false)}>
          Ok, Got it!
        </Button>
      </Modal.Content>
    </Modal>
  );
}

HowToEarnPoints.propTypes = {
  trigger: PropTypes.node,
};

export default HowToEarnPoints;
