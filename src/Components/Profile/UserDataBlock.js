import React, { Component } from 'react';
import { Segment } from 'semantic-ui-react';
import Helpers from '../Utils/Helpers';
import profile_service from '../../Services/ProfileService';

class UserDataBlock extends Component {
  constructor(props) {
    super(props);
    this.state = {
      editMode: false,
      fields: props.fields || [],
    };
  }

  // noinspection JSUnusedLocalSymbols
  UNSAFE_componentWillReceiveProps(nextProps, nextContext) {
    const value = nextProps.value || '';
    this.setState({
      blockName: nextProps.name,
      originalValue: value,
      value,
      identifier: nextProps.identifier,
    });
  }

  handleChange(event, i) {
    const fields = this.state.fields;
    fields[i].value = event.target.value;
    this.setState({ fields });
  }

  edit() {
    this.props.showMore();
    this.setState({ editMode: true });
  }

  cancel() {
    this.setState({ editMode: false, fields: this.props.fields });
  }

  save() {
    const that = this;
    this.state.fields.map((field) => {
      const identifier = field.identifier || Helpers.slugify(field.name);
      profile_service
        .saveField(identifier, field.value)
        .then((data) => {
          Helpers.createToast(data);
          that.props.updateUser(null);
          that.setState({ editMode: false });
        })
        .catch((data) => {
          Helpers.createToast(data);
        });
      return null;
    });
  }

  hasContent() {
    for (let i = 0; i < this.props.fields.length; i++) {
      if (this.props.fields[i].value) {
        return true;
      }
    }
    return false;
  }

  render() {
    if (!this.props.canEdit && !this.hasContent()) {
      return <React.Fragment />;
    }
    return (
      <Segment className="profile-block">
        {this.state.fields.map((field, i) => (
          <React.Fragment key={i}>
            <div className={`heading ${this.state.editMode && 'edit-mode'}`}>
              {field.name}
            </div>
            <div className="clearfix" />
            <div className="content">
              {this.state.editMode && field.type === 'textarea' ? (
                <textarea
                  id={Helpers.slugify(field.name)}
                  value={field.value}
                  onChange={(event) => this.handleChange(event, i)}
                />
              ) : (
                field.value
              )}
            </div>
          </React.Fragment>
        ))}
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

export default UserDataBlock;
