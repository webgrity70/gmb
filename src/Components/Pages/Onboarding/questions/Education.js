import React, { useMemo } from 'react';
import { Form, Select } from 'semantic-ui-react';
import _ from 'lodash';

// to keep
const Education = ({ value, onChange, options }) => {
  const selectOptions = useMemo(
    () =>
      _.sortBy(options, ['value']).map((option, index) => ({
        text: option.label,
        value: option.label,
        key: index,
      })),
    [options]
  );

  value = value || {};

  const onEducationChange = (e, data) => {
    value.value = data.value;
    onChange(value);
  };

  return (
    <div className="education">
      <Form.Field>
        <Select
          options={selectOptions}
          value={value.value}
          onChange={onEducationChange}
        />
      </Form.Field>
    </div>
  );
};
export default Education;
