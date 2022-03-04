import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Button } from 'semantic-ui-react';
import { CopyToClipboard } from 'react-copy-to-clipboard';

const GMBCopyToClipboard = ({ toCopy, Success, children }) => {
  const [copied, setCopied] = useState(false);
  function doCopy() {
    setCopied(true);
    setTimeout(() => setCopied(false), 5000);
  }
  if (copied) return Success;
  return (
    <CopyToClipboard text={toCopy} onCopy={doCopy}>
      {children}
    </CopyToClipboard>
  );
};

GMBCopyToClipboard.defaultProps = {
  children: <Button color="orange">Copy to Clipboard</Button>,
  Success: <span>Copied to Clipboard</span>,
};

GMBCopyToClipboard.propTypes = {
  children: PropTypes.node,
  Success: PropTypes.node,
  toCopy: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
};

export default GMBCopyToClipboard;
