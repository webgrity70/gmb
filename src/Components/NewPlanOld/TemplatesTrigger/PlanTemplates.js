import React from 'react';
import PropTypes from 'prop-types';
import ModalContent from './ModalContent';
import withPlansTemplates from '../../HoCs/resources/withPlansTemplates';
import Trigger from './TemplatesTrigger';

const PlanContent = withPlansTemplates({})(ModalContent);

const PlanTemplates = ({ onSelect, trigger }) => (
  <Trigger onSelect={onSelect} trigger={trigger}>
    {(props) => <PlanContent type="Plan" {...props} />}
  </Trigger>
);

PlanTemplates.propTypes = {
  onSelect: PropTypes.func,
  trigger: PropTypes.oneOfType([PropTypes.func, PropTypes.element]),
};

export default PlanTemplates;
