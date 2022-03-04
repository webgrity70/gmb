import React from 'react';
import cx from 'classnames';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import BEMHelper from 'react-bem-helper';
import {
  Form,
  Grid,
  Dropdown,
  Input,
  Radio,
  Checkbox,
} from 'semantic-ui-react';
import * as optionsSelectors from '../../../selectors/profileFormOptions';

import './NegativeBehaviour.scss';

const bem = BEMHelper({
  name: 'ProfileFormNegativeBehaviour',
  outputIsString: true,
});

const weightUnitOptions = [
  { key: 'kg', text: 'kg', value: 'kg' },
  { key: 'lb', text: 'lb', value: 'lb' },
];

function NegativeBehaviourForm(props) {
  const { form, behaviours, showPrivacy, className } = props;
  const { values, setFieldValue } = form;
  const { weightLoss } = values.specialBehaviours;
  return (
    <Form as="div" className={bem()}>
      <Grid className={cx(bem('options'), className)}>
        {behaviours.map((behaviour) => {
          const checkboxLabel = (
            <div className="flex items-center">
              {behaviour.icon ? (
                <img
                  src={behaviour.icon}
                  className="ml-3"
                  width={24}
                  height={24}
                  alt={behaviour.name}
                />
              ) : null}
              <span className="ml-3">{behaviour.name}</span>
            </div>
          );

          if (behaviour.name === 'Lose Weight') {
            const checked = values.specialBehaviours.LoseWeight || false;
            return (
              <Grid.Column key={behaviour.name} width={8}>
                <Form.Field>
                  <div className="flex items-center">
                    <Checkbox
                      className="pt-2"
                      onChange={() =>
                        setFieldValue(
                          'specialBehaviours.LoseWeight',
                          !values.specialBehaviours.LoseWeight
                        )
                      }
                      checked={checked}
                    />
                    <span className={cx(checked && 'font-bold')}>
                      {checkboxLabel}
                    </span>
                  </div>
                </Form.Field>
                {values.specialBehaviours.LoseWeight && (
                  <Input
                    min={0}
                    type="number"
                    className={bem('weight-loss-input')}
                    value={weightLoss != null ? weightLoss : ''}
                    onChange={(e) =>
                      setFieldValue(
                        'specialBehaviours.weightLoss',
                        e.target.value
                      )
                    }
                    label={
                      <Dropdown
                        options={weightUnitOptions}
                        value={values.weightUnit || null}
                        onChange={(e, { value }) =>
                          setFieldValue('weightUnit', value)
                        }
                      />
                    }
                    placeholder="15"
                    labelPosition="right"
                  />
                )}
              </Grid.Column>
            );
          }

          const checked = values.behaviours[behaviour.name] || false;

          return (
            <Grid.Column key={behaviour.name} width={8}>
              <Form.Field>
                <div className="flex items-center">
                  <Checkbox
                    className="pt-2"
                    onChange={() =>
                      setFieldValue(
                        `behaviours.${behaviour.name}`,
                        !values.behaviours[behaviour.name]
                      )
                    }
                    checked={checked}
                  />
                  <span className={cx(checked && 'font-bold')}>
                    {checkboxLabel}
                  </span>
                </div>
              </Form.Field>
            </Grid.Column>
          );
        })}
      </Grid>
      {showPrivacy && (
        <div className={bem('toggle-container')}>
          <Radio
            toggle
            checked={!values.isPublic}
            onChange={() => setFieldValue('isPublic', !values.isPublic)}
          />
          <span>Private</span>
        </div>
      )}
    </Form>
  );
}

NegativeBehaviourForm.propTypes = {
  showPrivacy: PropTypes.bool,
  className: PropTypes.string,
  form: PropTypes.shape({
    values: PropTypes.shape({}).isRequired,
    setFieldValue: PropTypes.func.isRequired,
  }),
  behaviours: PropTypes.arrayOf(PropTypes.shape({})),
};

NegativeBehaviourForm.defaultProps = {
  showPrivacy: true,
};

const mapStateToProps = (state) => ({
  behaviours: optionsSelectors.getNegativeBehaviourOptions(state) || [],
});

export default connect(mapStateToProps, null)(NegativeBehaviourForm);
