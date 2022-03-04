/* eslint-disable no-restricted-globals */
import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Checkbox, Form } from 'semantic-ui-react';
import { getPaginationFilters } from '../../../selectors/groups';
import FilterSection from '../../Buddies/BuddyFilters/FilterSection';
import { changeGroupsFilter as changeGroupsFilterAction } from '../../../Actions/actions_groups';

function Privacy({ value, changeGroupsFilter }) {
  function changeValue(e, { value: inputValue }) {
    const val = typeof inputValue === 'string' ? inputValue : null;
    changeGroupsFilter({ privacy: val });
  }
  return (
    <FilterSection title="Privacy">
      <Form>
        <Form.Field>
          <Checkbox
            radio
            label="Public"
            value="Public"
            onChange={changeValue}
            checked={value === 'Public'}
          />
        </Form.Field>
        <Form.Field>
          <Checkbox
            radio
            label="Private"
            value="Private"
            onChange={changeValue}
            checked={value === 'Private'}
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

Privacy.propTypes = {
  changeGroupsFilter: PropTypes.func,
  value: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.oneOf([null, undefined]),
  ]),
};

const mapStateToProps = (state) => ({
  value: getPaginationFilters(state).privacy,
});

export default connect(mapStateToProps, {
  changeGroupsFilter: changeGroupsFilterAction,
})(Privacy);
