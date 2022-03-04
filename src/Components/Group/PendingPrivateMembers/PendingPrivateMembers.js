import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { compose } from 'redux';
import BEMHelper from 'react-bem-helper';
import withSizes from 'react-sizes';
import { Modal, Button } from 'semantic-ui-react';
import PropTypes from 'prop-types';
import { fetchPendingPrivateMembers as fetchPendingPrivateMembersAction } from '../../../Actions/actions_groups';
import { getPPMCount } from '../../../selectors/groups';
import Table from './Table';
import './PendingPrivateMembers.scss';

const bem = BEMHelper({ name: 'PendingPrivateMembers', outputIsString: true });

const PendingPrivateMembers = ({
  fetchPendingPrivateMembers,
  count,
  groupId,
  isMobile,
}) => {
  useEffect(() => {
    if (!isMobile) fetchPendingPrivateMembers(groupId);
  }, [groupId]);
  if (isMobile) {
    return (
      <div className={bem('use-desktop')}>
        <span>To see pending members, use desktop.</span>
      </div>
    );
  }
  if (count === 0) return null;
  return (
    <div className={bem()}>
      <Modal
        dimmer="inverted"
        closeIcon
        closeOnDimmerClick={false}
        trigger={
          <Button color="orange">
            Pending
            <div className={bem('count')}>{count}</div>
          </Button>
        }
        size="fullscreen"
      >
        <Modal.Content>
          <div className={bem('title')}>Pending Requests</div>
          <Table groupId={groupId} />
        </Modal.Content>
      </Modal>
    </div>
  );
};

PendingPrivateMembers.propTypes = {
  groupId: PropTypes.number,
  fetchPendingPrivateMembers: PropTypes.func,
  count: PropTypes.number,
  isMobile: PropTypes.bool,
};

const mapStateToProps = (state) => ({
  count: getPPMCount(state),
});

export default compose(
  connect(mapStateToProps, {
    fetchPendingPrivateMembers: fetchPendingPrivateMembersAction,
  }),
  withSizes(({ width }) => ({
    isMobile: width < 768,
  }))
)(PendingPrivateMembers);
