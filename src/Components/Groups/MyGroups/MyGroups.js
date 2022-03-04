import React, { useMemo, useEffect, useCallback, useState } from 'react';
import InfiniteScroll from 'react-infinite-scroller';
import { connect } from 'react-redux';
import cx from 'classnames';
import orderBy from 'lodash/orderBy';
import PropTypes from 'prop-types';
import { compose } from 'redux';
import withSizes from 'react-sizes';
import BEMHelper from 'react-bem-helper';
import ResultsList from './ResultsList';
import ResultsGrid from './ResultsGrid';
import {
  getMyGroupsData,
  getHasReachedMyGroupsPaginationEnd,
} from '../../../selectors/profile';
import { fetchMyGroups as fetchMyGroupsAction } from '../../../Actions/actions_profile';
import { getMyGroupsLoading } from '../../../selectors/requests';
import Loading from '../../Loading';
import './MyGroups.scss';

const bem = BEMHelper({ name: 'MyGroupsSection', outputIsString: true });

function handleField(field) {
  switch (field) {
    case 'member_count':
      return 'members';
    case 'timezone_distance':
      return 'timezoneOffset';
    default:
      return field;
  }
}

const MyGroups = ({
  isMobile,
  fetchMyGroups,
  groups,
  view,
  loading,
  hasReachedEnd,
}) => {
  const isLoading = loading && groups.length === 0;
  const [order, setOrder] = useState('member_count');
  const [direction, setDirection] = useState('descending');
  const ordererGroups = useMemo(() => {
    if (groups.length === 0) return [];
    const noFeatured = groups.filter(({ featured }) => !featured);
    const featureds = groups.filter(({ featured }) => featured);
    const dir = direction === 'ascending' ? 'asc' : 'desc';
    const orderableField = handleField(order);
    const orderer = orderBy(noFeatured, orderableField, dir);
    return [...featureds, ...orderer];
  }, [groups, order, direction]);

  useEffect(() => {
    fetchMyGroups({ pagination: false, pageSize: 100 });
  }, []);

  const onChangeOrder = useCallback(
    (e) => {
      setOrder(e);
      setDirection(direction === 'ascending' ? 'descending' : 'ascending');
    },
    [setOrder, setDirection, direction]
  );

  function loadMore() {
    fetchMyGroups({ usePagination: true, page_size: 100 });
  }
  function Items() {
    if (!isMobile && view === 'list') {
      return (
        <ResultsList
          groups={ordererGroups}
          order={order}
          className={cx(bem('list'), 'table-responsive')}
          changeGroupsOrder={onChangeOrder}
          direction={direction}
        />
      );
    }
    if (isMobile || view === 'grid') {
      return <ResultsGrid groups={ordererGroups} className={bem('grid')} />;
    }
    return null;
  }
  return (
    <div className={bem()}>
      {isLoading ? (
        <Loading />
      ) : (
        <div className={cx(bem('container', view))}>
          <InfiniteScroll
            pageStart={0}
            loadMore={loadMore}
            hasMore={!hasReachedEnd && !loading}
            useWindow={false}
            threshold={100}
          >
            <Items />
          </InfiniteScroll>
        </div>
      )}
    </div>
  );
};

MyGroups.propTypes = {
  isMobile: PropTypes.bool,
  loading: PropTypes.bool,
  hasReachedEnd: PropTypes.bool,
  groups: PropTypes.arrayOf(PropTypes.shape),
  fetchMyGroups: PropTypes.func,
  view: PropTypes.string,
};

const mapStateToProps = (state) => ({
  groups: getMyGroupsData(state),
  loading: getMyGroupsLoading(state),
  hasReachedEnd: getHasReachedMyGroupsPaginationEnd(state),
});

const mapDispatchToProps = {
  fetchMyGroups: fetchMyGroupsAction,
};

export default compose(
  connect(mapStateToProps, mapDispatchToProps),
  withSizes(({ width }) => ({
    isMobile: width < 768,
  }))
)(MyGroups);
