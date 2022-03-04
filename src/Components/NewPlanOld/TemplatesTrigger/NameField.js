import React, { useState } from 'react';
import { connect } from 'react-redux';
import isEmpty from 'lodash/isEmpty';
import PropTypes from 'prop-types';
import { Icon, Input } from 'semantic-ui-react';
import {
  deleteTemplate as deleteTemplateAction,
  updateTemplate as updateTemplateAction,
} from '../../../Actions/actions_plan';

const NameField = ({
  name,
  id,
  isEditOn,
  toggleEdit,
  deleteTemplate,
  updateTemplate,
}) => {
  const [text, setText] = useState(name);
  function remove(e) {
    e.stopPropagation();
    deleteTemplate(id);
    toggleEdit(id);
  }
  function update(e) {
    e.stopPropagation();
    updateTemplate({ id, name: text });
    toggleEdit(id);
  }
  if (!isEditOn) {
    return (
      <div className="flex items-center">
        <h5>{name}</h5>
        <Icon
          name="pencil"
          onClick={(e) => [e.stopPropagation(), toggleEdit(id)]}
        />
      </div>
    );
  }
  return (
    <div className="flex items-center editing">
      <Icon name="trash" onClick={remove} />
      <Input
        type="text"
        value={text}
        onChange={(e, { value }) => setText(value)}
        onClick={(e) => e.stopPropagation()}
      />
      <Icon
        name="close"
        onClick={(e) => [e.stopPropagation(), toggleEdit(id)]}
      />
      <Icon name="check" disabled={isEmpty(text)} onClick={update} />
    </div>
  );
};

NameField.propTypes = {
  name: PropTypes.string,
  id: PropTypes.number,
  isEditOn: PropTypes.bool,
  toggleEdit: PropTypes.func,
  deleteTemplate: PropTypes.func,
  updateTemplate: PropTypes.func,
};

export default connect(null, {
  deleteTemplate: deleteTemplateAction,
  updateTemplate: updateTemplateAction,
})(NameField);
