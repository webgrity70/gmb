/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useState } from 'react';
import moment from 'moment-timezone';
import { Modal } from 'semantic-ui-react';
import { connect } from 'react-redux';
import BEMHelper from 'react-bem-helper';
import PropTypes from 'prop-types';
import * as planActions from '../../../Actions/actions_plan';
import { Input } from '../../ReduxForm';
import './MakeIntoFlashModal.scss';

const bem = BEMHelper({ name: 'MakeIntoFlashModal', outputIsString: true });

function MakeIntoFlashModal({
  open,
  data,
  onClose,
  createPlan,
  deleteEvent,
  eventTitle,
}) {
  const [name, setName] = useState(eventTitle);
  const baseModalProps = {
    open,
    onClose: () => onClose(),
    dimmer: 'inverted',
    className: bem(),
    closeOnDimmerClick: false,
    closeIcon: { name: 'close', color: 'grey' },
  };
  async function onSave() {
    deleteEvent(data.pk, true);
    const planData = {
      name,
      startDate: moment.utc(data.start_date).format('YYYY-MM-DD'),
      weeks: 1,
      timezoneRestriction: 'Global',
      timezone: moment.tz.guess(),
      createTemplate: true,
      globalTemplate: true,
      challenge: {
        name,
        active: true,
        description: name,
        address: { active: false },
      },
      templateName: name,
      events: [
        {
          date: moment.utc(data.start_date).format(),
          category: data.habit.category.name,
          habit: data.habit.name,
          place: data.location,
          duration: data.session_duration,
          ...(data.milestone && {
            milestone: data.milestone,
          }),
          ...(data.specifics && { specifics: data.specifics }),
          ...(data.prompts && { prompts: data.prompts }),
        },
      ],
    };
    await createPlan(planData);
    onClose(true);
  }
  return (
    <Modal {...baseModalProps}>
      <Modal.Content>
        <h5 className={bem('title')}>Make this event into a challenge?</h5>
        <p className={bem('description')}>
          Let others join you. Making this event a flash challenge will remove
          it from your plan.
        </p>
        <div className={bem('input')}>
          <span>What is the name of this flash challenge?</span>
          <Input onChange={(val) => setName(val)} value={name} />
          <span>What your buddy will see</span>
        </div>
      </Modal.Content>
      <Modal.Actions>
        <a className="pointer" onClick={() => onClose()}>
          Cancel
        </a>
        <a className="pointer" onClick={() => onSave()}>
          Save
        </a>
      </Modal.Actions>
    </Modal>
  );
}

MakeIntoFlashModal.propTypes = {
  open: PropTypes.bool,
  data: PropTypes.shape(),
  onClose: PropTypes.func,
  createPlan: PropTypes.func,
  deleteEvent: PropTypes.func,
  eventTitle: PropTypes.string,
};

export default connect(null, {
  deleteEvent: planActions.deleteEvent,
  createPlan: planActions.createPlan,
})(MakeIntoFlashModal);
