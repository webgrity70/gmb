/* eslint-disable camelcase */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { Fragment, useEffect, useState } from 'react';
import moment from 'moment';
import PropTypes from 'prop-types';
import { Icon, Button } from 'semantic-ui-react';
import usePrevious from '../../../utils/usePrevious';
import Avatar from '../Avatar';
import NewAnnouncement from '../../Group/NewAnnouncement';

import './SingleMainAnnouncement.scss';

const SingleMainAnnouncement = ({
  onShowPrevious,
  announcement,
  onCreate,
  canEdit,
  posting,
  canShowPrevious,
}) => {
  const [showAddNew, setShowAddNew] = useState(false);
  const showActions = canShowPrevious || canEdit;
  const shouldShowActions = showActions && !showAddNew;
  const prevPosting = usePrevious(posting);
  useEffect(() => {
    if (!posting && prevPosting) setShowAddNew(false);
  });
  return (
    <div className="SingleMainAnnouncement">
      {announcement && !showAddNew && (
        <Fragment>
          <div className="SingleMainAnnouncement__details">
            <div className="SingleMainAnnouncement__details-icon">
              <Avatar
                avatar={announcement.user.avatar}
                id={announcement.user.id}
              />
            </div>
            <div className="SingleMainAnnouncement__details-text">
              <span>
                {moment(announcement.created_at).format('ddd D, MMM')}
              </span>
              <h2>{announcement.user.name}</h2>
            </div>
          </div>
          <div className="SingleMainAnnouncement__description">
            <p>{announcement.text}</p>
          </div>
        </Fragment>
      )}
      {showAddNew && (
        <NewAnnouncement
          onCreate={onCreate}
          posting={posting}
          onCancel={() => setShowAddNew(false)}
        />
      )}
      {shouldShowActions && (
        <div className="SingleMainAnnouncement__actions">
          {canShowPrevious && (
            <div className="SingleMainAnnouncement__link">
              <a onClick={onShowPrevious}>show previous</a>
              <Icon name="chevron down" size="tiny" />
            </div>
          )}
          {canEdit && (
            <Button
              color="orange"
              className="SingleMainAnnouncement__add"
              onClick={() => setShowAddNew(true)}
            >
              Add new
            </Button>
          )}
        </div>
      )}
    </div>
  );
};

SingleMainAnnouncement.propTypes = {
  onShowPrevious: PropTypes.func,
  onCreate: PropTypes.func,
  canEdit: PropTypes.bool,
  posting: PropTypes.bool,
  canShowPrevious: PropTypes.bool,
  announcement: PropTypes.shape({
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
  }),
};

export default SingleMainAnnouncement;
