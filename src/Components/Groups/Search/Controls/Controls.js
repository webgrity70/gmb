import React, { useState, useMemo } from 'react';
import PropTypes from 'prop-types';
import debounce from 'lodash/debounce';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import BEMHelper from 'react-bem-helper';
import { Button, Icon, Image } from 'semantic-ui-react';
import helpBuddy from '../../../../Assets/images/help-buddy.png';
import {
  changeGroupsSearch as changeGroupsSearchAction,
  fetchGroups as fetchGroupsAction,
} from '../../../../Actions/actions_groups';
import { getPaginationSearch } from '../../../../selectors/groups';

import './Controls.scss';

const bem = BEMHelper({ name: 'GroupsSearchControls', outputIsString: true });

function SearchControls({
  view,
  isFiltering,
  history,
  search,
  setFiltering,
  onSwitchView,
  changeGroupsSearch,
}) {
  const [val, setVal] = useState(search || '');
  const searchDebounced = useMemo(() => debounce(changeGroupsSearch, 700), [
    changeGroupsSearch,
  ]);
  function onChangeValue({ target: { value } }) {
    setVal(value);
    searchDebounced(value);
  }
  return (
    <div className={bem()}>
      <div>
        <h2 className={bem('title')}> Browse Groups or...</h2>
        <Button onClick={() => history.push('/new-group')} color="orange">
          CREATE ONE
        </Button>
      </div>
      <Icon
        name="sliders"
        size="small"
        onClick={() => setFiltering(!isFiltering)}
        className={`${bem('filter-icon')} ${isFiltering ? 'active' : ''}`}
      />
      <input
        placeholder="Type something"
        className={bem('search-bar')}
        onChange={onChangeValue}
        value={val}
        autoComplete="false"
        autoCapitalize="false"
        autoCorrect="false"
        spellCheck="false"
      />
      {window.innerWidth >= 767 && (
        <React.Fragment>
          <Icon
            onClick={() => onSwitchView('list')}
            style={{
              fontSize: '22px',
              color: view === 'list' ? '#FF8F00' : '#e0e5ea',
              position: 'relative',
              top: '4px',
              left: '15px',
            }}
            className="clickable"
            name="bars"
          />
          <Icon
            onClick={() => onSwitchView('grid')}
            style={{
              fontSize: '22px',
              color: view === 'grid' ? '#FF8F00' : '#e0e5ea',
              position: 'relative',
              top: '4px',
              left: '23px',
            }}
            className="clickable"
            name="block layout"
          />
        </React.Fragment>
      )}
      <div className={bem('subtitle')}>
        <Image src={helpBuddy} />
        <p className="text">
          Search for groups by typing whatever you want in the search bar.{' '}
        </p>
      </div>
    </div>
  );
}

SearchControls.propTypes = {
  onSwitchView: PropTypes.func.isRequired,
  view: PropTypes.oneOf(['grid', 'list']),
  isFiltering: PropTypes.bool,
  search: PropTypes.string,
  setFiltering: PropTypes.func,
  changeGroupsSearch: PropTypes.func,
  history: PropTypes.shape({}),
};

const mapDispatchToProps = {
  changeGroupsSearch: changeGroupsSearchAction,
  fetchGroups: fetchGroupsAction,
};

const ConnectedControls = connect(
  (state) => ({ search: getPaginationSearch(state) }),
  mapDispatchToProps
)(SearchControls);

export default withRouter(ConnectedControls);
