/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/anchor-is-valid */
import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { joinGroup as joinGroupAction } from '../../../Actions/actions_groups';
import './Empty.scss';

const EmptyMembers = ({ joinGroup, id }) => (
  <div className="EmptyMembers">
    <h1>Be the first to </h1>
    <a onClick={() => joinGroup(id)}>join </a>
    <h1>and</h1>
    <a>invite your buddies!</a>
  </div>
);

EmptyMembers.propTypes = {
  joinGroup: PropTypes.func,
  id: PropTypes.number,
};

const mapDispatchToProps = {
  joinGroup: joinGroupAction,
};

export default connect(null, mapDispatchToProps)(EmptyMembers);
