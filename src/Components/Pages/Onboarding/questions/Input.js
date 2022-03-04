import React from 'react';
import { Form, Input } from 'semantic-ui-react';

const GMBInput = (props) => (
  <Form.Field className="form_field_container_inner">
    <Input {...props} />
  </Form.Field>
);

export default GMBInput;
