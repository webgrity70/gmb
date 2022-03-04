import React, { useState, Fragment } from 'react';
import isEmpty from 'lodash/isEmpty';
import { Modal, Button } from 'semantic-ui-react';
import { withRouter } from 'react-router-dom';
import { compose } from 'recompose';
import queryString from 'query-string';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import AboutModuleEdit from '../Edit';
import AboutFormContainer from '../Edit/AboutFormContainer';

function AboutModuleCard(props) {
  const { query, push, location, profileId } = props;
  const [openModal, setOpenModal] = useState(true);
  const blockSection = query && query.section === 'about';
  function onSubmitSuccess() {
    setOpenModal(false);
    if (blockSection) push(`${location.pathname}?section=completed`);
  }
  return (
    <Modal open={openModal} dimmer="inverted" closeOnDimmerClick={false}>
      <AboutFormContainer
        profileId={profileId}
        onSubmitSuccess={() => onSubmitSuccess()}
      >
        {(form) => (
          <Fragment>
            <Modal.Header className="text-center">
              Complete your information
            </Modal.Header>
            <Modal.Content scrolling>
              <AboutModuleEdit profileId={profileId} form={form} />
            </Modal.Content>
            <Modal.Actions className="items-center">
              <div className="ml-auto pb-4 md:pb-0">
                <Button
                  type="submit"
                  color="orange"
                  disabled={!isEmpty(form.errors) || form.isSubmitting}
                  onClick={form.handleSubmit}
                >
                  Save
                </Button>
              </div>
            </Modal.Actions>
          </Fragment>
        )}
      </AboutFormContainer>
    </Modal>
  );
}

AboutModuleCard.propTypes = {
  profileId: PropTypes.string,
  query: PropTypes.shape({}),
  location: PropTypes.shape({}),
  push: PropTypes.func,
};

const mapStateToProps = (state, props) => ({
  query: queryString.parse(state.router.location.search),
  push: props.history.push,
  location: props.history.location,
});

export default compose(withRouter, connect(mapStateToProps))(AboutModuleCard);
