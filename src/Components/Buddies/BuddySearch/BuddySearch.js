import React, { useContext, useEffect, Fragment } from 'react';
import PropTypes from 'prop-types';
import InfiniteScroll from 'react-infinite-scroller';
import { Button } from 'semantic-ui-react';
import FiltersContext from '../FiltersContext';
import BuddyResultsGrid from './BuddyResultsGrid';
import BuddyResultsList from './BuddyResultsList';
import Loading from '../../Loading';

import './BuddySearch.scss';

function BuddySearch({ profile, view }) {
  const filterContext = useContext(FiltersContext);
  const hasPlan = profile ? profile.has_plan : false;
  const isIOs =
    !!window.navigator.platform && /iPad|iPhone|iPod/.test(navigator.platform);
  useEffect(() => {
    if (isIOs) {
      filterContext.filterRecommendations();
    }
  }, []);
  function renderLists() {
    if (window.innerWidth >= 767 && view === 'list')
      return <BuddyResultsList />;
    if (window.innerWidth < 767 || view === 'grid') return <BuddyResultsGrid />;
    return null;
  }
  function renderInfinite() {
    return (
      <InfiniteScroll
        pageStart={0}
        loadMore={filterContext.filterRecommendations}
        hasMore={!filterContext.loading && filterContext.hasMore}
        loader={<Loading key={1} />}
        threshold={400}
      >
        {renderLists()}
      </InfiniteScroll>
    );
  }
  function renderNormal() {
    return (
      <Fragment>
        {renderLists()}
        {!filterContext.loading && filterContext.hasMore && (
          <div className="flex justify-center mt-8 mb-8 padded-container">
            <Button
              color="orange"
              onClick={filterContext.filterRecommendations}
            >
              Load more
            </Button>
          </div>
        )}
      </Fragment>
    );
  }
  function conditionalRender() {
    if (isIOs) return renderNormal();
    return renderInfinite();
  }
  return <div className="BuddySearch">{hasPlan && conditionalRender()}</div>;
}

BuddySearch.propTypes = {
  view: PropTypes.string,
  profile: PropTypes.shape({
    has_plan: PropTypes.bool,
  }),
};

export default BuddySearch;
