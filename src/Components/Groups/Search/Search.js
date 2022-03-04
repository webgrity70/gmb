/* eslint-disable react/button-has-type */
import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { Button } from 'semantic-ui-react';
import InfiniteScroll from 'react-infinite-scroller';
import Loading from '../../Loading';
import { fetchGroups as fetchGroupsAction } from '../../../Actions/actions_groups';
import {
  getNextPage,
  getPaginationFilters,
  getPaginationOrder,
  getPaginationSearch,
} from '../../../selectors/groups';
import ResultsList from './ResultsList';
import ResultsGrid from './ResultsGrid';

import './Search.scss';

function Search({ nextPage, filters, order, fetchGroups, view, q }) {
  const isIOs =
    !!window.navigator.platform && /iPad|iPhone|iPod/.test(navigator.platform);
  function getMore() {
    const params = { filters, order, q: q || undefined };
    fetchGroups(params, nextPage);
  }
  function renderLists() {
    if (window.innerWidth >= 767 && view === 'list') return <ResultsList />;
    if (window.innerWidth < 767 || view === 'grid') return <ResultsGrid />;
    return null;
  }
  function renderInfinite() {
    return (
      <InfiniteScroll
        pageStart={0}
        hasMore={!!nextPage}
        loadMore={getMore}
        loader={<Loading key={1} />}
        threshold={100}
      >
        {renderLists()}
      </InfiniteScroll>
    );
  }
  function renderNormal() {
    return (
      <Fragment>
        {renderLists()}
        {nextPage && (
          <div className="flex justify-center mt-8 mb-8 padded-container">
            <Button color="orange" onClick={getMore}>
              Load more
            </Button>
          </div>
        )}
      </Fragment>
    );
  }
  return (
    <div className="GroupsSearch">
      {isIOs ? renderNormal() : renderInfinite()}
    </div>
  );
}

const mapStateToProps = (state) => ({
  nextPage: getNextPage(state),
  filters: getPaginationFilters(state),
  q: getPaginationSearch(state),
  order: getPaginationOrder(state),
});

Search.propTypes = {
  nextPage: PropTypes.oneOfType([PropTypes.number, PropTypes.oneOf([null])]),
  fetchGroups: PropTypes.func,
  order: PropTypes.oneOfType([PropTypes.string, PropTypes.oneOf([null])]),
  view: PropTypes.string,
  q: PropTypes.string,
  filters: PropTypes.shape(),
};

export default compose(
  connect(mapStateToProps, { fetchGroups: fetchGroupsAction })
)(Search);
