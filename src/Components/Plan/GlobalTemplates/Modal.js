/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */
import React from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import { Modal, Tab, Icon } from 'semantic-ui-react';
import { bem } from './utils';
import GTTab from './GTTab';
import MTTab from './MTTab/MTTab';

const GTModal = ({
  open,
  onClose,
  history,
  type,
  displayBlank,
  isChallenge,
}) => (
  <Modal
    dimmer="inverted"
    closeIcon={{ name: 'close', color: 'grey' }}
    open={open}
    onClose={onClose}
    closeOnDimmerClick={false}
    size="small"
    className={bem('modal')}
  >
    <Modal.Content>
      <div>
        <h2 className={bem('modal-title')}>{`New ${type}`}</h2>
      </div>
      {displayBlank && (
        <div className={bem('new')} onClick={() => history.push('/plan/new')}>
          <Icon name="plus" />
          Create from Blank
        </div>
      )}
      <Tab
        className={bem('tabs')}
        panes={[
          {
            menuItem: 'Template Marketplace',
            render: () => (
              <GTTab onCloseModal={onClose} isChallenge={isChallenge} />
            ),
          },
          {
            menuItem: 'My Templates',
            render: () => (
              <MTTab onCloseModal={onClose} isChallenge={isChallenge} />
            ),
          },
        ]}
      />
    </Modal.Content>
  </Modal>
);

GTModal.propTypes = {
  onClose: PropTypes.func,
  open: PropTypes.bool,
  history: PropTypes.shape(),
  type: PropTypes.string,
  displayBlank: PropTypes.bool,
  isChallenge: PropTypes.bool,
};

GTModal.defaultProps = {
  type: 'Plan',
  displayBlank: true,
  isChallenge: false,
};

export default withRouter(GTModal);
