import React, { useContext } from 'react';
import Select from 'react-select';
import FilterSection from '../FilterSection';
import FiltersContex from '../../FiltersContext';

function HealthFitnessFilters() {
  const filtersContext = useContext(FiltersContex);
  if (!filtersContext.healthFitnessCheckbox) {
    return null;
  }
  return (
    <FilterSection title="Health & Fitness">
      <Select
        className="dropdown-single"
        value={filtersContext.healthFitness}
        onChange={filtersContext.setHealthFitness}
        options={filtersContext.healthFitnessOptions}
      />
    </FilterSection>
  );
}

export default HealthFitnessFilters;
