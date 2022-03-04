import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Checkbox, Form } from 'semantic-ui-react';
import FilterSection from './Section';
import { getMembersPaginationFilters } from '../../../selectors/groups';
import { changeMembersFilter } from '../../../Actions/actions_groups';

const ActiveCategoriesFilters = ({ filters, changeFilter }) => {
  function onChangeValue(e, { value }) {
    changeFilter({ categories: [value] });
  }
  return (
    <FilterSection title="Active Category">
      <Form>
        <Form.Field>
          <Checkbox
            label="Health & Fitness"
            value="Health & Fitness"
            checked={
              filters.categories &&
              filters.categories.includes('Health & Fitness')
            }
            onChange={onChangeValue}
          />
        </Form.Field>
        <Form.Field>
          <Checkbox
            label="Learn"
            value="Learn"
            checked={filters.categories && filters.categories.includes('Learn')}
            onChange={onChangeValue}
          />
        </Form.Field>
        <Form.Field>
          <Checkbox
            label="Work"
            value="Work"
            checked={filters.categories && filters.categories.includes('Work')}
            onChange={onChangeValue}
          />
        </Form.Field>
        <Form.Field>
          <Checkbox
            label="Life"
            value="Life"
            checked={filters.categories && filters.categories.includes('Life')}
            onChange={onChangeValue}
          />
        </Form.Field>
      </Form>
    </FilterSection>
  );
};

ActiveCategoriesFilters.propTypes = {
  filters: PropTypes.shape(),
  changeFilter: PropTypes.func,
};

const mapStateToProps = (state) => ({
  filters: getMembersPaginationFilters(state),
});

export default connect(mapStateToProps, {
  changeFilter: changeMembersFilter,
})(ActiveCategoriesFilters);
