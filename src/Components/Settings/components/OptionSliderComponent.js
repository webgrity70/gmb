import React from 'react';
import { Grid } from 'semantic-ui-react';
import * as PropTypes from 'prop-types';
import Tooltip from 'rc-tooltip';
import Slider from 'rc-slider';
import Helpers from '../../Utils/Helpers';

const propTypes = {
  value: PropTypes.number.isRequired,
  setting: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  editing: PropTypes.bool.isRequired,
  onChange: PropTypes.func.isRequired,
  mobile: PropTypes.number,
  tablet: PropTypes.number,
  computer: PropTypes.number,
};

const defaultProps = {
  mobile: 8,
  tablet: 8,
  computer: 7,
};

const handle = (props) => {
  const { value, dragging, index, ...restProps } = props;
  // minutes should be 10 if 0, to offset for 30minute steps.
  const fixedValue = value === 0 ? 10 : value;
  const { h, m } = Helpers.reminderMinuteToDisplayConversion(fixedValue);
  const hoursDisplay = h > 0 ? `${h}h ` : '';
  const minutesDisplay = m > 0 ? `${m}m ` : '';
  const timeDisplay = `${hoursDisplay}${minutesDisplay}`;
  return (
    <Tooltip
      prefixCls="rc-slider-tooltip"
      overlayClassName="gmb-slider"
      overlay={`${timeDisplay} before`}
      visible={dragging}
      placement="top"
      key={index}
    >
      <Slider.Handle value={fixedValue} {...restProps} />
    </Tooltip>
  );
};

class OptionSliderComponent extends React.Component {
  static displayReminder(value) {
    const fixedValue = value === 0 ? 10 : value;
    const { h, m } = Helpers.reminderMinuteToDisplayConversion(fixedValue);
    let timeDisplay;
    if (h === 0) {
      timeDisplay = `${m} minutes`;
    } else {
      let min = '';
      if (m > 0) {
        min = `:${Helpers.leftPad(m, 2)}`;
      }
      timeDisplay = `${h}${min} hours`;
    }
    return `${timeDisplay} before`;
  }

  render() {
    const {
      value,
      setting,
      name,
      editing,
      onChange,
      mobile,
      tablet,
      computer,
    } = this.props;
    return (
      <Grid.Column
        className="value"
        mobile={mobile}
        tablet={tablet}
        computer={computer}
      >
        {editing ? (
          <Slider
            className="gmb-slider"
            min={0}
            max={1440}
            step={30}
            defaultValue={value}
            marks={{
              0: '10m',
              360: '6h',
              720: '12h',
              1080: '18h',
              1440: '24h',
            }}
            handle={handle}
            onAfterChange={(sliderValue) =>
              onChange(setting, name, sliderValue)
            }
          />
        ) : (
          <strong>{OptionSliderComponent.displayReminder(value)}</strong>
        )}
      </Grid.Column>
    );
  }
}

OptionSliderComponent.propTypes = propTypes;
OptionSliderComponent.defaultProps = defaultProps;

export default OptionSliderComponent;
