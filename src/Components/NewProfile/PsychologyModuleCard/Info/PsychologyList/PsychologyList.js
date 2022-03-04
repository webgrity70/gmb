import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import { Form } from 'semantic-ui-react';
import BEMHelper from 'react-bem-helper';
import './PsychologyList.scss';

const bem = BEMHelper({ name: 'PsychologyList', outputIsString: true });

const PsychologyList = ({ items, onRemove }) => (
  <div className={bem()}>
    {items.map((item) => (
      <div className={bem('item')} key={item.identifier}>
        <h5>{item.label}:</h5>
        {onRemove ? (
          <Form.Input
            min={0}
            max={100}
            type="range"
            value={item.value}
            name={item.identifier}
            onChange={(e) => onRemove(Number(e.target.value), item)}
          />
        ) : (
          <div className={cx('ui progress', bem('progress'))}>
            <div className="bar" style={{ width: `${item.value}%` }}>
              <div className={bem('progress-bar')} />
            </div>
          </div>
        )}
        <div className={bem('indicators')}>
          <span>{item.minValue}</span>
          <span>{item.maxValue}</span>
        </div>
      </div>
    ))}
  </div>
);

PsychologyList.propTypes = {
  items: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string,
      value: PropTypes.number,
      identifier: PropTypes.string,
      minValue: PropTypes.string,
      maxValue: PropTypes.string,
    })
  ),
  onRemove: PropTypes.func,
};

export default PsychologyList;
