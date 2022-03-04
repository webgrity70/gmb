/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { toast } from 'react-toastify';
import { getTemplateDetails } from '../../../selectors/plans';
import { fetchTemplateDetails as fetchTemplateDetailsAction } from '../../../Actions/actions_plan';
import NameField from '../../Plan/GlobalTemplates/MTTab/NameField';

function TemplateDetails({
  id,
  details,
  onSelect,
  isEditOn,
  onToggleEdit,
  fetchTemplateDetails,
  ...template
}) {
  async function loadTemplate() {
    if (details) {
      onSelect(details);
    } else {
      const { detail, ...data } = await fetchTemplateDetails(id);
      if (detail) {
        toast.error(detail);
      } else {
        onSelect(data);
      }
    }
  }
  return (
    <NameField
      {...template}
      id={id}
      isEditOn={isEditOn}
      toggleEdit={onToggleEdit}
      onSelect={() => loadTemplate()}
    />
  );
}

TemplateDetails.propTypes = {
  id: PropTypes.number,
  fetchTemplateDetails: PropTypes.func,
  onSelect: PropTypes.func,
  onToggleEdit: PropTypes.func,
  isEditOn: PropTypes.bool,
  details: PropTypes.shape(),
};

const mapStateToProps = (state, { id }) => ({
  details: getTemplateDetails(state, { id }),
});

export default connect(mapStateToProps, {
  fetchTemplateDetails: fetchTemplateDetailsAction,
})(TemplateDetails);
