/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import { Icon, Popup } from 'semantic-ui-react';
import BEMHelper from 'react-bem-helper';
import { Field } from 'redux-form';
import { CheckBox, Input } from '../index';
import FieldSetLayout from '../FieldSetLayout';
import './CustomPrompts.scss';

const bem = BEMHelper({ name: 'CustomPrompts', outputIsString: true });

const placeholders = [
  'e.g., How many miles?',
  'e.g., I feel...',
  'e.g., My weight is...',
];

function InnerComp({
  input: { value, onChange, name, onBlur },
  meta,
  ...props
}) {
  function onChangeCustomPromp(val, index) {
    onBlur();
    const prompts = [...value.prompts];
    prompts[index] = val;
    onChange({ ...value, prompts });
  }
  function onRemoveCustomPromp(index) {
    const prompts = [...value.prompts];
    prompts.splice(index, 1);
    onChange({ ...value, prompts });
  }
  function onAddCustomPromp() {
    const prompts = [...value.prompts];
    prompts.push('');
    onChange({ ...value, prompts });
  }
  return (
    <FieldSetLayout meta={meta} {...props}>
      <div className={bem()}>
        <div>
          <CheckBox
            label="Customize check-in prompts"
            value={value.active}
            onChange={(active) => {
              onBlur();
              onChange({ ...value, active });
            }}
          />
          <Popup
            trigger={<i className="far fa-question-circle mt-2 ml-3" />}
            on="click"
            inverted
            hoverable
            className={bem('popup')}
          >
            Track measurements, like weight lost, miles run, pages written,
            feelings - anything - throughout your plan.
          </Popup>
        </div>
        {value.active && (
          <div className={bem('prompts')}>
            {value.prompts.map((text, index) => (
              <div
                key={`${name}-custom-prompts-${index + 1}`}
                className={cx('flex justify-between items-center', {
                  'mt-2': index > 0,
                })}
              >
                <Input
                  value={text}
                  onChange={(val) => onChangeCustomPromp(val, index)}
                  placeholder={placeholders[index]}
                />
                <Icon name="times" onClick={() => onRemoveCustomPromp(index)} />
              </div>
            ))}
            {value.prompts.length < 3 && (
              <div
                className={cx(bem('trigger'), 'mt-2 ml-4')}
                onClick={onAddCustomPromp}
              >
                <span>+Add prompt</span>
              </div>
            )}
          </div>
        )}
      </div>
    </FieldSetLayout>
  );
}

InnerComp.propTypes = {
  input: PropTypes.shape(),
  meta: PropTypes.shape(),
};

const CustomPrompts = (props) => <Field {...props} component={InnerComp} />;

export default CustomPrompts;
