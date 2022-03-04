import React from 'react';

const createDOMPurify = require('dompurify');

const HtmlParse = (html) => (
  <div dangerouslySetInnerHTML={{ __html: createDOMPurify.sanitize(html) }} />
);
export default HtmlParse;
