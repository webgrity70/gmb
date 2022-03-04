import React from 'react';
import _ from 'lodash';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { getMyProfileId } from '../../../selectors/profile';

const Expired = ({ thread, myId }) => {
  const buddy =
    myId === thread.participantA.id ? thread.participantB : thread.participantA;
  return (
    <div className="expired">
      <p className="title"> Your 72 hours are up! </p>
      <p className="description">
        Do you want to Buddy up with{' '}
        <Link to={`/profile/${buddy.id}`}>{buddy.name}</Link> in the{' '}
        <span>{_.get(thread, 'category.name')}</span> category?
      </p>
    </div>
  );
};

const mapStateToProps = (state) => ({
  myId: getMyProfileId(state),
});

export default connect(mapStateToProps)(Expired);
