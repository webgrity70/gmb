/* eslint-disable camelcase */
import React from 'react';
import moment from 'moment';
import PropTypes from 'prop-types';
import Avatar from '../Avatar';
import './SingleAnnouncement.scss';

const SingleAnnouncement = ({ created_at, text, user }) => (
  <div className="SingleAnnouncement">
    <div className="SingleAnnouncement__details">
      <div className="SingleAnnouncement__details-icon">
        <Avatar avatar={user.avatar} id={user.id} />
      </div>
      <div className="SingleAnnouncement__details-text">
        <h2>{user.name}</h2>
        <span>{moment(created_at).format('ddd D, MMM')}</span>
      </div>
    </div>
    <div className="SingleAnnouncement__description">
      <p>{text}</p>
    </div>
  </div>
);

SingleAnnouncement.propTypes = {
  created_at: PropTypes.string,
  text: PropTypes.string,
  user: PropTypes.shape({
    id: PropTypes.number,
    name: PropTypes.string,
    avatar: PropTypes.shape({
      body: PropTypes.object,
      hair: PropTypes.object,
      mouth: PropTypes.object,
      eyes: PropTypes.object,
      body_color: PropTypes.string,
      hair_color: PropTypes.string,
    }),
  }),
};

export default SingleAnnouncement;
