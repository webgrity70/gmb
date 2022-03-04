/* eslint-disable react/jsx-no-target-blank */
import React, { Fragment } from 'react';
import withSizes from 'react-sizes';
import PropTypes from 'prop-types';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { getGroupAdmins } from '../../../selectors/groups';
import { getGroupAdminsLoading } from '../../../selectors/requests';

function EmptyNoAdmin(isMobile) {
  if (isMobile) {
    return (
      <Fragment>
        <h2>Want to be an admin of this group?</h2>
        <h2>
          Click{' '}
          <a target="_blank" href="https://forms.gle/dMvFzoNNs3yLqdBW8">
            here.
          </a>
        </h2>
      </Fragment>
    );
  }
  return (
    <h2>
      Want to be an admin of this group? Click{' '}
      <a target="_blank" href="https://forms.gle/dMvFzoNNs3yLqdBW8">
        here.
      </a>
    </h2>
  );
}
const Empty = ({ admins, isMobile, loadingAdmins }) => {
  const LoadedContent =
    admins.length > 0 ? <h2>No new announcements.</h2> : EmptyNoAdmin(isMobile);
  return (
    <div className="EmptyAnnouncements">
      {loadingAdmins ? null : LoadedContent}
    </div>
  );
};
Empty.propTypes = {
  admins: PropTypes.bool,
  isMobile: PropTypes.bool,
  loadingAdmins: PropTypes.bool,
};

const mapStateToProps = (state) => ({
  loadingAdmins: getGroupAdminsLoading(state),
  admins: getGroupAdmins(state),
});

export default compose(
  withSizes(({ width }) => ({
    isMobile: width < 768,
  })),
  connect(mapStateToProps)
)(Empty);
