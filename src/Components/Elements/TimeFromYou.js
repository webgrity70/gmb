import React from 'react';
import moment from 'moment';

export default ({ timeZoneName, timeZoneOffset }) => {
  if (!timeZoneName) {
    return <React.Fragment />;
  }

  return (
    <React.Fragment>
      {moment().tz(timeZoneName).zoneAbbr()}
      <span className="offset"> ({timeZoneOffset} hrs. from you)</span>
    </React.Fragment>
  );
};
