import React, { useContext } from 'react';
import { Checkbox, Form } from 'semantic-ui-react';
import FilterSection from '../FilterSection';
import FiltersContex from '../../FiltersContext';

function ActiveCategoryFilters() {
  const filtersContext = useContext(FiltersContex);
  return (
    <FilterSection title="Active Category">
      <Form>
        <Form.Field>
          <Checkbox
            label="Health & Fitness"
            checked={filtersContext.healthFitnessCheckbox}
            onChange={filtersContext.handleChangeRadioHealthFitnessCheckbox}
          />
        </Form.Field>
        <Form.Field>
          <Checkbox
            label="Learn"
            checked={filtersContext.learnCheckbox}
            onChange={filtersContext.handleChangeRadioLearnCheckbox}
          />
        </Form.Field>
        <Form.Field>
          <Checkbox
            label="Work"
            checked={filtersContext.workCheckbox}
            onChange={filtersContext.handleChangeRadioWorkCheckbox}
          />
        </Form.Field>
        <Form.Field>
          <Checkbox
            label="Life"
            checked={filtersContext.lifeCheckbox}
            onChange={filtersContext.handleChangeRadioLifeCheckbox}
          />
        </Form.Field>
      </Form>
    </FilterSection>
  );
}

export default ActiveCategoryFilters;
