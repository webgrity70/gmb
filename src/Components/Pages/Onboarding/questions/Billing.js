import React from 'react';
import { Form } from 'semantic-ui-react';
import { countries } from '../../../Utils/countries';

const Billing = ({ onChange, value }) => {
  const onDataChange = console.log;
  return (
    <div className="billing">
      <Form.Group widths="equal">
        <Form.Input
          label="First Name"
          placeholder="First Name"
          width={6}
          onChange={(event) => onDataChange('first_name', event.target.value)}
        />
        <Form.Input
          label="Last Name"
          placeholder="Last Name"
          width={6}
          onChange={(event) => onDataChange('last_name', event.target.value)}
        />
      </Form.Group>
      <Form.Group widths="equal">
        <Form.Input
          label="Email"
          placeholder="Email"
          onChange={(event) => onDataChange('email', event.target.value)}
          width={6}
        />

        <Form.Input
          label="Phone"
          placeholder="Phone"
          onChange={(event) => onDataChange('phone', event.target.value)}
          width={6}
        />
      </Form.Group>
      <Form.Group widths="equal">
        <Form.Input
          label="Address"
          placeholder="Address"
          onChange={(event) =>
            onDataChange('billing_addr1', event.target.value)
          }
          width={6}
        />

        <Form.Input
          label="City"
          placeholder="City"
          onChange={(event) => onDataChange('billing_city', event.target.value)}
          width={6}
        />
      </Form.Group>
      <Form.Group widths="equal">
        <Form.Input
          type="number"
          label="Zip"
          placeholder="Zip"
          onChange={(event) =>
            onDataChange('billing_zip', parseInt(event.target.value, 10))
          }
        />
        <Form.Input
          label="State"
          placeholder="State"
          onChange={(event) =>
            onDataChange('billing_state', event.target.value)
          }
        />
        <Form.Select
          label="Country"
          placeholder="Country"
          search
          options={countries}
          onChange={(e, { value }) => onDataChange('billing_country', value)}
        />
      </Form.Group>
    </div>
  );
};

export default Billing;
