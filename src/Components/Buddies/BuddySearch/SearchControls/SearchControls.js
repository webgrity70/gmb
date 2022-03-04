import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import { Icon, Image } from 'semantic-ui-react';
import helpBuddy from '../../../../Assets/images/help-buddy.png';
import FiltersContext from '../../FiltersContext';

import './SearchControls.scss';

function SearchControls({ view, onSwitchView, profile }) {
  const filterContext = useContext(FiltersContext);
  const hasPlan = profile ? profile.has_plan : false;
  return (
    <div className="BuddySearchControls">
      <h2 className="BuddySearchControls__title"> Browse Buddies </h2>
      <Icon
        name="sliders"
        size="small"
        onClick={() => filterContext.toggleFilter()}
        className={`BuddySearchControls__filter-icon ${
          filterContext.isFiltering ? 'active' : ''
        }`}
      />
      <input
        placeholder="Type a name, email, or any word (e.g. run, distracted, motivation, happy)"
        className="BuddySearchControls__search-bar"
        value={filterContext.text}
        onChange={filterContext.handleChangeText}
        disabled={!hasPlan}
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
      <div className="BuddySearchControls__subtitle">
        <Image src={helpBuddy} />
        <p className="text">
          Search for buddies by typing what you're looking for in the search
          bar.
        </p>
      </div>
    </div>
  );
}

SearchControls.propTypes = {
  onSwitchView: PropTypes.func.isRequired,
  profile: PropTypes.shape({ has_plan: PropTypes.bool }),
  view: PropTypes.oneOf(['grid', 'list']),
};

export default SearchControls;
