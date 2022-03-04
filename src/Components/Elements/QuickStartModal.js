import React from 'react';
import { Button, Header, Image, Modal, Icon } from 'semantic-ui-react';

import quickStartLogo from '../../Assets/images/WelcomeBuddy.png';

class QuickStartGuide extends React.Component {
  state = {
    open: true,
  };

  close = () => {
    this.setState({ open: false });
  };

  render() {
    const { open } = this.state;

    return (
      <div>
        <Modal
          dimmer="inverted"
          open={open}
          onClose={this.close}
          className="gmb-modal"
        >
          <Icon name="close" onClick={this.close} />
          <Modal.Content image>
            <Image wrapped size="large" src={quickStartLogo} />
            <Modal.Description>
              <Header>Welcome!</Header>
              <p>
                {' '}
                Here you can access our <b>Quick Start Guide</b> where you can
                find useful information to get the most out of
                GetMotivatedBuddies.{' '}
              </p>
              <div className="actions">
                <br />
                <br />
                <br />
                <a
                  rel="noopener noreferrer"
                  href="https://getmotivatedbuddies.zendesk.com/hc/en-us/articles/360016213753"
                  className="btn"
                  target="_blank"
                  onClick={this.close}
                >
                  Quick Start Guide
                </a>
                <Button content="Later" onClick={this.close} />
              </div>
            </Modal.Description>
          </Modal.Content>
        </Modal>
      </div>
    );
  }
}

export default QuickStartGuide;
