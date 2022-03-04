import React from 'react';
import PropTypes from 'prop-types';
import { Field } from 'redux-form';
import BEMHelper from 'react-bem-helper';
import { Checkbox, Popup } from 'semantic-ui-react';
import FieldSetLayout from '../../ReduxForm/FieldSetLayout';
import { Input } from '../../ReduxForm';
import './MilestoneCheckBox.scss';

const bem = BEMHelper({ name: 'MilestoneCheckBox', outputIsString: true });

function InnerComp({
  input: { name, onChange, onBlur, value },
  label,
  ...props
}) {
  return (
    <FieldSetLayout {...props}>
      <div className={bem()}>
        <div>
          <Checkbox
            label={label}
            name={name}
            checked={Boolean(value.active)}
            onChange={() =>
              onChange({ ...value, active: Boolean(!value.active) })
            }
            className="CheckBoxInput"
          />
          <Popup
            trigger={<i className="far fa-question-circle mt-2 ml-3" />}
            on="click"
            inverted
            hoverable
            className={bem('popup')}
          >
            Add important dates to your plan to mark your progress.
          </Popup>
        </div>
        {value.active && (
          <div className={bem('content')}>
            <div>
              <h4 className={bem('label')}>Milestone description</h4>
              <Input
                placeholder="e.g., Race Day!"
                value={value.description}
                autoFocus
                onChange={(description) => {
                  onBlur();
                  onChange({ ...value, description });
                }}
              />
            </div>
          </div>
        )}
      </div>
    </FieldSetLayout>
  );
}

InnerComp.propTypes = {
  input: PropTypes.shape(),
  label: PropTypes.string,
};

const MilestoneCheckBox = (props) => <Field {...props} component={InnerComp} />;

export default MilestoneCheckBox;
