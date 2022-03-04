import { useLayoutEffect } from 'react';
import { withRouter } from 'react-router-dom';

function ScrollToTop({ location, children }) {
  useLayoutEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  return children;
}

export default withRouter(ScrollToTop);
