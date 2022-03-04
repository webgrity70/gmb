import React, { Component } from 'react';
import Slider from 'rc-slider';

class SliderComp extends Component {
  constructor(props) {
    super(props);
    this.state = {
      lowerBound: props.min || 0,
      upperBound: props.max || 100,
      value: props.value || 0,
    };
  }

  static renderChange(value, identifier) {
    const slider = document.querySelector(
      `.rc-slider.${identifier} > .rc-slider-handle`
    );
    if (slider) slider.innerHTML = value;
  }

  componentDidMount() {
    SliderComp.renderChange(this.state.value, this.props.identifier);
  }

  handler(value) {
    this.setState({ value });
    this.props.saveField(value);
    SliderComp.renderChange(value, this.props.identifier);
  }

  render() {
    return (
      <Slider
        style={{ marginTop: 100 }}
        defaultValue={this.state.value}
        min={this.state.lowerBound}
        max={this.state.upperBound}
        onChange={(value) => this.handler(value)}
        className={`${this.props.identifier}`}
      />
    );
  }
}

export default SliderComp;
