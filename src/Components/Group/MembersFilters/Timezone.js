import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Checkbox, Form } from 'semantic-ui-react';
import FilterSection from './Section';
import { changeMembersFilter } from '../../../Actions/actions_groups';
import { getMembersPaginationFilters } from '../../../selectors/groups';

const TimezoneFilters = ({ filters, changeFilter }) => (
  <FilterSection title="Timezone">
    <Form>
      <Form.Field>
        <Checkbox
          radio
          label="Same as mine"
          checked={filters.timezone === 0}
          onChange={() => changeFilter({ timezone: 0 })}
        />
      </Form.Field>
      <Form.Field>
        <Checkbox
          radio
          label="Max 3 hrs (+ or -)"
          checked={filters.timezone === 3}
          onChange={() => changeFilter({ timezone: 3 })}
        />
      </Form.Field>
      <Form.Field>
        <Checkbox
          radio
          label="Any Timezone"
          checked={!filters.timezone}
          onChange={() => changeFilter({ timezone: undefined })}
        />
      </Form.Field>
    </Form>
  </FilterSection>
);

TimezoneFilters.propTypes = {
  changeFilter: PropTypes.func,
  filters: PropTypes.shape(),
};

const mapStateToProps = (state) => ({
  filters: getMembersPaginationFilters(state),
});

export default connect(mapStateToProps, { changeFilter: changeMembersFilter })(
  TimezoneFilters
);
