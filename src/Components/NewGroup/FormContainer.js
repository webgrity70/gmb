import React from 'react';
import get from 'lodash/get';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';

import { Formik } from 'formik';
import { connect } from 'react-redux';
import * as Yup from 'yup';
import omit from 'lodash/omit';
import pickBy from 'lodash/pickBy';
import identity from 'lodash/identity';
import { toast } from 'react-toastify';
import { TrackEvent } from '../../Services/TrackEvent';
import { types } from '../Pages/NewGroup/utils';
import { createGroup as createGroupAction } from '../../Actions/actions_groups';

const BLOCKS = {
  ORGANIZATION: 'organization',
  PERSONAL: 'personal',
};

const ValidationSchema = Yup.object().shape(
  {
    type: Yup.string().min(3).required('Required'),
    description: Yup.string().trim().min(1).required('Required'),
    privacy: Yup.string().min(4).required('Required'),
    languages: Yup.array()
      .of(
        Yup.object().shape({
          label: Yup.string(),
          proficiency: Yup.string(),
          value: Yup.string(),
        })
      )
      .min(1)
      .required('Required'),
    categories: Yup.array().of(Yup.string()).min(1).required('Required'),
    website: Yup.string()
      .matches(
        /^(?:(?:https?|ftp):\/\/)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,})))(?::\d{2,5})?(?:\/\S*)?$/,
        'The URL provided is not valid.'
      )
      .when('location', (loc, passSchema, { parent }) => {
        const isOrg = parent.block && parent.block === BLOCKS.ORGANIZATION;
        if (isOrg && !get(loc, 'placeId'))
          return passSchema.required('Required');
        return passSchema;
      }),
    name: Yup.string().when('location', (loc, passSchema, { parent }) => {
      const isPersonal = parent.block && parent.block === BLOCKS.PERSONAL;
      if (!loc || isPersonal) return passSchema.min(1).required('Required');
      return passSchema;
    }),
    location: Yup.object()
      .shape({
        placeId: Yup.string(),
        formattedAddress: Yup.string(),
      })
      .when('name', (name, passSchema) => {
        if (!name) return passSchema.required('Required');
        return passSchema.nullable();
      }),
  },
  ['name', 'location', 'location']
);

const FormContainer = ({ children, history, createGroup }) => (
  <Formik
    enableReinitialize
    validationSchema={ValidationSchema}
    initialValues={{
      block: types[0].value,
      categories: [],
      privacy: 'Public',
      name: '',
      description: '',
      website: '',
    }}
    onSubmit={async (values, { setSubmitting }) => {
      try {
        const formattedValues = {
          ...omit(values, 'block', 'categories'),
          languages: values.languages.map(({ value }) => value),
          category: values.categories,
          ...(values.location && { location: values.location.placeId }),
        };
        const result = pickBy(formattedValues, identity);
        const res = await createGroup(result);
        if (res.status !== 'error') {
          toast.success(res.message);
          TrackEvent('groups-created-group');
          history.push(`/groups/${res.details.group.id}`);
        } else {
          const msg = `${res.message} ${res.details.non_field_errors.join('')}`;
          toast.error(msg);
        }
        setSubmitting(false);
      } catch (e) {
        toast.error('Something was wrong');
        setSubmitting(false);
      }
    }}
  >
    {children}
  </Formik>
);

FormContainer.propTypes = {
  children: PropTypes.func,
  createGroup: PropTypes.func,
  history: PropTypes.shape({}),
};

const ConnectedForm = connect(null, { createGroup: createGroupAction })(
  FormContainer
);

export default withRouter(ConnectedForm);
