/* eslint-disable jsx-a11y/label-has-associated-control */

import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import BEMHelper from 'react-bem-helper';
import { Dropdown } from 'semantic-ui-react';
import { fetchPlansTemplates as fetchPlansTemplatesAction } from '../../../Actions/actions_plan';
import { getPlansTemplates } from '../../../selectors/plans';
import FieldSetLayout from '../../ReduxForm/FieldSetLayout';
import './PlanTemplatesDropdown.scss';

const bem = BEMHelper({ name: 'PlanTemplatesDropdown', outputIsString: true });

function PlanTemplatesDropdown({
  value,
  label,
  isEditing,
  legend,
  onSelect,
  templates,
  placeholder,
  fetchPlansTemplates,
}) {
  useEffect(() => {
    fetchPlansTemplates();
  }, []);
  const options = templates
    .filter((e) => !e.challengeID)
    .map((template) => ({
      key: `plan-template-${template.id}`,
      text: template.name,
      value: template.id,
    }));
  const isNew = !options.find((e) => e.text === value);
  if (isEditing || isNew) {
    options.push({
      key: 'plan-template-new',
      text: value,
      value,
    });
  }
  return (
    <div className={bem()}>
      <FieldSetLayout legend={legend} label={label}>
        <Dropdown
          search
          clearable
          selection
          allowAdditions
          options={options}
          onChange={(e, { value: val }) => onSelect(val)}
          placeholder={placeholder}
          {...(isEditing && { value })}
        />
      </FieldSetLayout>
    </div>
  );
}
PlanTemplatesDropdown.propTypes = {
  onSelect: PropTypes.func,
  isEditing: PropTypes.bool,
  templates: PropTypes.arrayOf(PropTypes.shape()),
  fetchPlansTemplates: PropTypes.func,
  placeholder: PropTypes.string,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.oneOf([null])]),
  legend: PropTypes.oneOfType([PropTypes.string, PropTypes.oneOf([null])]),
  label: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.node,
    PropTypes.oneOf([null]),
  ]),
};

export default connect((state) => ({ templates: getPlansTemplates(state) }), {
  fetchPlansTemplates: fetchPlansTemplatesAction,
})(PlanTemplatesDropdown);
