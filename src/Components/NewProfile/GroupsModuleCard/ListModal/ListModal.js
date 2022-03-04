/* eslint-disable jsx-a11y/anchor-is-valid */
import React from 'react';
import BEMHelper from 'react-bem-helper';
import PropTypes from 'prop-types';
import { Modal } from 'semantic-ui-react';
import cx from 'classnames';
import ListItems from '../../../Elements/ListItems';
import './ListModal.scss';

const baseClass = 'GroupsListModal';
const bem = BEMHelper({ name: baseClass, outputIsString: true });

const GroupsListModal = ({ Trigger, borderOnImage, groups, className }) => (
  <Modal
    trigger={Trigger}
    dimmer="inverted"
    className={cx(baseClass, className)}
    closeOnDimmerClick={false}
    closeIcon={{ name: 'close', color: 'grey' }}
  >
    <Modal.Content>
      <h3>Groups</h3>
      <div className={bem('content')}>
        <ListItems items={groups} borderOnImage={borderOnImage} type="groups" />
      </div>
    </Modal.Content>
  </Modal>
);

GroupsListModal.propTypes = {
  Trigger: PropTypes.node,
  className: PropTypes.string,
  borderOnImage: PropTypes.bool,
  groups: PropTypes.arrayOf(PropTypes.object),
};

GroupsListModal.defaultProps = {
  borderOnImage: true,
  Trigger: <span className={bem('default-trigger')}>see all</span>,
};

export default GroupsListModal;
