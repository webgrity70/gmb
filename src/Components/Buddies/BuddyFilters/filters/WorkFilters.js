import React, { useContext } from 'react';
import Select from 'react-select';
import FilterSection from '../FilterSection';
import FiltersContex from '../../FiltersContext';

function WorkFilters() {
  const filtersContext = useContext(FiltersContex);
  if (!filtersContext.workCheckbox) {
    return null;
  }
  return (
    <FilterSection title="Work">
      <Select
        className="dropdown-single"
        value={filtersContext.work}
        onChange={filtersContext.setWork}
        options={filtersContext.workOptions}
      />
    </FilterSection>
  );
}

export default WorkFilters;
