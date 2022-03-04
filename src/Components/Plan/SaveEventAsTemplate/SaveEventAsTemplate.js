/* eslint-disable jsx-a11y/anchor-is-valid */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import React, { useState } from 'react';
import { connect } from 'react-redux';
import cx from 'classnames';
import PropTypes from 'prop-types';
import { Modal, Button } from 'semantic-ui-react';
import BEMHelper from 'react-bem-helper';
import { Input } from '../../ReduxForm';
import './SaveEventAsTemplate.scss';
import {
  updateEvent as updateEventAction,
  createEvent as createEventAction,
} from '../../../Actions/actions_plan';
import {
  getUpdateEventLoading,
  getCreateEventLoading,
} from '../../../selectors/requests';

const bem = BEMHelper({ name: 'SaveEventAsTemplate', outputIsString: true });

function SaveEventAsTemplate({
  loading,
  trigger,
  updateEvent,
  event,
  createEvent,
  ...props
}) {
  const [openModal, setOpenModal] = useState(false);
  const [templateName, setTemplateName] = useState('');
  const baseProps = {
    onClose: () => setOpenModal(false),
    onOpen: () => setOpenModal(true),
    open: openModal,
    className: bem(),
    closeOnDimmerClick: false,
    dimmer: 'inverted',
    size: 'tiny',
    trigger,
    closeIcon: { name: 'close', color: 'grey' },
    ...props,
  };
  async function onCreate() {
    const data = {
      ...event,
      createTemplate: true,
      templateName,
    };
    if (event.id) await updateEvent(data);
    else await createEvent({ ...data, createEvent: false }, false, true);
    setOpenModal(false);
  }
  return (
    <Modal {...baseProps}>
      <Modal.Content>
        <h3 className={bem('title')}>Save as Template</h3>
        <div className="px-8 pb-6">
          <span>Template Name</span>
          <Input
            value={templateName}
            onChange={setTemplateName}
            placeholder="Enter template name..."
          />
        </div>
      </Modal.Content>
      <Modal.Actions>
        <a className="pointer" onClick={() => setOpenModal(false)}>
          Cancel
        </a>
        {loading ? (
          <Button basic loading />
        ) : (
          <a
            className={cx('pointer', { disabled: templateName.length < 3 })}
            {...(templateName.length > 2 && { onClick: onCreate })}
          >
            Create
          </a>
        )}
      </Modal.Actions>
    </Modal>
  );
}

SaveEventAsTemplate.propTypes = {
  trigger: PropTypes.node,
  createEvent: PropTypes.func,
  event: PropTypes.shape(),
  updateEvent: PropTypes.func,
  loading: PropTypes.bool,
};

const mapStateToProps = (state) => ({
  loading: getUpdateEventLoading(state) || getCreateEventLoading(state),
});

export default connect(mapStateToProps, {
  updateEvent: updateEventAction,
  createEvent: createEventAction,
})(SaveEventAsTemplate);
