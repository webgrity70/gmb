import React from 'react';
import _ from 'lodash';
import { Form, Select } from 'semantic-ui-react';

const GMBDropdown = ({ onChange, value, options }) => {
  options = _.map(options, (option, index) => ({
    text: option.label,
    value: option.label,
    key: index,
  }));
  return (
    <div className="radio_fields">
      <div className="radio_fields_inner">
        <Form.Field className="form_field_container_inner_radio_fields">
          <Select options={options} value={value} onChange={onChange} />
        </Form.Field>
      </div>
    </div>
  );
};
export default GMBDropdown;
