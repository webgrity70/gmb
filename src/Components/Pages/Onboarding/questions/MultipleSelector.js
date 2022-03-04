import React from 'react';
import _ from 'lodash';
import { Checkbox, Form, Input } from 'semantic-ui-react';

const MultipleSelector = ({ options, withOther, value, onChange }) => {
  const onCheck = (e, check) => {
    if (check.checked) {
      value = value || [];
      value.push({ value: check.value, label: check.label });
    } else {
      const index = _.findIndex(value, { value: check.value });
      value.splice(index, 1);
    }
    onChange(value);
  };

  const onOtherInputChange = (e, data) => {
    const otherIndex = _.findIndex(value, { value: 'Other' });
    if (otherIndex >= 0) {
      value[otherIndex].label = data.value;
      onChange(value);
    }
  };

  const isOtherSelected = _.find(value, { value: 'Other' });
  const otherValue = isOtherSelected ? isOtherSelected.label : '';
  return (
    <div className="multi-selector">
      {_.map(options, (option, index) => (
        <Form.Field
          key={index}
          className="form_field_container_inner_radio_fields"
        >
          <Checkbox
            className="form_field_container_inner_radio"
            value={option.label}
            label={option.label !== 'Other' ? option.label : ''}
            name="multiselector"
            checked={_.some(value, { value: option.label })}
            onClick={onCheck}
          />
          {option.label === 'Other' && (
            <Input
              className="input-other"
              placeholder="Other"
              value={otherValue}
              disabled={!isOtherSelected}
              onChange={onOtherInputChange}
            />
          )}
        </Form.Field>
      ))}
    </div>
  );
};

export default MultipleSelector;
