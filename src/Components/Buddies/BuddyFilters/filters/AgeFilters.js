import React, { useContext } from 'react';
import { Input, Form } from 'semantic-ui-react';
import FilterSection from '../FilterSection';
import FiltersContex from '../../FiltersContext';

function AgeFilters() {
  const filtersContext = useContext(FiltersContex);
  return (
    <FilterSection title="Age Range">
      <Form>
        <Form.Field>
          <div className="age-label">Youngest Age:</div>
          <Input
            type="number"
            min="16"
            max="122"
            value={filtersContext.minAge}
            onChange={filtersContext.handleChangeAge('minAge')}
          />
          {filtersContext.errors.minAge && (
            <span className="age-error">{filtersContext.errors.minAge}</span>
          )}
        </Form.Field>
        <Form.Field>
          <div className="age-label">Oldest Age:</div>
          <Input
            type="number"
            min="16"
            max="122"
            value={filtersContext.maxAge}
            onChange={filtersContext.handleChangeAge('maxAge')}
          />
          {filtersContext.errors.maxAge && (
            <span className="age-error">{filtersContext.errors.maxAge}</span>
          )}
        </Form.Field>
      </Form>
    </FilterSection>
  );
}

export default AgeFilters;
