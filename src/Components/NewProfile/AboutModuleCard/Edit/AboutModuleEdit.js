import React from 'react';
import PropTypes from 'prop-types';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { Grid, Form } from 'semantic-ui-react';
import cx from 'classnames';
import BEMHelper from 'react-bem-helper';
import OccupationInfo from '../OccupationInfo';

import './AboutModuleEdit.scss';

const bem = BEMHelper({ name: 'ProfileAboutModuleEdit', outputIsString: true });

function AboutModuleEdit(props) {
  const { className, profileId, form } = props;
  return (
    <div className={cx(bem(), className)}>
      <Form>
        <Grid columns={2} stackable>
          <Grid.Column>
            <Form.Field className={bem('about')}>
              <Form.TextArea
                rows={5}
                label="About you"
                placeholder="Min. 30 characters. Be open, honest and specific. :)"
                value={form.values.about}
                onChange={(e) => form.setFieldValue('about', e.target.value)}
                {...(form.errors.about && { className: bem('field-error') })}
              />
              <div className="flex justify-between">
                <span>
                  {form.values.about && form.values.about.length < 30
                    ? 'Minimum character count 30.'
                    : ''}
                </span>
                <span
                  className={
                    form.values.about &&
                    form.values.about.length >= 30 &&
                    form.values.about.length <= 2000
                      ? 'green'
                      : 'red'
                  }
                >
                  {form.values.about ? form.values.about.length : 0} / 2000
                </span>
              </div>
            </Form.Field>
            <OccupationInfo
              profileId={profileId}
              {...(form.errors.occupation && { className: bem('field-error') })}
            />
          </Grid.Column>
          <Grid.Column>
            <Form.TextArea
              rows={3}
              label="Strength"
              placeholder="Strength..."
              value={form.values.strength}
              onChange={(e) => form.setFieldValue('strength', e.target.value)}
              {...(form.errors.strength && { className: bem('field-error') })}
            />
            <Form.TextArea
              rows={3}
              label="Weakness"
              placeholder="Weakness..."
              value={form.values.weakness}
              onChange={(e) => form.setFieldValue('weakness', e.target.value)}
              {...(form.errors.weakness && { className: bem('field-error') })}
            />
            <Form.TextArea
              rows={1}
              label="Favorite Food"
              placeholder="Favorite Food..."
              value={form.values.favoriteFood}
              onChange={(e) =>
                form.setFieldValue('favoriteFood', e.target.value)
              }
              {...(form.errors.favoriteFood && {
                className: bem('field-error'),
              })}
            />
          </Grid.Column>
        </Grid>
      </Form>
    </div>
  );
}

AboutModuleEdit.propTypes = {
  className: PropTypes.string,
  profileId: PropTypes.string,
  form: PropTypes.shape({
    values: PropTypes.shape({}),
    setFieldValue: PropTypes.func,
  }),
};

const mapStateToProps = () => ({});

const ConnectedAboutModuleEdit = compose(connect(mapStateToProps, {}))(
  AboutModuleEdit
);

ConnectedAboutModuleEdit.propTypes = {
  profileId: PropTypes.string,
};

export default ConnectedAboutModuleEdit;
