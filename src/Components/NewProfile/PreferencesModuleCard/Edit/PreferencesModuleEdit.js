import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import BEMHelper from 'react-bem-helper';
import { Modal, Button } from 'semantic-ui-react';
import { connect } from 'react-redux';
import BuddyPreferences, {
  BuddyPreferencesFormContainer,
} from '../../../ProfileForms/BuddyPreferences';
import usePrevious from '../../../../utils/usePrevious';
import Helpers from '../../../Utils/Helpers';

import './PreferencesModuleEdit.scss';
import { getUserPreferences } from '../../../../selectors/profile';

const bem = BEMHelper({
  name: 'ProfilePreferencesModuleEdit',
  outputIsString: true,
});

function Form({ form, blockClose, closeModal }) {
  const { handleSubmit, resetForm, isSubmitting, errors } = form;
  const prevIsSubmitting = usePrevious(isSubmitting);

  useEffect(() => {
    if (prevIsSubmitting && !isSubmitting) {
      if (errors.buddySex || errors.customBuddySex) {
        Helpers.createToast({
          status: 'error',
          message: 'Gender field is invalid.',
        });
      } else if (errors.meetingPreference) {
        Helpers.createToast({
          status: 'error',
          message: 'Meeting preference is invalid.',
        });
      }
    }
  }, [errors, prevIsSubmitting, isSubmitting]);

  function onCancel() {
    closeModal();
    resetForm();
  }

  return (
    <>
      <Modal.Header className="text-center">
        Edit Buddy Preferences
      </Modal.Header>
      <Modal.Content scrolling>
        <div className={bem('content')}>
          <BuddyPreferences form={form} />
        </div>
      </Modal.Content>
      <Modal.Actions className="items-center">
        <div className="ml-auto pb-4 md:pb-0">
          {!blockClose && (
            <Button color="grey" basic onClick={onCancel}>
              Cancel
            </Button>
          )}
          <Button
            type="submit"
            color="orange"
            onClick={handleSubmit}
            disabled={form.isSubmitting}
          >
            Save
          </Button>
        </div>
      </Modal.Actions>
    </>
  );
}

Form.propTypes = {
  closeModal: PropTypes.func,
  blockClose: PropTypes.oneOfType([PropTypes.bool, PropTypes.oneOf([null])]),
  form: PropTypes.shape({}),
};

const PreferencesModuleEdit = ({
  blockClose,
  profileId,
  closeModal,
  initialValues,
}) => (
  <BuddyPreferencesFormContainer
    profileId={profileId}
    initialValues={initialValues}
    onSubmitSuccess={closeModal}
  >
    {(form) => (
      <Form form={form} blockClose={blockClose} closeModal={closeModal} />
    )}
  </BuddyPreferencesFormContainer>
);

PreferencesModuleEdit.propTypes = {
  profileId: PropTypes.string,
  closeModal: PropTypes.func,
  blockClose: PropTypes.oneOfType([PropTypes.bool, PropTypes.oneOf([null])]),
  initialValues: PropTypes.shape({}).isRequired,
};

const mapStateToProps = (state, props) => {
  const preferences = getUserPreferences(state, props) || {};
  return {
    initialValues: {
      buddySex: preferences.buddySex,
      buddyTimezone: preferences.buddyTimezone,
      buddyAge: preferences.buddyAge,
      buddyRadius: preferences.buddyRadius,
      meetingPreference: preferences.meetingPreference,
    },
  };
};

const ConnectedPreferencesModuleEdit = connect(
  mapStateToProps,
  {}
)(PreferencesModuleEdit);

ConnectedPreferencesModuleEdit.propTypes = {
  profileId: PropTypes.string,
  closeModal: PropTypes.func,
};

export default ConnectedPreferencesModuleEdit;
