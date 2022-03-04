/* eslint-disable react/destructuring-assignment */
import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { compose } from 'redux';
import isEmpty from 'lodash/isEmpty';
import isEqual from 'lodash/isEqual';
import Loading from '../../Loading';

const withResource = (config) => (MainComponent) => {
  class Wrap extends PureComponent {
    componentDidMount = () => {
      const { resource, alwaysFetchOnMount } = config;
      const { ownLoading, params, fetchAction } = this.props;
      const resources = this.props[resource];
      const emptyNoLoading = isEmpty(resources) && !ownLoading;
      const willFetch = alwaysFetchOnMount || emptyNoLoading;
      if (willFetch) fetchAction(params);
    };

    componentDidUpdate = ({ params: prevParams }) => {
      const { params, fetchAction } = this.props;
      const willFetch = !isEqual(params, prevParams);
      if (willFetch) fetchAction(params);
    };

    handleError = (error) => {
      const style = { marginTop: '100px', textAlign: 'center' };
      if (error.status === 404) {
        return <h1 style={style}>404</h1>; // TO DO: Create a real component
      }
      const msg = error.detail || JSON.stringify(error);
      return <h1 style={style}>{msg}</h1>; // TO DO: Create a real component
    };

    render() {
      const { resource, skipLoading } = config;
      const { error, ownLoading, ...props } = this.props;
      const emptyData = !props[resource] || isEmpty(props[resource]);
      if (ownLoading) return <Loading />;
      if (emptyData && !skipLoading) {
        if (!error) return null;
        return this.handleError(error);
      }
      return <MainComponent {...props} error={error} />;
    }
  }
  Wrap.propTypes = {
    ownLoading: PropTypes.bool,
    params: PropTypes.oneOfType([
      PropTypes.bool,
      PropTypes.object,
      PropTypes.string,
      PropTypes.number,
    ]),
    fetchAction: PropTypes.func,
    error: PropTypes.oneOfType([PropTypes.object, PropTypes.oneOf([null])]),
  };
  return Wrap;
};

const mapStateToProps = ({
  resource,
  selector,
  paramsSelector,
  fetchingSelector,
  errorSelector,
}) => (state, props) => ({
  [resource]: selector(state, props),
  ownLoading: fetchingSelector ? fetchingSelector(state, props) : false,
  error: errorSelector ? errorSelector(state, props) : null,
  params: paramsSelector ? paramsSelector(state, props) : {},
});

export default ({ fetchAction, ...config }) =>
  compose(
    connect(mapStateToProps(config), { fetchAction }),
    withResource(config)
  );
