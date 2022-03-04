/* eslint-disable jsx-a11y/anchor-is-valid */
import React from 'react';
import BEMHelper from 'react-bem-helper';
import PropTypes from 'prop-types';
import { Modal } from 'semantic-ui-react';
import cx from 'classnames';
import ListItems from '../../../Elements/ListItems';
import './ListModal.scss';

const baseClass = 'AppsListModal';
const bem = BEMHelper({ name: baseClass, outputIsString: true });

const AppsListModal = ({ Trigger, apps, className }) => (
  <Modal
    trigger={Trigger}
    dimmer="inverted"
    closeOnDimmerClick={false}
    className={cx(baseClass, className)}
    closeIcon={{ name: 'close', color: 'grey' }}
  >
    <Modal.Content>
      <h3>Apps</h3>
      <div className={bem('content')}>
        <ListItems items={apps} borderOnImage={false} type="apps" />
      </div>
    </Modal.Content>
  </Modal>
);

AppsListModal.propTypes = {
  Trigger: PropTypes.node,
  className: PropTypes.string,
  apps: PropTypes.arrayOf(PropTypes.object),
};

AppsListModal.defaultProps = {
  Trigger: <span className={bem('default-trigger')}>see all</span>,
};

export default AppsListModal;
