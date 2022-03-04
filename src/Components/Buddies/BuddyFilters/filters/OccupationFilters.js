import React, { useContext } from 'react';
import { Checkbox, Form } from 'semantic-ui-react';
import FilterSection from '../FilterSection';
import FiltersContex from '../../FiltersContext';

function OccupationFilters() {
  const filtersContext = useContext(FiltersContex);
  return (
    <FilterSection title="Occupation">
      <Form>
        <Form.Field>
          <Checkbox
            label="Employee"
            value="Employee"
            checked={filtersContext.occupation === 'Employee'}
            onChange={filtersContext.handleChangeRadioOccupation}
          />
        </Form.Field>
        <Form.Field>
          <Checkbox
            label="Student"
            value="Student"
            checked={filtersContext.occupation === 'Student'}
            onChange={filtersContext.handleChangeRadioOccupation}
          />
        </Form.Field>
        <Form.Field>
          <Checkbox
            label="Self-Employed"
            value="Self-Employed"
            checked={filtersContext.occupation === 'Self-Employed'}
            onChange={filtersContext.handleChangeRadioOccupation}
          />
        </Form.Field>
        <Form.Field>
          <Checkbox
            label="Entrepreneur"
            value="Entrepreneur"
            checked={filtersContext.occupation === 'Entrepreneur'}
            onChange={filtersContext.handleChangeRadioOccupation}
          />
        </Form.Field>
        <Form.Field>
          <Checkbox
            label="Looking for Work"
            value="Looking for Work"
            checked={filtersContext.occupation === 'Looking for Work'}
            onChange={filtersContext.handleChangeRadioOccupation}
          />
        </Form.Field>
        <Form.Field>
          <Checkbox
            label="Programmer"
            value="Programmer"
            checked={filtersContext.occupation === 'Programmer'}
            onChange={filtersContext.handleChangeRadioOccupation}
          />
        </Form.Field>
        <Form.Field>
          <Checkbox
            label="Stay-at-home Parent"
            value="Stay-at-home Parent"
            checked={filtersContext.occupation === 'Stay-at-home Parent'}
            onChange={filtersContext.handleChangeRadioOccupation}
          />
        </Form.Field>
        <Form.Field>
          <Checkbox
            label="Any"
            value="Any"
            checked={filtersContext.occupation === 'Any'}
            onChange={filtersContext.handleChangeRadioOccupation}
          />
        </Form.Field>
      </Form>
    </FilterSection>
  );
}

export default OccupationFilters;
