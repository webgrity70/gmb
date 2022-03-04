/* eslint-disable no-restricted-globals */
import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Checkbox, Form } from 'semantic-ui-react';
import { getPaginationFilters } from '../../../selectors/groups';
import FilterSection from '../../Buddies/BuddyFilters/FilterSection';
import { changeGroupsFilter as changeGroupsFilterAction } from '../../../Actions/actions_groups';

function Type({ value, changeGroupsFilter }) {
  function changeValue(e, { value: inputValue }) {
    const val = typeof inputValue === 'string' ? inputValue : null;
    changeGroupsFilter({ groupType: val });
  }
  return (
    <FilterSection title="Type">
      <Form>
        <Form.Field>
          <Checkbox
            radio
            label="School"
            value="School"
            onChange={changeValue}
            checked={value === 'School'}
          />
        </Form.Field>
        <Form.Field>
          <Checkbox
            radio
            label="Gym"
            value="Gym"
            onChange={changeValue}
            checked={value === 'Gym'}
          />
        </Form.Field>
        <Form.Field>
          <Checkbox
            radio
            label="Organization"
            value="Organization"
            onChange={changeValue}
            checked={value === 'Organization'}
          />
        </Form.Field>
        <Form.Field>
          <Checkbox
            radio
            label="App"
            value="App"
            onChange={changeValue}
            checked={value === 'App'}
          />
        </Form.Field>
        <Form.Field>
          <Checkbox
            radio
            label="Other"
            value="Other"
            onChange={changeValue}
            checked={value === 'Other'}
          />
        </Form.Field>
        <Form.Field>
          <Checkbox
            radio
            label="Any"
            value={0}
            onChange={changeValue}
            checked={!value}
          />
        </Form.Field>
      </Form>
    </FilterSection>
  );
}

Type.propTypes = {
  changeGroupsFilter: PropTypes.func,
  value: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.oneOf([undefined, null]),
  ]),
};

const mapStateToProps = (state) => ({
  value: getPaginationFilters(state).groupType,
});

export default connect(mapStateToProps, {
  changeGroupsFilter: changeGroupsFilterAction,
})(Type);
