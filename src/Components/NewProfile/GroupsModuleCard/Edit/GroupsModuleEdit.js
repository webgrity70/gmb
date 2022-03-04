/* eslint-disable react/no-unused-prop-types */
import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { compose } from 'redux';
import BEMHelper from 'react-bem-helper';
import { Modal, Radio, Button } from 'semantic-ui-react';
import { connect } from 'react-redux';
import GroupsFormContainer from './GroupsFormContainer';
import ListItems from '../../../Elements/ListItems';

import './GroupsModuleEdit.scss';

export const baseClass = 'GroupsEdit';
const bem = BEMHelper({ name: baseClass, outputIsString: true });

const GroupsModuleEdit = ({ closeModal, profileId }) => (
  <GroupsFormContainer profileId={profileId}>
    {(form) => {
      const { values, setFieldValue, submitForm } = form;
      function changeGroupsValue({ id: selectedGroupId }) {
        const newsGroups = values.groups.filter(
          ({ id: groupId }) => groupId !== selectedGroupId
        );
        return setFieldValue('groups', newsGroups);
      }
      function onChangePrivacy() {
        setFieldValue('privacy', !values.privacy);
      }
      async function onSubmit() {
        await submitForm(values);
        closeModal();
      }
      return (
        <Fragment>
          <Modal.Header className="text-center">Edit Groups</Modal.Header>
          <Modal.Content scrolling>
            <div className={bem('content')}>
              <ListItems
                items={values.groups}
                onRemove={changeGroupsValue}
                type="groups"
              />
            </div>
          </Modal.Content>
          <Modal.Actions>
            <div className={bem('toggle-container')}>
              <Radio
                toggle
                checked={!values.privacy}
                onChange={onChangePrivacy}
              />
              <span>Private</span>
            </div>
            <div className="ml-auto flex flex-wrap justify-center">
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
  </GroupsFormContainer>
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
