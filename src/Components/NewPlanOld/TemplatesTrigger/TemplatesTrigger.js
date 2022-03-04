/* eslint-disable react/no-unescaped-entities */
/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useState } from 'react';
import BEMHelper from 'react-bem-helper';
import { Modal } from 'semantic-ui-react';
import PropTypes from 'prop-types';
import './TemplatesTrigger.scss';

export const bem = BEMHelper({ name: 'YourTemplates', outputIsString: true });

const TemplatesTrigger = ({ trigger, children, onSelect }) => {
  const [open, setOpen] = useState(false);
  function toggleOpen() {
    setOpen(!open);
  }
  function onSelectTemplate(request) {
    toggleOpen();
    onSelect(request);
  }
  return (
    <div className={bem()}>
      <Modal
        size="tiny"
        dimmer="inverted"
        trigger={trigger || <a>Your Templates</a>}
        closeOnDimmerClick={false}
        className={bem('modal')}
        closeIcon
        content={() => children({ onSelect: onSelectTemplate })}
        open={open}
        onClose={toggleOpen}
        onOpen={toggleOpen}
      />
    </div>
  );
};

TemplatesTrigger.propTypes = {
  children: PropTypes.oneOfType([PropTypes.func, PropTypes.element]),
  onSelect: PropTypes.func,
  trigger: PropTypes.oneOfType([PropTypes.func, PropTypes.element]),
};

export default TemplatesTrigger;
