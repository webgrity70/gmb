import React from 'react';
import { Segment, Grid, Header, Table } from 'semantic-ui-react';
import * as PropTypes from 'prop-types';
import moment from 'moment';
import SettingsService from '../../../Services/SettingsService';

const propTypes = {
  title: PropTypes.string.isRequired,
};

/** A Settings Block that contain various settings. */
class LoginHistoryBlock extends React.Component {
  state = {
    loginHistory: [],
    loading: true,
  };

  UNSAFE_componentWillMount() {
    this.getLoginHistory();
  }

  getLoginHistory() {
    this.setState({ loading: true });
    SettingsService.loginHistory()
      .then((data) => {
        /**
         * @param data.operating_system
         * @param data.date
         * @param data.location
         */
        this.setState({ loginHistory: data.results, loading: false });
      })
      .catch(() => {
        this.setState({ loading: false });
      });
  }

  render() {
    const { title } = this.props;
    const { loginHistory, loading } = this.state;
    return (
      <Segment className="settings-block">
        <Header as="h2" className="settings-block-title">
          {title}
        </Header>
        <Grid>
          <Grid.Column
            mobile={16}
            tablet={16}
            computer={16}
            className="settings-content"
          >
            <Segment basic loading={loading}>
              <Table>
                <Table.Header>
                  <Table.Row>
                    <Table.HeaderCell>Date</Table.HeaderCell>
                    <Table.HeaderCell>Country</Table.HeaderCell>
                    <Table.HeaderCell>OS</Table.HeaderCell>
                  </Table.Row>
                </Table.Header>
                <Table.Body>
                  {loginHistory.map((item) => (
                    <Table.Row key={item.date}>
                      <Table.Cell>{moment(item.date).format('LL')}</Table.Cell>
                      <Table.Cell>{item.location}</Table.Cell>
                      <Table.Cell>{item.operating_system}</Table.Cell>
                    </Table.Row>
                  ))}
                </Table.Body>
              </Table>
            </Segment>
          </Grid.Column>
        </Grid>
      </Segment>
    );
  }
}

LoginHistoryBlock.propTypes = propTypes;

export default LoginHistoryBlock;
