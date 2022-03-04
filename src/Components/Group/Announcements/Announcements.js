import React, { useState, useEffect, Fragment } from 'react';
import PropTypes from 'prop-types';
import AnnouncementsList from '../AnnouncementsList';
import SingleMainAnnouncement from '../../Elements/SingleMainAnnouncement';
import usePrevious from '../../../utils/usePrevious';
import EmptyAnnouncement from './Empty';
import './Announcements.scss';

const Announcements = ({
  announcements,
  createAnnouncement,
  myId,
  groupId,
  posting,
  canEdit,
  nextPage,
  fetchAnnouncements,
}) => {
  const [showList, setShowList] = useState(false);
  const prevShowList = usePrevious(showList);
  const prevAnnouncements = usePrevious(announcements);
  const shouldShowMain = announcements.length > 0 || canEdit;
  const shouldShowEmpty = announcements.length === 0;
  function onCreateAnnouncement(text) {
    createAnnouncement({ text, user: myId, group: groupId });
  }
  function getMore() {
    fetchAnnouncements(groupId, nextPage);
  }

  useEffect(() => {
    if (
      showList &&
      prevShowList &&
      announcements.length === prevAnnouncements.length
    ) {
      setShowList(false);
    }
  });

  if (showList) {
    return (
      <AnnouncementsList
        announcements={announcements}
        getMore={getMore}
        hasMore={!!nextPage}
      />
    );
  }
  return (
    <Fragment>
      {shouldShowEmpty && <EmptyAnnouncement />}
      {shouldShowMain && (
        <SingleMainAnnouncement
          announcement={announcements[0]}
          onShowPrevious={() => setShowList(true)}
          onCreate={onCreateAnnouncement}
          canEdit={canEdit}
          posting={posting}
          canShowPrevious={announcements.length > 1}
        />
      )}
    </Fragment>
  );
};

Announcements.propTypes = {
  canEdit: PropTypes.bool,
  nextPage: PropTypes.oneOfType([PropTypes.number, PropTypes.oneOf([null])]),
  myId: PropTypes.number,
  groupId: PropTypes.number,
  fetchAnnouncements: PropTypes.func,
  posting: PropTypes.bool,
  createAnnouncement: PropTypes.func,
  announcements: PropTypes.arrayOf(
    PropTypes.shape({
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
    })
  ),
};

Announcements.defaultProps = {
  announcements: [],
};

export default Announcements;
