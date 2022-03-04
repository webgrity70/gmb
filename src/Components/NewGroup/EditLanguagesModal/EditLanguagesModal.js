import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import * as Yup from 'yup';
import { Button, Modal } from 'semantic-ui-react';
import BEMHelper from 'react-bem-helper';
import LanguagesForm from '../../ProfileForms/Languages';
import LanguagesFormContainer from './LanguagesFormContainer';
import './EditLanguagesModal.scss';

const bem = BEMHelper({
  name: 'NewGroupEditLanguagesModal',
  outputIsString: true,
});

function EditLanguagesModalForm(props) {
  const { className, open, onClose, form, subTitle } = props;

  function onCloseModal() {
    form.resetForm();
    onClose();
  }
  return (
    <Modal
      dimmer="inverted"
      closeIcon={{ name: 'close', color: 'grey' }}
      open={open}
      onClose={onCloseModal}
      closeOnDimmerClick={false}
      className={cx(bem(), className)}
    >
      <Modal.Header className="text-center">Edit Languages</Modal.Header>
      <Modal.Content>
        <Modal.Description>
          <LanguagesForm
            form={form}
            subTitle={subTitle}
            requireProficiency={false}
            ValidationSchema={Yup.object().shape({
              language: Yup.string().required('Required'),
            })}
          />
        </Modal.Description>
      </Modal.Content>
      <Modal.Actions className="justify-end">
        <Button
          type="submit"
          color="orange"
          onClick={form.handleSubmit}
          disabled={!form.isValid || form.isSubmitting}
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
  subTitle: PropTypes.string,
  form: PropTypes.shape(),
};

EditLanguagesModalForm.defaultProps = {
  subTitle: 'Group Languages',
};

function EditLanguagesModal({
  open,
  currentLanguages,
  onClose,
  onSubmit,
  ...props
}) {
  const initialValues = useMemo(
    () => ({
      languages: currentLanguages,
    }),
    [currentLanguages]
  );
  function onSubmitSuccess(values) {
    onSubmit(values);
    onClose();
  }
  if (!open) {
    return null;
  }

  return (
    <LanguagesFormContainer
      initialValues={initialValues}
      onSubmit={onSubmitSuccess}
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
  onSubmit: PropTypes.func.isRequired,
};

export default EditLanguagesModal;
