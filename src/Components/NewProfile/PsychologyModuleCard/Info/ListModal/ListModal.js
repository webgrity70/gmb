/* eslint-disable jsx-a11y/anchor-is-valid */
import React from 'react';
import BEMHelper from 'react-bem-helper';
import PropTypes from 'prop-types';
import { Modal } from 'semantic-ui-react';
import PsychologyList from '../PsychologyList/PsychologyList';
import './ListModal.scss';

const baseClass = 'PsychologyListModal';
const bem = BEMHelper({ name: baseClass, outputIsString: true });

const PsychologyListModal = ({ Trigger, items }) => (
  <Modal
    trigger={Trigger}
    dimmer="inverted"
    className={bem()}
    closeIcon={{ name: 'close', color: 'grey' }}
  >
    <Modal.Content>
      <h3>Psychology</h3>
      <div className={bem('content')}>
        <PsychologyList items={items} />
      </div>
    </Modal.Content>
  </Modal>
);

PsychologyListModal.propTypes = {
  Trigger: PropTypes.node,
  items: PropTypes.arrayOf(PropTypes.object),
};

PsychologyListModal.defaultProps = {
  Trigger: <span className={bem('default-trigger')}>see all</span>,
};

export default PsychologyListModal;
