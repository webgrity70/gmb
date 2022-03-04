import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import { Button, Modal } from 'semantic-ui-react';
import { connect } from 'react-redux';
import BEMHelper from 'react-bem-helper';
import OccupationForm, {
  OccupationFormContainer,
} from '../../ProfileForms/Occupation';
import { getOccupationOptionsSet } from '../../../selectors/profileFormOptions';
import './EditOccupationModal.scss';
import {
  getUserOccupations,
  getUserAboutData,
} from '../../../selectors/profile';

const bem = BEMHelper({
  name: 'ProfileEditOccupationModal',
  outputIsString: true,
});

function EditOccupationModalForm(props) {
  const { className, form, open, onClose } = props;

  function onSave() {
    form.handleSubmit();
  }

  function onCancel() {
    form.resetForm();
    onClose();
  }

  return (
    <Modal
      dimmer="inverted"
      closeIcon={{ name: 'close', color: 'grey' }}
      open={open}
      onClose={onClose}
      closeOnDimmerClick={false}
      className={cx(bem(), className)}
    >
      <Modal.Header className="text-center">Edit Occupation</Modal.Header>
      <Modal.Content scrolling>
        <Modal.Description>
          <OccupationForm form={form} />
        </Modal.Description>
      </Modal.Content>
      <Modal.Actions className="items-center">
        <div className="ml-auto pb-4 md:pb-0">
          <Button color="grey" basic onClick={onCancel}>
            Cancel
          </Button>
          <Button
            type="submit"
            color="orange"
            onClick={onSave}
            disabled={form.isSubmitting}
          >
            Save
          </Button>
        </div>
      </Modal.Actions>
    </Modal>
  );
}

EditOccupationModalForm.propTypes = {
  className: PropTypes.string,
  form: PropTypes.shape({}),
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
};

function EditOccupationModal({ initialValues, open, onClose, ...props }) {
  if (!open) {
    return null;
  }
  return (
    <OccupationFormContainer
      initialValues={initialValues}
      onSubmitSuccess={onClose}
    >
      {(form) => (
        <EditOccupationModalForm
          form={form}
          open={open}
          onClose={onClose}
          {...props}
        />
      )}
    </OccupationFormContainer>
  );
}

EditOccupationModal.propTypes = {
  initialValues: PropTypes.shape({}),
  open: PropTypes.bool,
  onClose: PropTypes.func,
};

const getOccupationValues = (state, props) => {
  const occupationOptionsSet = getOccupationOptionsSet(state);
  const occupations = getUserOccupations(state, props) || [];
  const about = getUserAboutData(state, props);
  if (occupationOptionsSet.size === 0) {
    return {};
  }

  const values = occupations.reduce(
    (acc, occupation) => {
      if (occupation === 'Student') {
        acc.student = true;
        acc.educationLevel = about.educationLevel;
        acc.currentSchoolYear = about.currentSchoolYear;
      } else if (occupationOptionsSet.has(occupation)) {
        acc.occupations[occupation] = true;
      } else {
        acc.otherActive = true;
        acc.other = occupation;
      }
      return acc;
    },
    { occupations: {} }
  );

  return values;
};

const mapStateToProps = (state, props) => ({
  initialValues: getOccupationValues(state, props),
});

const ConnectedEditOccupationModal = connect(
  mapStateToProps,
  {}
)(EditOccupationModal);

ConnectedEditOccupationModal.propTypes = {
  profileId: PropTypes.string.isRequired,
};

export default ConnectedEditOccupationModal;
