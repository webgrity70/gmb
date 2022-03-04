import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Checkbox, Form } from 'semantic-ui-react';
import FilterSection from './Section';
import { getMembersPaginationFilters } from '../../../selectors/groups';
import { changeMembersFilter } from '../../../Actions/actions_groups';

const JoinedWithinFilters = ({ filters, changeFilter }) => (
  <FilterSection title="Joined within">
    <Form>
      <Form.Field>
        <Checkbox
          label="Last week"
          onChange={() => changeFilter({ joined_within: '7' })}
          checked={filters.joined_within === '7'}
        />
      </Form.Field>
      <Form.Field>
        <Checkbox
          label="Last month"
          onChange={() => changeFilter({ joined_within: 30 })}
          checked={filters.joined_within === 30}
        />
      </Form.Field>
      <Form.Field>
        <Checkbox
          label="Last 3 months"
          onChange={() => changeFilter({ joined_within: 90 })}
          checked={filters.joined_within === 90}
        />
      </Form.Field>
      <Form.Field>
        <Checkbox
          label="Last Year"
          onChange={() => changeFilter({ joined_within: 365 })}
          checked={filters.joined_within === 365}
        />
      </Form.Field>
      <Form.Field>
        <Checkbox
          label="Anytime"
          onChange={() => changeFilter({ joined_within: undefined })}
          checked={!filters.joined_within}
        />
      </Form.Field>
    </Form>
  </FilterSection>
);

JoinedWithinFilters.propTypes = {
  filters: PropTypes.shape(),
  changeFilter: PropTypes.func,
};

const mapStateToProps = (state) => ({
  filters: getMembersPaginationFilters(state),
});

export default connect(mapStateToProps, { changeFilter: changeMembersFilter })(
  JoinedWithinFilters
);
