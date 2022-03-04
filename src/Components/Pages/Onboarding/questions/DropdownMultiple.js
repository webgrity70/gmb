import React from 'react';
import { Dropdown, Form } from 'semantic-ui-react';
import _ from 'lodash';

const DropdownMultiple = ({
  value,
  onChange,
  options,
  allowAdditions,
  onAddItem,
}) => {
  const handleChange = (e, data) => {
    onChange(data.value);
  };
  options = _.map(options, (option) => {
    const text = option.text || option.label || option.name;
    return {
      key: option.key || text,
      value: text || text,
      text,
      ...(option.content && { content: option.content }),
    };
  });

  value = value || [];

  return (
    <Form.Field className="dropdown-multiple">
      <Dropdown
        placeholder=""
        fluid
        multiple
        search
        selection
        options={options}
        value={value}
        onChange={handleChange}
        allowAdditions={allowAdditions}
        onAddItem={onAddItem}
      />
    </Form.Field>
  );
};

export default DropdownMultiple;
