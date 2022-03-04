/* eslint-disable react/no-unused-prop-types */
import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { compose } from 'redux';
import BEMHelper from 'react-bem-helper';
import { Modal, Label, Icon, Dropdown, Form, Button } from 'semantic-ui-react';
import { connect } from 'react-redux';
import { withApps } from '../../../HoCs';
import AppsFormContainer from './AppsFormContainer';

import './AppsModuleEdit.scss';

export const baseClass = 'AppsEdit';
const bem = BEMHelper({ name: baseClass, outputIsString: true });

const AppsModuleEdit = ({ allApps, profileId, closeModal }) => {
  const getAppOptions = (apps) =>
    allApps.filter((app) => !apps.some((ap) => ap.id === app.value));
  return (
    <AppsFormContainer profileId={profileId}>
      {(form) => {
        const { values, setFieldValue, submitForm } = form;
        function removeByIndex(index) {
          const apps = [...values.apps];
          apps.splice(index, 1);
          setFieldValue('apps', apps);
        }
        function onAddApp(e, { value, options }) {
          const matched = options.find((option) => option.value === value);
          if (matched) {
            const { text, iconurl: icon } = matched;
            setFieldValue('apps', [
              ...values.apps,
              { id: value, name: text, icon },
            ]);
            return;
          }
          setFieldValue('apps', [...values.apps, { name: value }]);
        }
        async function onSubmit() {
          await submitForm(values);
          closeModal();
        }
        return (
          <Fragment>
            <Modal.Header className="text-center">Edit Apps</Modal.Header>
            <Modal.Content scrolling>
              <div className={bem('content')}>
                <div className={bem('selected-section')}>
                  <div className="text-center">
                    {values.apps.length > 0 ? (
                      <>
                        {values.apps.map((app, index) => (
                          <Label
                            key={app.id || `app-${index}`}
                            color="orange"
                            className={bem('app')}
                          >
                            {app.name}
                            <Icon
                              name="close"
                              onClick={() => removeByIndex(index)}
                            />
                          </Label>
                        ))}
                      </>
                    ) : (
                      <p>No Apps selected</p>
                    )}
                  </div>
                </div>
                <Form className={bem('form', '', 'flex-center-all')}>
                  <Dropdown
                    search
                    name="language"
                    options={getAppOptions(values.apps)}
                    placeholder="Find your Apps"
                    onChange={onAddApp}
                    allowAdditions
                    selection
                    upward
                  />
                </Form>
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
    </AppsFormContainer>
  );
};

AppsModuleEdit.propTypes = {
  profileId: PropTypes.string,
  closeModal: PropTypes.func,
  allApps: PropTypes.arrayOf(
    PropTypes.shape({
      pk: PropTypes.number,
      name: PropTypes.string,
    })
  ),
  form: PropTypes.shape({
    values: PropTypes.shape({}),
    setFieldValue: PropTypes.func,
  }),
};

const mapStateToProps = () => ({});

const ConnectedAppsModuleEdit = ({ closeModal, profileId }) => {
  const Comp = compose(
    withApps({ skipLoading: true }),
    connect(mapStateToProps, {})
  )(AppsModuleEdit);
  return <Comp closeModal={closeModal} profileId={profileId} />;
};

ConnectedAppsModuleEdit.propTypes = {
  profileId: PropTypes.string,
  closeModal: PropTypes.func,
};

export default ConnectedAppsModuleEdit;
