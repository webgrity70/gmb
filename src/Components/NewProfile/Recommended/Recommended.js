import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import RecommendedMembers from '../../Elements/RecommendedMembers';
import './Recommended.scss';

const Recommended = ({ hasPlan }) => (
  <Fragment>
    <h2 className="recommended-title">Other buddies you might like</h2>
    <RecommendedMembers hasPlan={hasPlan} />
  </Fragment>
);

Recommended.propTypes = {
  hasPlan: PropTypes.bool,
};

export default Recommended;
