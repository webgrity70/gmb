/* eslint-disable react/button-has-type */
import React, { Fragment, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { Button } from 'semantic-ui-react';
import InfiniteScroll from 'react-infinite-scroller';
import Loading from '../../Loading';
import { fetchChallenges as fetchChallengesAction } from '../../../Actions/actions_challenges';
import { getChallengesPaginationNextUrl } from '../../../selectors/challenges';
import { getChallengesLoading } from '../../../selectors/requests';
import ResultsList from '../ResultsList';
import ResultsGrid from '../ResultsGrid';
// import ResultsGrid from './ResultsGrid';
import isIos from '../../../utils/isIos';

import './RegularTable.scss';

function RegularTable({
  nextPage,
  loading,
  fetchChallenges,
  myChallenges = false,
}) {
  useEffect(() => {
    fetchChallenges();
  }, [fetchChallenges]);

  function getMore() {
    fetchChallenges();
  }

  const [mobileMode, setMobileMode] = useState(window.innerWidth < 767);

  useEffect(() => {
    const updateWindowDimensions = () => {
      setMobileMode(window.innerWidth < 767);
    };
    window.addEventListener('resize', updateWindowDimensions);

    return () => window.removeEventListener('resize', updateWindowDimensions);
  }, []);

  function renderLists() {
    if (!mobileMode) return <ResultsList myChallenges={myChallenges} />;
    if (mobileMode) return <ResultsGrid myChallenges={myChallenges} />;
    return null;
  }
  function renderInfinite() {
    return (
      <InfiniteScroll
        pageStart={0}
        hasMore={!!nextPage && !loading}
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
    <div className="RegularTable">
      {isIos ? renderNormal() : renderInfinite()}
    </div>
  );
}

const mapStateToProps = (state) => ({
  nextPage: getChallengesPaginationNextUrl(state),
  loading: getChallengesLoading(state),
});

RegularTable.propTypes = {
  loading: PropTypes.bool,
  fetchChallenges: PropTypes.func,
  nextPage: PropTypes.string,
};

export default compose(
  connect(mapStateToProps, { fetchChallenges: fetchChallengesAction })
)(RegularTable);
