import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Checkbox, Form } from 'semantic-ui-react';
import FilterSection from '../../Buddies/BuddyFilters/FilterSection';
import { changeGroupsFilter as changeGroupsFilterAction } from '../../../Actions/actions_groups';
import { getPaginationFilters } from '../../../selectors/groups';

function ActiveCategory({ values, changeGroupsFilter }) {
  function changeValue(e, { value: inputValue }) {
    const val = Number(inputValue);
    changeGroupsFilter({ categories: [val] });
  }
  return (
    <FilterSection title="Category">
      <Form>
        <Form.Field>
          <Checkbox
            label="Health & Fitness"
            value={1}
            onChange={changeValue}
            checked={values && values.includes(1)}
          />
        </Form.Field>
        <Form.Field>
          <Checkbox
            label="Learn"
            value={2}
            onChange={changeValue}
            checked={values && values.includes(2)}
          />
        </Form.Field>
        <Form.Field>
          <Checkbox
            label="Work"
            value={3}
            onChange={changeValue}
            checked={values && values.includes(3)}
          />
        </Form.Field>
        <Form.Field>
          <Checkbox
            label="Life"
            value={4}
            onChange={changeValue}
            checked={values && values.includes(4)}
          />
        </Form.Field>
      </Form>
    </FilterSection>
  );
}

ActiveCategory.propTypes = {
  changeGroupsFilter: PropTypes.func,
  values: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.number),
    PropTypes.oneOf([null]),
  ]),
};

const mapStateToProps = (state) => ({
  values: getPaginationFilters(state).categories,
});

export default connect(mapStateToProps, {
  changeGroupsFilter: changeGroupsFilterAction,
})(ActiveCategory);
