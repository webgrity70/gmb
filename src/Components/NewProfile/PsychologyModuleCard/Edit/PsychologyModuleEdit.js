/* eslint-disable react/no-unused-prop-types */
import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { compose } from 'redux';
import BEMHelper from 'react-bem-helper';
import { Modal, Button } from 'semantic-ui-react';
import { connect } from 'react-redux';
import PsychologyFormContainer from './PsychologyFormContainer';
import Psychology from '../Info/PsychologyList';

import './PsychologyModuleEdit.scss';

export const baseClass = 'PsychologyEdit';
const bem = BEMHelper({ name: baseClass, outputIsString: true });

const GroupsModuleEdit = ({ closeModal, profileId }) => (
  <PsychologyFormContainer profileId={profileId}>
    {(form) => {
      const { values, setFieldValue, submitForm } = form;
      function changeValue(value, { identifier }) {
        const newsPsychology = values.psychology.map((e) => ({
          ...e,
          value: e.identifier === identifier ? value : e.value,
        }));
        return setFieldValue('psychology', newsPsychology);
      }
      async function onSubmit() {
        await submitForm(values);
        closeModal();
      }
      return (
        <Fragment>
          <Modal.Header className="text-center">Edit Psychology</Modal.Header>
          <Modal.Content scrolling>
            <div className={bem('content')}>
              <Psychology items={values.psychology} onRemove={changeValue} />
            </div>
          </Modal.Content>
          <Modal.Actions className="items-center">
            <div className="ml-auto">
              <Button color="grey" basic onClick={closeModal}>
                Cancel
              </Button>
              <Button
                type="submit"
                color="orange"
                onClick={onSubmit}
                disabled={form.isSubmitting}
              >
                Save
              </Button>
            </div>
          </Modal.Actions>
        </Fragment>
      );
    }}
  </PsychologyFormContainer>
);

GroupsModuleEdit.propTypes = {
  profileId: PropTypes.string,
  closeModal: PropTypes.func,
  form: PropTypes.shape({
    values: PropTypes.shape({}),
    setFieldValue: PropTypes.func,
  }),
};

const mapStateToProps = () => ({});

const ConnectedGroupsModuleEdit = ({ closeModal, profileId }) => {
  const Comp = compose(connect(mapStateToProps, {}))(GroupsModuleEdit);
  return <Comp closeModal={closeModal} profileId={profileId} />;
};

ConnectedGroupsModuleEdit.propTypes = {
  profileId: PropTypes.string,
  closeModal: PropTypes.func,
};

export default ConnectedGroupsModuleEdit;
