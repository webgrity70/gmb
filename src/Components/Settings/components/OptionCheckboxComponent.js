import React from 'react';
import { Checkbox, Grid } from 'semantic-ui-react';
import * as PropTypes from 'prop-types';

const propTypes = {
  value: PropTypes.bool.isRequired,
  setting: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  editing: PropTypes.bool.isRequired,
  onChange: PropTypes.func.isRequired,
  onText: PropTypes.string,
  offText: PropTypes.string,
  mobile: PropTypes.number,
  tablet: PropTypes.number,
  computer: PropTypes.number,
  disabled: PropTypes.bool,
  tooltip: PropTypes.string,
};

const defaultProps = {
  onText: 'On',
  offText: 'Off',
  mobile: 8,
  tablet: 8,
  computer: 7,
  tooltip: undefined,
  disabled: false,
};

class OptionCheckboxComponent extends React.Component {
  render() {
    const {
      value,
      setting,
      name,
      editing,
      onChange,
      onText,
      offText,
      mobile,
      tablet,
      computer,
      disabled,
      tooltip,
      onEditText,
      offEditText,
    } = this.props;
    return (
      <Grid.Column
        className="value"
        mobile={mobile}
        tablet={tablet}
        computer={computer}
      >
        {editing ? (
          <React.Fragment>
            <span>{offEditText || 'Off'}</span>
            <Checkbox
              toggle
              checked={value}
              setting={setting}
              name={name}
              onChange={onChange}
              disabled={disabled}
              data-tooltip={tooltip}
            />
            <span>{onEditText || 'On'}</span>
          </React.Fragment>
        ) : (
          <React.Fragment>
            <strong>{value ? onText : offText}</strong>
          </React.Fragment>
        )}
      </Grid.Column>
    );
  }
}

OptionCheckboxComponent.propTypes = propTypes;
OptionCheckboxComponent.defaultProps = defaultProps;

export default OptionCheckboxComponent;
