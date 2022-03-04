import React, { useEffect } from 'react';
import ReactBottomScrollListener from 'react-bottom-scroll-listener';
import PropTypes from 'prop-types';

function FixedBottomScrollListener({ scrollRef, onBottom, children }) {
  useEffect(() => {
    const scrollNode = scrollRef.current;
    if (
      scrollNode != null &&
      onBottom &&
      scrollNode.scrollHeight === scrollNode.clientHeight
    ) {
      onBottom();
    }
  });

  return <>{children}</>;
}

FixedBottomScrollListener.propTypes = {
  children: PropTypes.func,
  // eslint-disable-next-line
  scrollRef: PropTypes.any,
  onBottom: PropTypes.func,
};

function BottomScrollListener({ children, ...props }) {
  return (
    <ReactBottomScrollListener {...props}>
      {(scrollRef) => (
        <FixedBottomScrollListener {...props} scrollRef={scrollRef}>
          {children(scrollRef)}
        </FixedBottomScrollListener>
      )}
    </ReactBottomScrollListener>
  );
}

BottomScrollListener.propTypes = {
  children: PropTypes.func,
};

export default BottomScrollListener;
