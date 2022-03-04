/* eslint-disable react/no-unescaped-entities */
import React, { Fragment, useEffect, useState, useCallback } from 'react';
import { compose } from 'redux';
import { withRouter, Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import isEmpty from 'lodash/isEmpty';
import { Container, Icon } from 'semantic-ui-react';
import BEMHelper from 'react-bem-helper';
import { CardType } from '../../NewGroup';
import { types, constants } from './utils';
import {
  createEvent as createEventAction,
  createPlan as createPlanAction,
  setDraftPlan as setDraftPlanAction,
} from '../../../Actions/actions_plan';
import { getMyProfileId } from '../../../selectors/profile';
import { PlanForm, EventForm } from '../../NewPlan';
import {
  getCreateEventLoading,
  getCreatePlanLoading,
} from '../../../selectors/requests';
import { getDraftPlan } from '../../../reducers/session/selectors';
import NotificationsModal from '../../NotificationsModal';
import './NewPlan.scss';

const bem = BEMHelper({ name: 'NewPlanPage', outputIsString: true });

const NewPlan = ({
  myId,
  createEvent,
  createPlan,
  history,
  loadingCreateEvent,
  loadingCreatePlan,
  draftPlan,
  setDraftPlan,
  location,
}) => {
  const [type, setType] = useState(types[0].value);
  const [openNotificationsModal, setOpenNotificationsModal] = useState(false);
  const onCloseModal = useCallback(() => {
    setOpenNotificationsModal(false);
    history.push('/plan');
  }, [setOpenNotificationsModal, history]);
  function onCreateEvent(values) {
    createEvent(values);
  }
  async function onCreatePlan(values) {
    await createPlan(values);
    if (!location.search) setOpenNotificationsModal(true);
  }
  useEffect(() => {
    const section = !isEmpty(location.search)
      ? location.search.split('section=')[1]
      : null;
    if (section) setType(section);
    return () => setDraftPlan(null);
  }, []);
  return (
    <div className={bem()}>
      <Container>
        <h1 className={bem('title')}>Your Plan</h1>
        <div className={bem('container')}>
          <Link to="/plan">
            <Icon name="close" />
          </Link>
          {!draftPlan ? (
            <Fragment>
              <h1>Schedule Your Behaviors</h1>
              <div className="flex justify-center flex-wrap">
                {types.map((p) => (
                  <CardType
                    key={p.value}
                    active={type === p.value}
                    onClick={() => setType(p.value)}
                    {...p}
                  />
                ))}
              </div>
            </Fragment>
          ) : (
            <div className={bem('draft')}>
              <h3>You are editing "{draftPlan.name}"</h3>
              <div>
                Originally created by{' '}
                <Link to={draftPlan.link}>{draftPlan.owner.name}</Link>
              </div>
            </div>
          )}

          {type === constants.PLAN ? (
            <PlanForm
              profileId={myId}
              onSubmit={onCreatePlan}
              loading={loadingCreatePlan}
            />
          ) : (
            <EventForm
              profileId={myId}
              onSubmit={onCreateEvent}
              loading={loadingCreateEvent}
            />
          )}
        </div>
      </Container>
      <NotificationsModal
        open={openNotificationsModal}
        onClose={onCloseModal}
      />
    </div>
  );
};

const mapStateToProps = (state) => {
  const myId = getMyProfileId(state);
  return {
    myId,
    draftPlan: getDraftPlan(state),
    loadingCreateEvent: getCreateEventLoading(state),
    loadingCreatePlan: getCreatePlanLoading(state),
  };
};

NewPlan.propTypes = {
  draftPlan: PropTypes.bool,
  myId: PropTypes.number,
  createEvent: PropTypes.func,
  loadingCreateEvent: PropTypes.bool,
  createPlan: PropTypes.func,
  setDraftPlan: PropTypes.func,
  history: PropTypes.shape(),
  loadingCreatePlan: PropTypes.bool,
  location: PropTypes.shape(),
};

export default compose(
  connect(mapStateToProps, {
    createEvent: createEventAction,
    createPlan: createPlanAction,
    setDraftPlan: setDraftPlanAction,
  }),
  withRouter
)(NewPlan);
