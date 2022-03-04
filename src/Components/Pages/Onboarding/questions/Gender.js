import React from 'react';
import { Form, Radio, Input } from 'semantic-ui-react';

const Gender = ({ value, onChange }) => {
  const isCustomSelected = !!value && ['Female', 'Male'].indexOf(value) === -1;
  return (
    <React.Fragment>
      <Form.Field>
        <Radio
          label="Male"
          name="gender"
          value="Male"
          checked={value === 'Male'}
          onChange={onChange}
        />
      </Form.Field>
      <Form.Field>
        <Radio
          label="Female"
          name="gender"
          value="Female"
          checked={value === 'Female'}
          onChange={onChange}
        />
      </Form.Field>
      <Form.Field>
        <Radio
          name="gender"
          value="Custom"
          checked={isCustomSelected}
          onChange={onChange}
        />
        <Input
          value={isCustomSelected ? value : ''}
          onChange={onChange}
          placeholder="Custom"
        />
      </Form.Field>
    </React.Fragment>
  );
};

export default Gender;
