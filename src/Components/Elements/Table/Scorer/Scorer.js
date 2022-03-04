import React from 'react';
import PropTypes from 'prop-types';
import BEMHelper from 'react-bem-helper';
import alphaGmbLogo from '../../../../Assets/images/Combined Shape.png';
import alphaGmbLogo2x from '../../../../Assets/images/Combined Shape@2x.png';
import './Scorer.scss';

const bem = BEMHelper({ name: 'TableScorer', outputIsString: true });

const Scorer = ({ accountLevel }) => (
  <div className={bem()}>
    <img
      src={alphaGmbLogo}
      srcSet={`${alphaGmbLogo} 1x, ${alphaGmbLogo2x} 2x`}
      alt="GMB Logo"
    />
    <p className={bem('text')}>{accountLevel}</p>
  </div>
);

Scorer.propTypes = {
  accountLevel: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
};

export default Scorer;
