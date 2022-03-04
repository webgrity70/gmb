import React from 'react';
import { TextArea } from 'semantic-ui-react';

const About = ({ onChange, value, question }) => (
  <div className="form_field_container_inner textarea_container ui form">
    <TextArea
      maxLength="2000"
      rows={10}
      className="textarea"
      placeholder={question.placeholder || ''}
      onChange={(event) => {
        if (event.target.value.length <= 2000) {
          onChange(event.target.value);
        }
      }}
      value={value}
    />
    <span className="character_count">
      {value && value.length < 50 ? 'Minimum character count 50.' : ''}
    </span>
    <span className="character_count">{value ? value.length : 0} / 2000</span>
  </div>
);

export default About;
