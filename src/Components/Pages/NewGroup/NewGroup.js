/* eslint-disable curly */
/* eslint-disable nonblock-statement-body-position */
/* eslint-disable prefer-destructuring */
import React, { Fragment } from 'react';
import { compose } from 'redux';
import { withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';
import { Button, Form } from 'semantic-ui-react';
import BEMHelper from 'react-bem-helper';
import { connect } from 'react-redux';
import './NewGroup.scss';
import {
  BasicOrganization,
  BasicPersonal,
  CardType,
  Categories,
  FormContainer,
} from '../../NewGroup';
import { types, privacy } from './utils';
import { isPosting } from '../../../selectors/groups';

const BASIC_TYPES = {
  SCHOOL: 'School',
  GYM: 'Gym',
};

const CATEGORIES = {
  LEARN: 'Learn',
  HEALTH: 'Health & Fitness',
};

const PRIVACY = {
  PUBLIC: 'Public',
};

const bem = BEMHelper({ name: 'NewGroup', outputIsString: true });

const ORGANIZATION_TYPE = types[0].value;

const NewGroup = ({ posting, history }) => (
  <div className={bem()}>
    <div className={bem('container')}>
      <h2>New Group</h2>
      <FormContainer>
        {(form) => {
          const defaultInfoProps = {
            website: form.values.website,
            name: form.values.name,
            description: form.values.description,
            languages: form.values.languages,
            onChangeName: (val) => form.setFieldValue('name', val),
            onChangeDescription: (val) =>
              form.setFieldValue('description', val),
            onChangeWebsite: (val) => form.setFieldValue('website', val),
            onChangeLanguages: (val) => form.setFieldValue('languages', val),
            onChangeLocation: (val) => form.setFieldValue('location', val),
          };
          const descriptionTouchedError =
            form.touched.description && !!form.errors.description;
          const descriptionSubmitError =
            form.submitCount > 0 && !!form.errors.description;
          const websiteTouchedError =
            form.touched.website && form.errors.website;
          const websiteSubmitError =
            form.submitCount > 0 && form.errors.website;
          const nameTouchedError = form.touched.name && !!form.errors.name;
          const nameSubmitError = form.submitCount > 0 && form.errors.name;
          const defaultErrors = {
            description: descriptionSubmitError || descriptionTouchedError,
            languages: form.submitCount > 0 && !!form.errors.languages,
            website: websiteSubmitError || websiteTouchedError,
          };
          function onChangeCategory(category) {
            const categories = form.values.categories;
            if (categories.includes(category)) {
              const avoidGym =
                form.values.type === BASIC_TYPES.GYM &&
                category === CATEGORIES.HEALTH;
              const avoidSchool =
                form.values.type === BASIC_TYPES.SCHOOL &&
                category === CATEGORIES.LEARN;
              if (!avoidGym && !avoidSchool)
                form.setFieldValue(
                  'categories',
                  categories.filter((c) => c !== category)
                );
            } else {
              form.setFieldValue('categories', [...categories, category]);
            }
          }
          function onChangeBlock(val) {
            const newType = val !== ORGANIZATION_TYPE ? 'Other' : null;
            form.setFieldValue('type', newType);
            form.setFieldValue('name', '');
            form.setFieldValue('location', null);
            form.setFieldValue('block', val);
          }
          function onChangePrivacy(val) {
            form.setFieldValue('privacy', val);
            if (val === PRIVACY.PUBLIC)
              form.setFieldValue('custom_requirements_message', null);
          }
          function onChangeType(val) {
            if (val === BASIC_TYPES.SCHOOL)
              form.setFieldValue('categories', ['Learn']);
            if (val === BASIC_TYPES.GYM)
              form.setFieldValue('categories', ['Health & Fitness']);
            form.setFieldValue('type', val);
          }
          return (
            <Fragment>
              <div className="flex">
                {types.map((p) => (
                  <CardType
                    key={p.value}
                    onClick={() => onChangeBlock(p.value)}
                    active={p.value === form.values.block}
                    {...p}
                  />
                ))}
              </div>
              <div className={bem('divider')} />
              <div>
                <h3 className={bem('subtitle')}>Basic Information</h3>
                {form.values.block === ORGANIZATION_TYPE ? (
                  <BasicOrganization
                    {...defaultInfoProps}
                    type={form.values.type}
                    errors={{
                      type: form.submitCount > 0 && !!form.errors.type,
                      ...defaultErrors,
                    }}
                    onChangeType={onChangeType}
                  />
                ) : (
                  <BasicPersonal
                    {...defaultInfoProps}
                    location={form.values.location}
                    errors={{
                      ...defaultErrors,
                      name: nameTouchedError || nameSubmitError,
                      location: form.submitCount > 0 && form.errors.location,
                    }}
                  />
                )}
                <div className={bem('categories')}>
                  <span>Categories:</span>
                  <Categories
                    currentCategories={form.values.categories}
                    onChange={onChangeCategory}
                    showError={form.submitCount > 0 && !!form.errors.categories}
                  />
                </div>
              </div>
              <div className={bem('divider')} />
              <h3 className={bem('subtitle')}>Group Access</h3>
              <div className={bem('PrivacyContainer')}>
                {privacy.map((type) => (
                  <CardType
                    key={type.value}
                    active={form.values.privacy === type.value}
                    showBorder={false}
                    showShadow={false}
                    onClick={() => onChangePrivacy(type.value)}
                    {...type}
                  />
                ))}
              </div>
              {form.values.privacy !== PRIVACY.PUBLIC && (
                <div className={bem('rules')}>
                  <Form.TextArea
                    rows={6}
                    value={form.values.custom_requirements_message}
                    placeholder="Access Rules/Requirements"
                    onChange={(e) =>
                      form.setFieldValue(
                        'custom_requirements_message',
                        e.target.value
                      )
                    }
                  />
                  <span>
                    This message will be shown to users when they request
                    joining the group.
                  </span>
                </div>
              )}
              <div className={bem('buttons')}>
                <Button
                  basic
                  onClick={() => history.goBack()}
                  disabled={posting}
                >
                  Cancel
                </Button>
                <Button
                  color="orange"
                  onClick={form.submitForm}
                  loading={posting}
                >
                  Create
                </Button>
              </div>
            </Fragment>
          );
        }}
      </FormContainer>
    </div>
  </div>
);

const mapStateToProps = (state) => ({
  posting: isPosting(state),
});

NewGroup.propTypes = {
  posting: PropTypes.bool,
  history: PropTypes.shape({}),
};

export default compose(withRouter, connect(mapStateToProps))(NewGroup);
