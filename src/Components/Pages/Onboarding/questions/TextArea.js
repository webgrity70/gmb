import React from 'react';
import { TextArea } from 'semantic-ui-react';

const GMBTextArea = ({ onChange, value, question }) => (
  <div className="form_field_container_inner textarea_container ui form">
    <TextArea
      maxLength="350"
      rows={10}
      className="textarea"
      placeholder={question.placeholder || ''}
      onChange={(event) => {
        if (event.target.value.length <= 350) {
          onChange(event.target.value);
        }
      }}
      value={value}
    />
    <span className="character_count">{value ? value.length : 0} / 350</span>
  </div>
);

export default GMBTextArea;
