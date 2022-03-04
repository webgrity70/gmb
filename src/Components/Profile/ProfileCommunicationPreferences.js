import React, { Component } from 'react';
import { Segment } from 'semantic-ui-react';
import Select from 'react-select';
import profile_service from '../../Services/ProfileService';
import Helpers from '../Utils/Helpers';

class ProfileCommunicationPreferences extends Component {
  constructor(props) {
    super(props);
    this.state = {
      editMode: false,
      preferences: props.preferences || [],
      communicationPreferences: [],
      selectedPreference: {},
    };
  }

  // noinspection JSUnusedLocalSymbols
  UNSAFE_componentWillReceiveProps(nextProps, nextContext) {
    this.setState({ preferences: nextProps.preferences || [] });
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
      .getCommunicationPreferences()
      .then((data) => {
        // TODO: Should not use _mounted. https://reactjs.org/blog/2015/12/16/ismounted-antipattern.html
        if (that._mounted) that.setState({ communicationPreferences: data });
      })
      .catch((e) => {
        console.error(e);
      });
  }

  edit() {
    this.props.showMore();
    this.setState({ editMode: true });
  }

  cancel() {
    this.setState({ editMode: false, preferences: this.props.preferences });
  }

  save() {
    const that = this;
    profile_service
      .updateCommunicationPreferences(this.state.preferences)
      .then((data) => {
        Helpers.createToast(data);
        that.props.updateUser();
        that.setState({ editMode: false });
      })
      .catch((data) => {
        Helpers.createToast(data);
      });
  }

  addPreference() {
    const preferences = this.state.preferences.filter(
      (preference) => preference.value !== this.state.selectedPreference.value
    );
    preferences.push(this.state.selectedPreference);
    this.setState({ preferences });
  }

  onPreferenceChange(value) {
    this.setState({ selectedPreference: value });
  }

  removePreference(value) {
    const preferences = this.state.preferences.filter(
      (preference) => preference.value !== value
    );
    this.setState({ preferences });
  }

  render() {
    if (!this.props.canEdit && this.state.preferences.length === 0) {
      return <React.Fragment />;
    }
    return (
      <Segment className="profile-block">
        <div className={`heading ${this.state.editMode && 'edit-mode'}`}>
          Communication Preferences
        </div>
        <div className="clearfix" />
        <div className="content">
          {this.state.editMode /* Edit mode */ ? (
            <div>
              <ul>
                {this.state.preferences.map((preference, i) => (
                  <li key={i}>
                    {preference.label}{' '}
                    <a onClick={() => this.removePreference(preference.value)}>
                      Delete
                    </a>
                  </li>
                ))}
              </ul>
              <Select
                className="dropdown-single communication-preferences-dropdown"
                value={this.state.selectedPreference}
                onChange={this.onPreferenceChange.bind(this)}
                options={this.state.communicationPreferences}
              />
              <a
                style={{ marginLeft: '7px' }}
                onClick={this.addPreference.bind(this)}
              >
                Add
              </a>
            </div>
          ) : (
            /* View mode */
            <ul id="list-communication-preferences">
              {this.state.preferences.map((preference, i) => (
                <li key={i}>{preference.label}</li>
              ))}
            </ul>
          )}
        </div>
        {this.props.canEdit && (
          <div className="actions">
            <ul>
              {!this.state.editMode && (
                <li onClick={this.edit.bind(this)}>Edit</li>
              )}
              {this.state.editMode && (
                <li onClick={this.cancel.bind(this)}>Cancel</li>
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

export default ProfileCommunicationPreferences;
