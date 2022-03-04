import React from 'react';
import PropTypes from 'prop-types';
import { compose } from 'redux';
import { Formik } from 'formik';
import { connect } from 'react-redux';
import {
  getUserGroupsData,
  getAreGroupsPrivate,
} from '../../../../selectors/profile';
import { updateUserGroups as updateUserGroupsAction } from '../../../../Actions/actions_profile';

function GroupsFormContainer(props) {
  const { children, groups, updateUserGroups, privacy, profileId } = props;
  return (
    <Formik
      initialValues={{ groups, privacy }}
      onSubmit={(values, { setSubmitting }) => {
        setSubmitting(false);
        const allNews = groups.filter((e) =>
          values.groups.some((i) => i.id === e.id)
        );
        const toRemove = groups.filter((e) =>
          values.groups.some((i) => i.id === e.id)
        );
        const newValues = { ...values, groups: toRemove };
        updateUserGroups(newValues, allNews, profileId);
      }}
    >
      {children}
    </Formik>
  );
}

GroupsFormContainer.propTypes = {
  groups: PropTypes.arrayOf(PropTypes.object),
  children: PropTypes.func,
  privacy: PropTypes.bool,
  profileId: PropTypes.string,
  updateUserGroups: PropTypes.func,
};

const mapStateToProps = (state, props) => ({
  groups: getUserGroupsData(state, props),
  privacy: !getAreGroupsPrivate(state, props),
});

const ConnectedGroupsFormContainer = compose(
  connect(mapStateToProps, { updateUserGroups: updateUserGroupsAction })
)(GroupsFormContainer);

ConnectedGroupsFormContainer.propTypes = {
  profileId: PropTypes.string,
};

export default ConnectedGroupsFormContainer;
