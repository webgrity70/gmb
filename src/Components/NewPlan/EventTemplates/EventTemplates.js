/* eslint-disable no-restricted-globals */
/* eslint-disable react/no-children-prop */
import React, { useState, useMemo } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Modal, Icon } from 'semantic-ui-react';
import moment from 'moment';
import { change, touch } from 'redux-form';
import { compose } from 'redux';
import BEMHelper from 'react-bem-helper';
import { Input } from '../../ReduxForm';
import withEventsTemplates from '../../HoCs/resources/withEventsTemplates';
import { getHabit, getTimeFromMinutes } from '../utils';
import TemplateDetail from './TemplateDetail';

import './EventTemplates.scss';
import indexesToPrompts from '../../../utils/indexesToPrompts';

const bem = BEMHelper({ name: 'EventTemplates', outputIsString: true });

const ModalContent = ({
  changeFormValue,
  formName,
  touchField,
  templates,
  forChallenges,
}) => {
  const [openModal, setOpenModal] = useState(false);
  const [searchValue, setSearchValue] = useState('');
  const [editing, setEditable] = useState([]);
  function toggleEntryEdit(id) {
    const news = editing.includes(id)
      ? editing.filter((e) => e !== id)
      : [...editing, id];
    setEditable(news);
  }
  const baseProps = {
    onClose: () => setOpenModal(false),
    onOpen: () => setOpenModal(true),
    open: openModal,
    className: bem(),
    dimmer: 'inverted',
    size: 'small',
    closeOnDimmerClick: false,
    closeIcon: { name: 'close', color: 'grey' },
  };
  const filteredValues = useMemo(
    () =>
      templates.filter(
        (e) => new RegExp(searchValue, 'ig').test(e.name) && !e.challengeID
      ),
    [templates, searchValue]
  );
  function onSelectTemplate({ name, events, id }) {
    if (!events.length) return;
    const data = events[0];
    const { hours, minutes } = getTimeFromMinutes(data.duration);
    const [timeHours, timeMinutes, timeFormat] = moment(data.date)
      .format('hh:mm:a')
      .split(':');
    const habit = {
      ...getHabit(data),
      customizePrompts: false,
      description: data.specifics,
    };
    touchField(formName, 'time', 'date', 'duration', 'location');
    changeFormValue(formName, 'habit', habit);
    changeFormValue(formName, 'duration', {
      hours: !isNaN(hours) ? `${hours}` : hours,
      minutes: !isNaN(minutes) ? `${minutes}` : minutes,
    });
    changeFormValue(formName, 'location', data.place);
    if (!forChallenges) {
      changeFormValue(formName, 'templateEvent', data.templateID);
      changeFormValue(formName, 'baseTemplate', id);
    } else {
      changeFormValue(formName, 'challenge', {
        active: true,
        name,
        address: {
          active: false,
          location: '',
          placeId: null,
        },
      });
    }
    changeFormValue(formName, 'customPrompts', {
      active: data.prompts.length > 0,
      prompts: data.prompts.length > 0 ? indexesToPrompts(data.prompts) : [''],
    });
    changeFormValue(formName, 'time', {
      hours: timeHours,
      minutes: timeMinutes,
      format: timeFormat,
    });
    setOpenModal(false);
  }
  return (
    <div className={bem()}>
      <Modal
        {...baseProps}
        trigger={
          <div className={bem('trigger')}>
            <Icon name="file" />
            Load from templates...
          </div>
        }
      >
        <Modal.Content>
          <h3>Event Templates</h3>
          <div className={bem('search')}>
            <Icon name="search" />
            <Input
              value={searchValue}
              onClick={(e) => e.stopPropagation()}
              placeholder="Search..."
              onChange={(value) => setSearchValue(value)}
            />
          </div>
          <div className={bem('list')}>
            {filteredValues.map((template) => (
              <TemplateDetail
                {...template}
                isEditOn={editing.includes(template.id)}
                onToggleEdit={toggleEntryEdit}
                key={template.id}
                onSelect={onSelectTemplate}
              />
            ))}
          </div>
        </Modal.Content>
      </Modal>
    </div>
  );
};

ModalContent.propTypes = {
  templates: PropTypes.arrayOf(PropTypes.shape()),
  changeFormValue: PropTypes.func,
  touchField: PropTypes.func,
  forChallenges: PropTypes.bool,
  formName: PropTypes.string,
};

export default compose(
  withEventsTemplates({}),
  connect(null, { changeFormValue: change, touchField: touch })
)(ModalContent);
