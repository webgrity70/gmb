import React, { Component } from 'react';
import { Icon } from 'semantic-ui-react';

class MaintenancePage extends Component {
  render() {
    return (
      <React.Fragment>
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            height: '100vh',
            flexDirection: 'column',
            textAlign: 'center',
          }}
        >
          <Icon name="wrench" size="massive" color="red" />
          <br />
          <h1>
            We are currently working on the website. <br />
            Please come back later.
          </h1>
        </div>
      </React.Fragment>
    );
  }
}

export default MaintenancePage;
