import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import BEMHelper from 'react-bem-helper';
import InputRange from 'react-input-range';
import { Form, Input, Radio, Divider } from 'semantic-ui-react';

import './BuddyPreferences.scss';

const bem = BEMHelper({
  name: 'ProfileFormBuddyPreferences',
  outputIsString: true,
});

function BuddyPreferencesForm(props) {
  const { form } = props;
  const { values, setFieldValue } = form;
  return (
    <Form as="div" className={bem()}>
      <SectionLabel name="Gender" />
      <Form.Group className="mb-8">
        <Form.Radio
          className="flex items-center"
          width={4}
          label="Male"
          checked={values.buddySex === 'Male'}
          onChange={() => setFieldValue('buddySex', 'Male')}
        />
        <Form.Radio
          className="flex items-center"
          width={4}
          label="Female"
          checked={values.buddySex === 'Female'}
          onChange={() => setFieldValue('buddySex', 'Female')}
        />
        <Form.Radio
          className="flex items-center"
          width={3}
          label="Any"
          checked={values.buddySex === 'Any'}
          onChange={() => setFieldValue('buddySex', 'Any')}
        />
        <Form.Field width={5}>
          <div className="flex items-center">
            <Radio
              className="mr-4"
              checked={values.buddySex === 'Custom'}
              onChange={() => setFieldValue('buddySex', 'Custom')}
            />
            <Input
              size="small"
              fluid
              type="text"
              placeholder="Custom"
              value={values.customBuddySex}
              onChange={(e) => setFieldValue('customBuddySex', e.target.value)}
            />
          </div>
        </Form.Field>
      </Form.Group>
      <SectionLabel name="Meeting preference" />
      <Form.Group className="mb-8">
        <Form.Radio
          className="flex items-center"
          width={4}
          label="In Person"
          checked={values.meetingPreference === 'In Person'}
          onChange={() => setFieldValue('meetingPreference', 'In Person')}
        />
        <Form.Radio
          className="flex items-center"
          width={4}
          label="Virtual"
          checked={values.meetingPreference === 'Virtual'}
          onChange={() => setFieldValue('meetingPreference', 'Virtual')}
        />
        <Form.Radio
          className="flex items-center"
          width={3}
          label="Either"
          checked={values.meetingPreference === 'Either'}
          onChange={() => setFieldValue('meetingPreference', 'Either')}
        />
      </Form.Group>
      <SectionLabel name="Age Range" />
      <Form.Field className={bem('range-field')}>
        <InputRange
          maxValue={122}
          minValue={16}
          value={values.buddyAges}
          step={1}
          onChange={(value) => {
            setFieldValue('buddyAges', value);
          }}
        />
      </Form.Field>
      {['Either', 'Virtual'].includes(values.meetingPreference) && (
        <>
          <SectionLabel name="Timezone" />
          <Form.Field className={bem('range-field')}>
            <InputRange
              maxValue={14}
              minValue={0}
              value={values.buddyTimezone}
              formatLabel={(number) => `±${number}`}
              step={1}
              onChange={(value) => {
                setFieldValue('buddyTimezone', value);
              }}
            />
          </Form.Field>
        </>
      )}
      {['Either', 'In Person'].includes(values.meetingPreference) && (
        <>
          <SectionLabel name="Distance" />
          <Form.Field className={bem('range-field')}>
            <InputRange
              maxValue={300}
              minValue={0}
              value={values.buddyRadius}
              step={1}
              formatLabel={(number) => `${number} miles`}
              onChange={(value) => {
                setFieldValue('buddyRadius', value);
              }}
            />
          </Form.Field>
        </>
      )}
    </Form>
  );
}

function SectionLabel({ name }) {
  return (
    <div className={bem('preference-label flex')}>
      <span>{name}:</span>
      <Divider />
    </div>
  );
}

SectionLabel.propTypes = {
  name: PropTypes.string,
};

BuddyPreferencesForm.propTypes = {
  form: PropTypes.shape({
    values: PropTypes.shape({}).isRequired,
    setFieldValue: PropTypes.func.isRequired,
  }),
};

const mapStateToProps = () => ({});

export default connect(mapStateToProps, null)(BuddyPreferencesForm);
