/* eslint-disable react/no-unescaped-entities */
import React, { useEffect, useState } from 'react';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { compose } from 'redux';
import PropTypes from 'prop-types';
import withSizes from 'react-sizes';
import { Button } from 'semantic-ui-react';
import {
  getGlobalTemplates,
  getHasUpcomingEvents,
  getPlanLoading,
} from '../../../selectors/plans';
import {
  fetchGlobalTemplates as fetchGlobalTemplatesAction,
  resetGTPagination as resetGTPaginationAction,
} from '../../../Actions/actions_plan';
import { bem } from './utils';
import Modal from './Modal';
import { getGlobalTemplatesLoading } from '../../../selectors/requests';
import './GlobalTemplates.scss';

const GlobalTemplates = ({
  isMobile,
  resetGTPagination,
  fetchGlobalTemplates,
  ...props
}) => {
  const [openModal, setOpenModal] = useState(false);

  function toggleModal() {
    setOpenModal(!openModal);
  }

  function onCloseModal() {
    toggleModal();
    resetGTPagination();
    fetchGlobalTemplates();
  }

  useEffect(() => {
    fetchGlobalTemplates();

    if (
      props.location.pathname === '/plan/create' ||
      (props.location.state && props.location.state.from === '/buddies')
    ) {
      toggleModal();
    }

    return () => {
      if (openModal) resetGTPagination();
    };
  }, []);

  return (
    <>
      <div className={bem('actions')}>
        <span>Build your plan</span>

        <Button color="orange" onClick={toggleModal}>
          Create a plan
        </Button>
      </div>

      <Modal
        open={openModal}
        onClose={onCloseModal}
        isMobile={isMobile}
        closeOnDimmerClick={false}
      />
    </>
  );
};

const mapStateToProps = (state) => ({
  loading: getGlobalTemplatesLoading(state),
  loadingPlan: getPlanLoading(state),
  globalTemplates: getGlobalTemplates(state),
  hasUpcomingEvents: getHasUpcomingEvents(state),
});

const mapDispatchToProps = {
  fetchGlobalTemplates: fetchGlobalTemplatesAction,
  resetGTPagination: resetGTPaginationAction,
};

GlobalTemplates.propTypes = {
  isMobile: PropTypes.bool,
  resetGTPagination: PropTypes.func,
  fetchGlobalTemplates: PropTypes.func,
};

export default withRouter(
  compose(
    withSizes(({ width }) => ({
      isMobile: width < 576,
    })),
    connect(mapStateToProps, mapDispatchToProps)
  )(GlobalTemplates)
);
