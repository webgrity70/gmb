/* eslint-disable react/no-unescaped-entities */
import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Icon } from 'semantic-ui-react';
import { getMyProfileId } from '../../selectors/profile';

import './MobileBanner.scss';

const LSKey = 'gmb-show-mobile-alert';

const MobileBanner = ({ userId }) => {
  const [show, setShow] = useState(false);
  function hideBanner() {
    localStorage.setItem(LSKey, true);
    setShow(false);
  }
  useEffect(() => {
    const shouldShow = localStorage.getItem(LSKey);
    if (!shouldShow) setShow(true);
  }, []);
  if (!show || !userId) return null;
  return (
    <div className="MobileBanner">
      <p>
        First time users: While we’re in beta, please login through desktop or
        laptop.
      </p>
      <Icon name="close" onClick={hideBanner} />
    </div>
  );
};

MobileBanner.propTypes = {
  userId: PropTypes.oneOfType([PropTypes.number, PropTypes.oneOf([null])]),
};

export default connect((state) => ({ userId: getMyProfileId(state) }))(
  MobileBanner
);
