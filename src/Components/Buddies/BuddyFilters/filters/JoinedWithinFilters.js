import React, { useContext } from 'react';
import { Checkbox, Form } from 'semantic-ui-react';
import FilterSection from '../FilterSection';
import FiltersContex from '../../FiltersContext';

function JoinedWithinFilters() {
  const filtersContext = useContext(FiltersContex);
  return (
    <FilterSection title="Joined within">
      <Form>
        <Form.Field>
          <Checkbox
            label="Last week"
            value="7"
            checked={filtersContext.joinedWithin === '7'}
            onChange={filtersContext.handleChangeRadioJoinedWithin}
          />
        </Form.Field>
        <Form.Field>
          <Checkbox
            label="Last month"
            value="30"
            checked={filtersContext.joinedWithin === '30'}
            onChange={filtersContext.handleChangeRadioJoinedWithin}
          />
        </Form.Field>
        <Form.Field>
          <Checkbox
            label="Last 3 months"
            value="90"
            checked={filtersContext.joinedWithin === '90'}
            onChange={filtersContext.handleChangeRadioJoinedWithin}
          />
        </Form.Field>
        <Form.Field>
          <Checkbox
            label="Last Year"
            value="365"
            checked={filtersContext.joinedWithin === '365'}
            onChange={filtersContext.handleChangeRadioJoinedWithin}
          />
        </Form.Field>
        <Form.Field>
          <Checkbox
            label="Anytime"
            value="Any"
            checked={filtersContext.joinedWithin === 'Any'}
            onChange={filtersContext.handleChangeRadioJoinedWithin}
          />
        </Form.Field>
      </Form>
    </FilterSection>
  );
}

export default JoinedWithinFilters;
