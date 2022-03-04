import React, { useContext } from 'react';
import { Checkbox, Form } from 'semantic-ui-react';
import FilterSection from '../FilterSection';
import FiltersContex from '../../FiltersContext';

function TimezoneFilters() {
  const filtersContext = useContext(FiltersContex);
  return (
    <FilterSection title="Timezone">
      <Form>
        <Form.Field>
          <Checkbox
            radio
            label="Same as mine"
            value="0"
            checked={filtersContext.timezone === '0'}
            onChange={filtersContext.handleChangeRadioTimezone}
          />
        </Form.Field>
        <Form.Field>
          <Checkbox
            radio
            label="Max 3 hrs (+ or -)"
            value="3"
            checked={filtersContext.timezone === '3'}
            onChange={filtersContext.handleChangeRadioTimezone}
          />
        </Form.Field>
        <Form.Field>
          <Checkbox
            radio
            label="Any Timezone"
            value="Any"
            checked={filtersContext.timezone === 'Any'}
            onChange={filtersContext.handleChangeRadioTimezone}
          />
        </Form.Field>
      </Form>
    </FilterSection>
  );
}

export default TimezoneFilters;
