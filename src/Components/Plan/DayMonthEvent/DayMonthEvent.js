import React from 'react';
import PropTypes from 'prop-types';
import BEMHelper from 'react-bem-helper';
import Event from './Event';
import './DayMonthEvent.scss';

export const bem = BEMHelper({ name: 'DayMonthEvent', outputIsString: true });

const DayMonthEvent = ({ event: data }) => (
  <div className="flex flex-wrap justify-center items-center my-2">
    {data.events.map((e) => (
      <Event data={e} key={e.id} />
    ))}
  </div>
);

DayMonthEvent.propTypes = {
  event: PropTypes.shape({
    events: PropTypes.arrayOf(PropTypes.shape({})),
  }),
};

export default DayMonthEvent;
