/* eslint-disable no-restricted-globals */
import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Checkbox, Form } from 'semantic-ui-react';
import { getPaginationFilters } from '../../../selectors/groups';
import FilterSection from '../../Buddies/BuddyFilters/FilterSection';
import { changeGroupsFilter as changeGroupsFilterAction } from '../../../Actions/actions_groups';

function Timezone({ value, changeGroupsFilter }) {
  function changeValue(e, { value: inputValue }) {
    const val = typeof inputValue === 'string' ? Number(inputValue) : null;
    changeGroupsFilter({ timezone: val });
  }
  return (
    <FilterSection title="Timezone">
      <Form>
        <Form.Field>
          <Checkbox
            radio
            label="Same as mine"
            value="0"
            onChange={changeValue}
            checked={value === 0}
          />
        </Form.Field>
        <Form.Field>
          <Checkbox
            radio
            label="Max 3 hrs (+ or -)"
            value="3"
            onChange={changeValue}
            checked={value === 3}
          />
        </Form.Field>
        <Form.Field>
          <Checkbox
            radio
            label="Any Timezone"
            value={0}
            onChange={changeValue}
            checked={value === undefined || value === null}
          />
        </Form.Field>
      </Form>
    </FilterSection>
  );
}

Timezone.propTypes = {
  changeGroupsFilter: PropTypes.func,
  value: PropTypes.oneOfType([
    PropTypes.number,
    PropTypes.oneOf([undefined, null]),
  ]),
};

const mapStateToProps = (state) => ({
  value: getPaginationFilters(state).timezone,
});

export default connect(mapStateToProps, {
  changeGroupsFilter: changeGroupsFilterAction,
})(Timezone);
