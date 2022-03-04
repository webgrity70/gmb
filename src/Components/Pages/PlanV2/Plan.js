/* eslint-disable jsx-a11y/anchor-is-valid */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import React, { useCallback, useState } from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { withRouter, Link } from 'react-router-dom';
import { Container, Icon } from 'semantic-ui-react';
import PropTypes from 'prop-types';
import BEMHelper from 'react-bem-helper';
import {
  deletePlan as deletePlanAction,
  updatePlan as updatePlanAction,
} from '../../../Actions/actions_plan';
import { getUpdatePlanLoading } from '../../../selectors/requests';
import NotificationsModal from '../../NotificationsModal/NotificationsModal';
import { withPlan } from '../../HoCs';
import { PlanForm } from '../../NewPlan';
import { getMyProfileId } from '../../../selectors/profile';
import './Plan.scss';

const bem = BEMHelper({ name: 'PlanPage', outputIsString: true });

const Plan = ({ myId, plan, deletePlan, updatePlan, history, loading }) => {
  const [openNotificationsModal, setOpenNotificationsModal] = useState(false);
  const onCloseModal = useCallback(() => {
    setOpenNotificationsModal(false);
    history.push('/plan');
  }, [setOpenNotificationsModal, history]);
  async function onSave(values) {
    await updatePlan({
      id: plan.id,
      eventsIds: plan.events.map(({ id }) => id),
      ...values,
    });
    setOpenNotificationsModal(true);
  }
  function onDelete() {
    deletePlan(plan.id);
  }
  return (
    <div className={bem()}>
      <Container>
        <h1 className={bem('title')}>Your Plan</h1>
        <div className={bem('container')}>
          <h1>Edit plan</h1>
          <Link to="/plan">
            <Icon name="close" />
          </Link>
          <PlanForm
            profileId={myId}
            onSubmit={onSave}
            onDelete={onDelete}
            initialValues={plan}
            loading={loading}
          />
        </div>
      </Container>
      <NotificationsModal
        open={openNotificationsModal}
        onClose={onCloseModal}
      />
    </div>
  );
};

Plan.propTypes = {
  plan: PropTypes.shape(),
  myId: PropTypes.number,
  deletePlan: PropTypes.func,
  loading: PropTypes.bool,
  updatePlan: PropTypes.func,
  history: PropTypes.shape(),
};

const mapStateToProps = (state) => ({
  myId: getMyProfileId(state),
  loading: getUpdatePlanLoading(state),
});

export default compose(
  connect(mapStateToProps, {
    deletePlan: deletePlanAction,
    updatePlan: updatePlanAction,
  }),
  withRouter,
  withPlan({})
)(Plan);
