import React, { Component } from 'react';
import { Confirm, Icon, Popup } from 'semantic-ui-react';
import buddy_service from '../../../Services/BuddiesService';
import Helpers from '../../Utils/Helpers';
import './ColoredDots.scss';

class ColoredDots extends Component {
  constructor(props) {
    /** @function props.updateCallback */
    /** @function props.buddy */
    /** @function props.status */
    super(props);
    this.state = {
      confirmUnlink: false,
    };
  }

  unlinkBuddy() {
    const that = this;
    this.setState({ confirmUnlink: false });
    buddy_service
      .changeBuddyStatus(
        this.props.buddy.pk || this.props.buddy.id,
        this.props.categoryId,
        'unlink'
      )
      .then((data) => {
        if (that.props.updateCallback) that.props.updateCallback();
        if (that.props.closeSidebarFunction) that.props.closeSidebarFunction();
        Helpers.createToast(data);
      })
      .catch((data) => {
        Helpers.createToast(data);
      });
  }

  dangeredRelationship() {
    const that = this;
    buddy_service
      .changeBuddyStatus(
        this.props.buddy.pk || this.props.buddy.id,
        this.props.categoryId,
        'dangered'
      )
      .then((data) => {
        if (that.props.updateCallback) that.props.updateCallback(true);
        Helpers.createToast(data);
      })
      .catch((data) => {
        Helpers.createToast(data);
      });
  }

  goodRelationship() {
    const that = this;
    buddy_service
      .changeBuddyStatus(
        this.props.buddy.pk || this.props.buddy.id,
        this.props.categoryId,
        'going-great'
      )
      .then((data) => {
        if (that.props.updateCallback) that.props.updateCallback();
        if (that.props.closeSidebarFunction) that.props.closeSidebarFunction();
        Helpers.createToast(data);
      })
      .catch((data) => {
        Helpers.createToast(data);
      });
  }

  render() {
    return (
      <div className="ui text-center colored-dots">
        <Popup
          trigger={
            <Icon
              className={`circle ${
                this.props.status === 'match' ? 'check green' : 'light-green'
              }`}
              onClick={this.goodRelationship.bind(this)}
            />
          }
          content={"It's going great!"}
        />
        <Popup
          trigger={
            <Icon
              className={`circle ${
                this.props.status === 'dangered'
                  ? 'stop yellow'
                  : 'light-yellow'
              }`}
              onClick={this.dangeredRelationship.bind(this)}
            />
          }
          content="Need to talk."
        />
        <Popup
          trigger={
            <Icon
              className="circle light-red"
              onClick={() => this.setState({ confirmUnlink: true })}
            />
          }
          content={
            <div>
              I want to <strong className="orange">unmatch</strong> now!
            </div>
          }
        />
        <Confirm
          open={this.state.confirmUnlink}
          onCancel={() => this.setState({ confirmUnlink: false })}
          onConfirm={this.unlinkBuddy.bind(this)}
        />
      </div>
    );
  }
}

export default ColoredDots;
