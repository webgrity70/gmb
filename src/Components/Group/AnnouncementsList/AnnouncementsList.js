/* eslint-disable react/no-array-index-key */
import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import InfiniteScroll from 'react-infinite-scroller';
import SingleAnnouncement from '../../Elements/SingleAnnouncement';
import Loading from '../../Loading';
import './AnnouncementsList.scss';

const AnnouncementsList = ({ announcements, getMore, hasMore }) => (
  <div className="AnnouncementsList">
    <InfiniteScroll
      pageStart={0}
      hasMore={hasMore}
      loadMore={getMore}
      loader={<Loading />}
      threshold={100}
      useWindow={false}
      getScrollParent={() =>
        document.getElementsByClassName('TabsContainer__body')[0]
      }
    >
      {announcements.map((announcement, index) => (
        <Fragment key={`${announcement.text}-${index}`}>
          <SingleAnnouncement {...announcement} />
          {index < announcements.length - 1 && (
            <div className="AnnouncementsList__separator" />
          )}
        </Fragment>
      ))}
    </InfiniteScroll>
  </div>
);

AnnouncementsList.propTypes = {
  getMore: PropTypes.func,
  hasMore: PropTypes.bool,
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

export default AnnouncementsList;
