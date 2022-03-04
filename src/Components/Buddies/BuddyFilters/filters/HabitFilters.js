import React, { useContext } from 'react';
import Select from 'react-select';
import FilterSection from '../FilterSection';
import FiltersContex from '../../FiltersContext';

function HabitFilters() {
  const filtersContext = useContext(FiltersContex);
  return (
    <FilterSection title="Health & Fitness">
      <div
        style={{ display: filtersContext.healthFitnessCheckbox ? '' : 'none' }}
      >
        <h3 className="filter-sub-header">
          <b />
        </h3>
        <Select
          className="dropdown-single"
          value={filtersContext.healthFitness}
          onChange={filtersContext.setHealthFitness}
          options={filtersContext.healthFitnessOptions}
        />
      </div>
      <div style={{ display: filtersContext.learnCheckbox ? '' : 'none' }}>
        <h3 className="filter-sub-header">
          <b>Learn</b>
        </h3>
        <Select
          className="dropdown-single"
          value={filtersContext.learn}
          onChange={filtersContext.setLearn}
          options={filtersContext.learnOptions}
        />
      </div>
      <div style={{ display: filtersContext.workCheckbox ? '' : 'none' }}>
        <h3 className="filter-sub-header">
          <b>Work</b>
        </h3>
        <Select
          className="dropdown-single"
          value={filtersContext.work}
          onChange={filtersContext.setWork}
          options={filtersContext.workOptions}
        />
      </div>
      <div style={{ display: filtersContext.lifeCheckbox ? '' : 'none' }}>
        <h3 className="filter-sub-header">
          <b>Life</b>
        </h3>
        <Select
          style={{ width: '100px' }}
          className="dropdown-single"
          value={filtersContext.life}
          onChange={filtersContext.setLife}
          options={filtersContext.lifeOptions}
        />
      </div>
    </FilterSection>
  );
}

export default HabitFilters;
