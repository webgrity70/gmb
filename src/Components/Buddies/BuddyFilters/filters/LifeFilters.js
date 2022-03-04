import React, { useContext } from 'react';
import Select from 'react-select';
import FilterSection from '../FilterSection';
import FiltersContex from '../../FiltersContext';

function LifeFilters() {
  const filtersContext = useContext(FiltersContex);
  if (!filtersContext.lifeCheckbox) {
    return null;
  }
  return (
    <FilterSection title="Life">
      <Select
        style={{ width: '100px' }}
        className="dropdown-single"
        value={filtersContext.life}
        onChange={filtersContext.setLife}
        options={filtersContext.lifeOptions}
      />
    </FilterSection>
  );
}

export default LifeFilters;
