import React, { useContext } from 'react';
import Select from 'react-select';
import FilterSection from '../FilterSection';
import FiltersContex from '../../FiltersContext';

function LearnFilters() {
  const filtersContext = useContext(FiltersContex);
  if (!filtersContext.learnCheckbox) {
    return null;
  }
  return (
    <FilterSection title="Learn">
      <Select
        className="dropdown-single"
        value={filtersContext.learn}
        onChange={filtersContext.setLearn}
        options={filtersContext.learnOptions}
      />
    </FilterSection>
  );
}

export default LearnFilters;
