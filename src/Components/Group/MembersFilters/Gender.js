import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Checkbox, Form } from 'semantic-ui-react';
import FilterSection from './Section';
import { changeMembersFilter } from '../../../Actions/actions_groups';
import { getMembersPaginationFilters } from '../../../selectors/groups';

const GenderFilters = ({ filters, changeFilter }) => (
  <FilterSection title="Gender">
    <Form>
      <Form.Field>
        <Checkbox
          radio
          label="Male"
          checked={filters.gender === '1'}
          onChange={() => changeFilter({ gender: '1' })}
        />
      </Form.Field>
      <Form.Field>
        <Checkbox
          radio
          label="Female"
          checked={filters.gender === '2'}
          onChange={() => changeFilter({ gender: '2' })}
        />
      </Form.Field>
      <Form.Field>
        <Checkbox
          radio
          label="Any"
          checked={!filters.gender || filters.gender === 'Any'}
          onChange={() => changeFilter({ gender: 'Any' })}
        />
      </Form.Field>
    </Form>
  </FilterSection>
);

GenderFilters.propTypes = {
  filters: PropTypes.shape(),
  changeFilter: PropTypes.func,
};

const mapStateToProps = (state) => ({
  filters: getMembersPaginationFilters(state),
});

export default connect(mapStateToProps, {
  changeFilter: changeMembersFilter,
})(GenderFilters);
