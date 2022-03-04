import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import BEMHelper from 'react-bem-helper';
import './CardButton.scss';

const bem = BEMHelper({
  name: 'ProfileModuleCardButton',
  outputIsString: true,
});

function CardButton(props) {
  const { className } = props;
  return <button type="button" className={cx(bem(), className)} {...props} />;
}

CardButton.propTypes = {
  className: PropTypes.string,
};

export default CardButton;
