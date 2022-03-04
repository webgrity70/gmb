import React from 'react';
import { Checkbox } from 'semantic-ui-react';

const AcceptTOS = ({ handleChange, accepted }) => (
  <React.Fragment>
    <Checkbox
      onClick={handleChange}
      checked={accepted}
      required
      label="I have read and agree to the "
    />
    <span>
      <a
        target="_blank"
        rel="noopener noreferrer"
        href="https://www.getmotivatedbuddies.com/terms/"
      >
        Terms of Service
      </a>
      and
      <a
        target="_blank"
        rel="noopener noreferrer"
        href="https://www.getmotivatedbuddies.com/privacy/"
      >
        Privacy Policy.
      </a>
    </span>
  </React.Fragment>
);

export default AcceptTOS;
