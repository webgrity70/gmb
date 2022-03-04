/* eslint-disable react/no-children-prop */
import React from 'react';
import PropTypes from 'prop-types';
import ModalContent from './ModalContent';
import withEventsTemplates from '../../HoCs/resources/withEventsTemplates';
import Trigger from './TemplatesTrigger';

const PlanContent = withEventsTemplates({})(ModalContent);

const EventTemplates = ({ onSelect }) => (
  <Trigger onSelect={onSelect}>
    {(props) => <PlanContent type="Event" {...props} />}
  </Trigger>
);

EventTemplates.propTypes = {
  onSelect: PropTypes.func,
};

export default EventTemplates;
