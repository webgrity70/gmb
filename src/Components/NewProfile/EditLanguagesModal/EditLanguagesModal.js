import React, { useMemo, useEffect } from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import { Button, Modal } from 'semantic-ui-react';
import { connect } from 'react-redux';
import BEMHelper from 'react-bem-helper';
import LanguagesForm, {
  LanguagesFormContainer,
} from '../../ProfileForms/Languages';
import { getUserLanguages } from '../../../selectors/profile';
import './EditLanguagesModal.scss';
import usePrevious from '../../../utils/usePrevious';
import Helpers from '../../Utils/Helpers';

const bem = BEMHelper({
  name: 'ProfileEditLanguagesModal',
  outputIsString: true,
});

function EditLanguagesModalForm(props) {
  const { className, open, onClose, form, blockClose } = props;

  function onCloseModal() {
    form.resetForm();
    onClose();
  }

  const prevIsSubmitting = usePrevious(form.isSubmitting);

  useEffect(() => {
    if (prevIsSubmitting && !form.isSubmitting) {
      if (form.errors.languages) {
        Helpers.createToast({
          status: 'error',
          message: 'Add your language and fluency.',
        });
      }
    }
  }, [form.errors, prevIsSubmitting, form.isSubmitting]);

  return (
    <Modal
      dimmer="inverted"
      open={open}
      onClose={onCloseModal}
      className={cx(bem(), className)}
      {...(!blockClose && { closeIcon: { name: 'close', color: 'grey' } })}
      {...(blockClose && {
        closeOnDimmerClick: false,
        closeOnDocumentClick: false,
      })}
    >
      <Modal.Header className="text-center">Edit Languages</Modal.Header>
      <Modal.Content scrolling>
        <Modal.Description>
          <LanguagesForm form={form} />
        </Modal.Description>
      </Modal.Content>
      <Modal.Actions className="justify-end">
        <Button
          type="submit"
          color="orange"
          onClick={form.handleSubmit}
          disabled={form.isSubmitting}
        >
          Save
        </Button>
      </Modal.Actions>
    </Modal>
  );
}

EditLanguagesModalForm.propTypes = {
  className: PropTypes.string,
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  form: PropTypes.shape(),
  blockClose: PropTypes.oneOfType([PropTypes.bool, PropTypes.oneOf([null])]),
};

function EditLanguagesModal({ open, currentLanguages, onClose, ...props }) {
  const initialValues = useMemo(
    () => ({
      languages: currentLanguages,
    }),
    [currentLanguages]
  );

  if (!open) {
    return null;
  }

  return (
    <LanguagesFormContainer
      initialValues={initialValues}
      onSubmitSuccess={onClose}
    >
      {(form) => (
        <EditLanguagesModalForm
          form={form}
          open={open}
          onClose={onClose}
          {...props}
        />
      )}
    </LanguagesFormContainer>
  );
}

EditLanguagesModal.propTypes = {
  currentLanguages: PropTypes.arrayOf(PropTypes.shape({})),
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
};

const mapStateToProps = (state, props) => ({
  currentLanguages: getUserLanguages(state, props) || [],
});

const ConnectedEditLanguagesModal = connect(mapStateToProps, {
  onUpdateUser: () => {},
})(EditLanguagesModal);

ConnectedEditLanguagesModal.propTypes = {
  profileId: PropTypes.string.isRequired,
};

export default ConnectedEditLanguagesModal;
