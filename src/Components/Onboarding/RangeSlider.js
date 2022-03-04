import React, { Component } from 'react';
import { Range } from 'rc-slider';

class RangeSlider extends Component {
  constructor(props) {
    super(props);
    const lower = props.min || 0;

    const upper = props.max || 100;
    this.state = {
      lowerBound: lower,
      upperBound: upper,
      value: props.value || [lower, upper],
    };
  }

  static renderChange(value) {
    document.getElementsByClassName(
      'rc-slider-handle-1'
    )[0].innerHTML = `<!--suppress CheckTagEmptyBody --><span class="content">${value[0]}</span>`;
    document.getElementsByClassName(
      'rc-slider-handle-2'
    )[0].innerHTML = `<!--suppress CheckTagEmptyBody --><span class="content">${value[1]}</span>`;
  }

  componentDidMount() {
    RangeSlider.renderChange(this.state.value);
  }

  handler(value) {
    this.setState({ value });
    this.props.saveField(value);
    RangeSlider.renderChange(value);
  }

  render() {
    return (
      <Range
        style={{ marginTop: 100 }}
        allowCross={false}
        defaultValue={this.state.value}
        min={this.state.lowerBound}
        max={this.state.upperBound}
        onChange={(value) => this.handler(value)}
      />
    );
  }
}

export default RangeSlider;
