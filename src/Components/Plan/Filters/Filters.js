import React, { useCallback, useContext } from 'react';
import BEMHelper from 'react-bem-helper';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Popup, Icon } from 'semantic-ui-react';
import useActionOnCondition from '../../../hooks/use-action-on-condition';
import * as profileSelectors from '../../../selectors/profile';
import { fetchUserCategories as fetchUserCategoriesAction } from '../../../Actions/actions_profile';
import './Filters.scss';
import UserCategories from '../../Elements/UserCategories';
import PlanContext from '../PlanContext';

const bem = BEMHelper({ name: 'PlanFilters', outputIsString: true });

const Filters = ({
  fetchCategories,
  currentCategories,
  isCategoriesLoaded,
  onChangeActive,
  inactiveCategories,
  profileId,
}) => {
  const fetchCategoriesCb = useCallback(() => fetchCategories(profileId), [
    fetchCategories,
    profileId,
  ]);
  useActionOnCondition(fetchCategoriesCb, !isCategoriesLoaded);
  return (
    <div>
      <span>Filter what you see</span>
      <div className={bem('categories-title')}>
        <span>Categories</span>
        <div />
      </div>
      <UserCategories
        activeCategories={currentCategories}
        onChangeActive={onChangeActive}
        inactive={inactiveCategories}
      />
    </div>
  );
};

Filters.propTypes = {
  fetchCategories: PropTypes.func,
  profileId: PropTypes.number,
  isCategoriesLoaded: PropTypes.bool,
  onChangeActive: PropTypes.func,
  inactiveCategories: PropTypes.arrayOf(PropTypes.string),
  currentCategories: PropTypes.arrayOf(PropTypes.shape({})),
};

const mapStateToProps = (state) => {
  const profileId = profileSelectors.getMyProfileId(state);
  return {
    isCategoriesLoaded: profileSelectors.getIsUserCategoriesLoaded(state, {
      profileId,
    }),
    currentCategories:
      profileSelectors.getUserCategories(state, { profileId }) || [],
    profileId,
  };
};

const FiltersConnected = connect(mapStateToProps, {
  fetchCategories: fetchUserCategoriesAction,
})(Filters);

const FiltersPopup = () => {
  const {
    openFilters: open,
    toggleOpenFilters: toggleOpen,
    onChangeActiveFilter: onChangeActive,
    inactiveCategories,
  } = useContext(PlanContext);
  return (
    <Popup
      position="bottom right"
      size="large"
      open={open}
      onClose={toggleOpen}
      className={bem()}
      onOpen={toggleOpen}
      on="click"
      trigger={<Icon name="sliders horizontal" size="large" />}
    >
      <FiltersConnected
        onChangeActive={onChangeActive}
        inactiveCategories={inactiveCategories}
      />
    </Popup>
  );
};

export default FiltersPopup;
