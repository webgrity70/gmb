import React, { useState, Fragment, useEffect } from 'react';
import { compose } from 'recompose';
import { withRouter } from 'react-router-dom';
import queryString from 'query-string';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Modal, Button } from 'semantic-ui-react';
import { TrackEvent } from '../../Services/TrackEvent';
import { getMyProfileId, isLocationCompleted } from '../../selectors/profile';
import './IncompleteProfile.scss';

const IncompleteProfile = ({ showIncomplete, query, location, push }) => {
  const [openModal, setOpenModal] = useState(showIncomplete);
  const [completed, setCompleted] = useState(false);
  useEffect(() => {
    if (!completed && query.section === 'completed') {
      setOpenModal(true);
      setCompleted(true);
      push(location.pathname);
    }
  });
  if (!showIncomplete && !completed && !openModal) return null;
  function onClickNextIncomplete() {
    setOpenModal(false);
    push(`${location.pathname}?section=location`);
  }
  function onClickNextComplete() {
    setOpenModal(false);
    setCompleted(false);
    TrackEvent('priprofile-olduser-completed');
  }
  function IncompleteDescription() {
    return (
      <Fragment>
        <p>
          To access all of GetMotivatedBuddies we just need you to update a few
          things on your profile.
        </p>
        <p className="text-center">Let’s go!</p>
        <div className="flex justify-end">
          <Button color="orange" onClick={onClickNextIncomplete}>
            Next
          </Button>
        </div>
      </Fragment>
    );
  }
  function CompleteDescription() {
    return (
      <Fragment>
        <p className="center">Congratulations! Enjoy the site!</p>
        <div className="flex justify-end">
          <Button color="orange" onClick={onClickNextComplete}>
            Next
          </Button>
        </div>
      </Fragment>
    );
  }
  return (
    <Modal
      open={openModal}
      dimmer="inverted"
      size="tiny"
      className="IncompleteProfile"
      closeOnDimmerClick={false}
    >
      <Modal.Header>
        <div className="flex justify-center">Welcome to the Beta!</div>
      </Modal.Header>
      <Modal.Content>
        <Modal.Description>
          {!completed ? <IncompleteDescription /> : <CompleteDescription />}
        </Modal.Description>
      </Modal.Content>
    </Modal>
  );
};

const mapStateToProps = (state, props) => {
  const myId = getMyProfileId(state);
  return {
    showIncomplete: !isLocationCompleted(state, { profileId: myId }),
    query: queryString.parse(props.history.location.search),
    push: props.history.push,
    location: props.history.location,
  };
};

IncompleteProfile.propTypes = {
  showIncomplete: PropTypes.bool,
  query: PropTypes.shape(),
  location: PropTypes.shape(),
  push: PropTypes.func,
};

export default compose(withRouter, connect(mapStateToProps))(IncompleteProfile);
