import React from 'react';
import ReactQuill from 'react-quill'; // ES6
import PropTypes from 'prop-types';
import 'react-quill/dist/quill.snow.css';
import './MDEEditor.scss';
// import SimpleMDE from 'react-simplemde-editor';
// import toolbar from './options';
// import 'easymde/dist/easymde.min.css';
/*
  <SimpleMDE
    value={value}
    onChange={onChange}
    getMdeInstance={getInstance}
    options={{
      hideIcons: ['guide', 'heading'],
      status: false,
      placeholder,
      noMobile: false,
      spellChecker: false,
      toolbar,
    }}
  />
*/

const MDEEditor = ({ onChange, placeholder, value, ...props }) => (
  <div className="MDEEditor">
    <ReactQuill
      value={value || ''}
      onChange={(val) => onChange(val.replace(/style=".*?"/g, ''))}
      placeholder={placeholder}
      {...props}
    />
  </div>
);

MDEEditor.propTypes = {
  value: PropTypes.string,
  getInstance: PropTypes.oneOfType([PropTypes.func, PropTypes.oneOf([null])]),
  onChange: PropTypes.func,
  placeholder: PropTypes.oneOfType([PropTypes.string, PropTypes.oneOf([null])]),
};
MDEEditor.defaultProps = {
  placeholder: `What specifically do you intend to do
e.g., 2 miles at a 7 minute pace, pgs 12-30 of Behavioral Psychology?`,
};

export default MDEEditor;
