import React from 'react';
import { Grid } from 'semantic-ui-react';
import * as PropTypes from 'prop-types';

const propTypes = {
  label: PropTypes.string.isRequired,
  mobile: PropTypes.number,
  tablet: PropTypes.number,
  computer: PropTypes.number,
};

const defaultProps = {
  mobile: 8,
  tablet: 8,
  computer: 8,
};

class OptionLabelComponent extends React.Component {
  render() {
    const { label, mobile, tablet, computer } = this.props;
    return (
      <Grid.Column
        className="key"
        mobile={mobile}
        tablet={tablet}
        computer={computer}
      >
        {label}
      </Grid.Column>
    );
  }
}

OptionLabelComponent.propTypes = propTypes;
OptionLabelComponent.defaultProps = defaultProps;

export default OptionLabelComponent;
