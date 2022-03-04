import React from 'react';
import BEMHelper from 'react-bem-helper';
import TimezoneFilters from './Timezone';
import ActiveCategoryFilters from './ActiveCategory';
import PrivacyFilters from './Privacy';
import TypeFilters from './Type';

import './Filters.scss';

const bem = BEMHelper({ name: 'GroupsFilters', outputIsString: true });

function Filters() {
  return (
    <div className={bem()}>
      <h2 className="header">Filters</h2>
      <TimezoneFilters />
      <ActiveCategoryFilters />
      <PrivacyFilters />
      <TypeFilters />
    </div>
  );
}

export default Filters;
