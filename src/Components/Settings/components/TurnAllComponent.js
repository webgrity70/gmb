import React from 'react';
import * as PropTypes from 'prop-types';
import { Checkbox } from 'semantic-ui-react';

const propTypes = {
  editing: PropTypes.bool.isRequired,
  checked: PropTypes.bool.isRequired,
  onChange: PropTypes.func.isRequired,
  label: PropTypes.string.isRequired,
  onText: PropTypes.string,
  offText: PropTypes.string,
  dataTooltip: PropTypes.string,
  includeLegend: PropTypes.bool,
};

const defaultProps = {
  onText: 'On',
  offText: 'off',
  dataTooltip: null,
  includeLegend: false,
};

const TurnAllComponent = ({
  onText,
  offText,
  editing,
  checked,
  onChange,
  dataTooltip,
  label,
  includeLegend,
}) => (
  <div
    className="turn-all"
    {...(editing &&
      dataTooltip && {
        'data-tooltip': dataTooltip,
        'data-position': 'top right',
      })}
  >
    <div className="global-label">{label}</div>
    {editing ? (
      <>
        {includeLegend && offText && (
          <strong className="legend mr-4">{offText}</strong>
        )}
        <Checkbox toggle checked={checked} onChange={onChange} />
        {includeLegend && onText && (
          <strong className="legend ml-4">{onText}</strong>
        )}
      </>
    ) : (
      <strong>{checked ? onText : offText}</strong>
    )}
  </div>
);

TurnAllComponent.propTypes = propTypes;
TurnAllComponent.defaultProps = defaultProps;

export default TurnAllComponent;
