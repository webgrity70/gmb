import React, { useContext } from 'react';
import { Checkbox, Form } from 'semantic-ui-react';
import FilterSection from '../FilterSection';
import FiltersContex from '../../FiltersContext';

function GenderFilters() {
  const filtersContext = useContext(FiltersContex);
  return (
    <FilterSection title="Gender">
      <Form>
        <Form.Field>
          <Checkbox
            radio
            label="Male"
            value="1"
            checked={filtersContext.gender === '1'}
            onChange={filtersContext.handleChangeRadioGender}
          />
        </Form.Field>
        <Form.Field>
          <Checkbox
            radio
            label="Female"
            value="2"
            checked={filtersContext.gender === '2'}
            onChange={filtersContext.handleChangeRadioGender}
          />
        </Form.Field>
        <Form.Field>
          <Checkbox
            radio
            label="Any"
            value="Any"
            checked={filtersContext.gender === 'Any'}
            onChange={filtersContext.handleChangeRadioGender}
          />
        </Form.Field>
      </Form>
    </FilterSection>
  );
}

export default GenderFilters;
