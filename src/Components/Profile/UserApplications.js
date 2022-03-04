import React, { Component } from 'react';
import { Checkbox, Segment, Grid } from 'semantic-ui-react';
import profile_service from '../../Services/ProfileService';
import Helpers from '../Utils/Helpers';

class UserApplications extends Component {
  constructor(props) {
    super(props);
    this.state = {
      editMode: false,
      userApplications: [],
      availableApplications: [],
    };
  }

  UNSAFE_componentWillMount() {
    // TODO: Should not use _mounted. https://reactjs.org/blog/2015/12/16/ismounted-antipattern.html
    this._mounted = true;
  }

  componentWillUnmount() {
    // TODO: Should not use _mounted. https://reactjs.org/blog/2015/12/16/ismounted-antipattern.html
    this._mounted = false;
  }

  componentDidMount() {
    const that = this;
    profile_service
      .getApplications()
      .then((data) => {
        // TODO: Should not use _mounted. https://reactjs.org/blog/2015/12/16/ismounted-antipattern.html
        if (that._mounted) that.setState({ availableApplications: data });
      })
      .catch((data) => {
        console.error(data);
      });
    profile_service
      .getUserApplications(this.props.user)
      .then((data) => {
        // TODO: Should not use _mounted. https://reactjs.org/blog/2015/12/16/ismounted-antipattern.html
        if (that._mounted) {
          that.setState({
            userApplications: data,
            originalState: JSON.parse(JSON.stringify(data)),
          });
        }
      })
      .catch((data) => {
        console.error(data);
      });
  }

  updateApps() {
    const that = this;
    profile_service
      .getUserApplications(this.props.user)
      .then((data) => {
        that.setState({ userApplications: data });
      })
      .catch((data) => {
        console.error(data);
      });
  }

  edit() {
    this.setState({ editMode: true });
  }

  cancel() {
    this.updateApps();
    this.setState({ editMode: false });
  }

  save() {
    const appIDs = this.state.userApplications.map((app) => app.pk);

    const that = this;
    profile_service
      .updateApplications(appIDs)
      .then((data) => {
        Helpers.createToast(data);
        that.setState({ editMode: false });
      })
      .catch((data) => {
        Helpers.createToast(data);
      });
  }

  hasApplication(pk) {
    return (
      this.state.userApplications.find((app) => app.pk === pk) !== undefined
    );
  }

  handleChange(data) {
    let userApp = this.state.userApplications;
    if (data.checked) {
      userApp.push({ pk: data.value, name: data.label });
    } else {
      userApp = userApp.filter((app) => app.pk !== data.value);
    }
    this.setState({ userApplications: userApp });
  }

  render() {
    if (this.state.userApplications.length <= 0 && !this.state.editMode) {
      if (!this.props.canEdit) return <React.Fragment />;
      return (
        <span className="orange clickable" onClick={this.edit.bind(this)}>
          Use any apps? Click here to add them.
        </span>
      );
    }
    return (
      <Segment className="profile-block">
        <div className={`heading ${this.state.editMode && 'edit-mode'}`}>
          Apps
        </div>
        <div className="clearfix" />
        <div className="content">
          {this.state.editMode /* Edit mode */ ? (
            <Grid columns={3}>
              {this.state.availableApplications.map((app, i) => (
                <Grid.Column className="app-checkbox" key={i}>
                  <Checkbox
                    label={app.name}
                    value={app.pk}
                    className="custom"
                    checked={this.hasApplication(app.pk)}
                    onChange={(event, data) => this.handleChange(data)}
                  />
                </Grid.Column>
              ))}
            </Grid>
          ) : (
            /* View mode */
            <Grid columns={3}>
              {this.state.userApplications.map((app, i) => (
                <Grid.Column key={i}>{app.name}</Grid.Column>
              ))}
            </Grid>
          )}
        </div>
        {this.props.canEdit && (
          <div className="actions">
            <ul>
              {!this.state.editMode && (
                <li onClick={this.edit.bind(this)}>Edit</li>
              )}
              {this.state.editMode && (
                <li onClick={() => this.cancel()}>Cancel</li>
              )}
              {this.state.editMode && (
                <li onClick={this.save.bind(this)}>Save</li>
              )}
            </ul>
          </div>
        )}
      </Segment>
    );
  }
}

export default UserApplications;
