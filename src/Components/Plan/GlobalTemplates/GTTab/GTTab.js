/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */
import React, { useMemo, useState, useEffect, useCallback } from 'react';
import withSizes from 'react-sizes';
import InfiniteScroll from 'react-infinite-scroller';
import PropTypes from 'prop-types';
import BEMHelper from 'react-bem-helper';
import { connect } from 'react-redux';
import { Grid, Input, Icon } from 'semantic-ui-react';
import debounce from 'lodash/debounce';
import InputRange from 'react-input-range';
import useActionOnCondition from '../../../../hooks/use-action-on-condition';
import {
  getGlobalTemplates,
  getAllCategories,
  getGTPaginationNextUrl,
  getGTPaginationInput,
  getGTPaginationFilters,
} from '../../../../selectors/plans';
import { GlobalTemplateCard } from '../../TemplateCard';
import { getFeaturedIcon } from '../utils';
import { fetchCategories as fetchCategoriesAction } from '../../../../Actions/actions_groups';
import CategoriesIcons from '../../../Elements/CategoriesIcons';
import {
  fetchGlobalTemplates as fetchGlobalTemplatesAction,
  changeGTSearch as changeGTSearchAction,
  changeGTFilter as changeGTFilterAction,
} from '../../../../Actions/actions_plan';
import { getGlobalTemplatesLoading } from '../../../../selectors/requests';
import Loading from '../../../Loading';
import FiltersModal from '../FiltersModals/FiltersModal';
import './GTTab.scss';

const bem = BEMHelper({ name: 'GTTab', outputIsString: true });

const GTTab = ({
  filters,
  isMobile,
  search,
  loading,
  nextUrl,
  categories,
  changeGTFilter,
  onCloseModal,
  changeGTSearch,
  fetchCategories,
  globalTemplates,
  fetchGlobalTemplates,
  isChallenge,
}) => {
  useActionOnCondition(() => fetchCategories(true), categories.length === 0);
  useActionOnCondition(fetchGlobalTemplates, globalTemplates.length === 0);

  const memoCategories = useMemo(
    () =>
      categories.map((category) => ({
        category,
        active:
          filters.categories && filters.categories.includes(category.name),
      })),
    [categories, filters]
  );
  const [val, setVal] = useState(search || '');
  const [openFiltersModal, setOpenFiltersModal] = useState(false);
  const onCloseFiltersModal = useCallback(
    (fetch) => {
      if (fetch) fetchGlobalTemplates();
      setOpenFiltersModal(false);
    },
    [fetchGlobalTemplates, setOpenFiltersModal]
  );
  const searchDebounced = useMemo(() => debounce(changeGTSearch, 700), [
    changeGTSearch,
  ]);
  function onChangeValue({ target: { value } }) {
    setVal(value);
    searchDebounced(value);
  }
  const [_weeksMin, setMinWeek] = useState(filters.weeksMin || 0);
  const [_weeksMax, setMaxWeek] = useState(filters.weeksMax || 12);
  const changeWeeksDebounced = useMemo(() => debounce(changeGTFilter, 700), [
    changeGTFilter,
  ]);
  function onChangeWeeks({ min: weeksMin, max: weeksMax }) {
    setMinWeek(weeksMin);
    setMaxWeek(weeksMax);
    changeWeeksDebounced({ weeksMin, weeksMax });
  }
  function onChangeCategory({ category }) {
    changeGTFilter({ categories: [category.name] });
  }
  function onChangeFeatured() {
    const falseEval = filters.featured === true ? false : undefined;
    const currentValue = filters.featured === undefined ? true : falseEval;
    changeGTFilter({ featured: currentValue });
  }
  function loadMore() {
    fetchGlobalTemplates();
  }
  function renderFilters() {
    if (!isMobile) {
      return (
        <div className={bem('options')}>
          <div className="flex items-center flex-col md:flex-row">
            <Input
              value={val}
              icon="search"
              spellCheck="false"
              autoCorrect="false"
              autoComplete="false"
              autoCapitalize="false"
              onChange={onChangeValue}
              className="flex-1 md:mr-8 mb-4 md:mb-0"
              placeholder="Find your plan"
            />
            <div className={bem('categories')}>
              <CategoriesIcons
                categories={memoCategories}
                onClick={onChangeCategory}
              />
            </div>
          </div>
          <div className="flex mt-4 justify-between flex-col md:flex-row">
            <div className={bem('range-field')}>
              <span>
                DURATION: {filters.weeksMin || 0} - {filters.weeksMax || 12}{' '}
                WEEKS
              </span>
              <InputRange
                maxValue={12}
                minValue={0}
                step={1}
                value={{ min: _weeksMin, max: _weeksMax }}
                onChange={onChangeWeeks}
              />
            </div>
            <div
              className={bem('featured', {
                active: filters.featured === undefined || filters.featured,
              })}
              onClick={onChangeFeatured}
            >
              <Icon name={getFeaturedIcon(filters.featured)} />
              <span>FEATURED</span>
            </div>
          </div>
        </div>
      );
    }
    return (
      <div className={bem('options-mobile')}>
        <Input
          value={val}
          icon="search"
          spellCheck="false"
          autoCorrect="false"
          autoComplete="false"
          autoCapitalize="false"
          onChange={onChangeValue}
          className="flex-1 md:mr-8 mb-4 mt-4 md:mt-0 md:mb-0"
          placeholder="Find your plan"
        />
        <Icon name="sliders" onClick={() => setOpenFiltersModal(true)} />
      </div>
    );
  }
  useEffect(() => {
    fetchGlobalTemplates();
  }, [filters, search]);
  return (
    <div>
      {renderFilters()}
      {loading && globalTemplates.length === 0 ? (
        <Loading />
      ) : (
        <div className={bem('templates')}>
          <InfiniteScroll
            pageStart={0}
            loadMore={loadMore}
            hasMore={!loading && !!nextUrl}
            threshold={50}
            useWindow={false}
            className="md:pr-3"
          >
            <Grid columns={2} padded stackable>
              {globalTemplates.map((templateId) => (
                <Grid.Column key={templateId}>
                  <GlobalTemplateCard
                    id={templateId}
                    onCloseInfo={onCloseModal}
                    isChallenge={isChallenge}
                  />
                </Grid.Column>
              ))}
            </Grid>
          </InfiniteScroll>
        </div>
      )}
      <FiltersModal
        onClose={onCloseFiltersModal}
        open={openFiltersModal}
        weeksMin={_weeksMin}
        featured={filters.featured}
        weeksMax={_weeksMax}
        categories={memoCategories}
        onChangeCategory={onChangeCategory}
        onChangeFeatured={onChangeFeatured}
        onChangeDuration={onChangeWeeks}
      />
    </div>
  );
};

const mapStateToProps = (state) => ({
  globalTemplates: getGlobalTemplates(state),
  categories: getAllCategories(state),
  filters: getGTPaginationFilters(state),
  search: getGTPaginationInput(state),
  nextUrl: getGTPaginationNextUrl(state),
  loading: getGlobalTemplatesLoading(state),
});

GTTab.propTypes = {
  filters: PropTypes.shape(),
  search: PropTypes.oneOfType([PropTypes.string, PropTypes.oneOf([null])]),
  loading: PropTypes.bool,
  fetchCategories: PropTypes.func,
  categories: PropTypes.arrayOf(PropTypes.shape()),
  changeGTFilter: PropTypes.func,
  changeGTSearch: PropTypes.func,
  fetchGlobalTemplates: PropTypes.func,
  isMobile: PropTypes.bool,
  nextUrl: PropTypes.oneOfType([PropTypes.string, PropTypes.oneOf([null])]),
  globalTemplates: PropTypes.arrayOf(PropTypes.number),
  onCloseModal: PropTypes.func,
  isChallenge: PropTypes.bool,
};

GTTab.defaultProps = {
  isChallenge: false,
};

const ConnectedGTTab = connect(mapStateToProps, {
  fetchGlobalTemplates: fetchGlobalTemplatesAction,
  fetchCategories: fetchCategoriesAction,
  changeGTSearch: changeGTSearchAction,
  changeGTFilter: changeGTFilterAction,
})(GTTab);

export default withSizes(({ width }) => ({
  isMobile: width < 768,
}))(ConnectedGTTab);
