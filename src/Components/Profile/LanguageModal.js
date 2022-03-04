import React, { Component } from 'react';
import { Checkbox, Grid, Segment } from 'semantic-ui-react';
import Select from 'react-select';
import Form from 'semantic-ui-react/dist/commonjs/collections/Form/Form';
import Helpers from '../Utils/Helpers';
import profile_service from '../../Services/ProfileService';

class LanguageModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      language: {},
      languages: [],
      selectedLanguages: props.languages || [],
      proficiency: 'Native',
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

  // noinspection JSUnusedLocalSymbols
  UNSAFE_componentWillReceiveProps(nextProps, nextContext) {
    this.setState({ selectedLanguages: nextProps.languages || [] });
  }

  componentDidMount() {
    const that = this;
    profile_service
      .getLanguages()
      .then((data) => {
        // TODO: Should not use _mounted. https://reactjs.org/blog/2015/12/16/ismounted-antipattern.html
        if (that._mounted) that.setState({ languages: data });
      })
      .catch((data) => {
        console.error(data);
      });
  }

  setLanguage(value) {
    this.setState({ language: value });
  }

  handleChangeRadio(event, { value }) {
    this.setState({ proficiency: value });
  }

  addLanguage() {
    const newLanguage = this.state.language;

    let languages = this.state.selectedLanguages;
    languages = languages.filter(
      (language) => language.value !== newLanguage.value
    );
    newLanguage.proficiency = this.state.proficiency;
    languages.push(newLanguage);
    this.setState({ language: {}, selectedLanguages: languages });
  }

  removeLanguage(language_code) {
    let languages = this.state.selectedLanguages;
    languages = languages.filter(
      (language) => language.value !== language_code
    );
    this.setState({ selectedLanguages: languages });
  }

  saveLanguages() {
    const that = this;
    profile_service
      .saveLanguages(this.state.selectedLanguages)
      .then((data) => {
        Helpers.createToast(data);
        that.props.updateUser(null);
        that.props.closeModal();
      })
      .catch((data) => {
        Helpers.createToast(data);
      });
  }

  render() {
    return (
      <div
        style={{ display: this.props.open ? '' : 'none' }}
        className="popup-modal"
      >
        <Segment className="profile-block">
          <div
            className="clickable"
            onClick={this.props.closeModal}
            style={{ position: 'absolute', top: '5px', right: '25px' }}
          >
            <i className="fas fa-times" />
          </div>
          <Grid padded className="languages-div">
            <Grid.Column tablet={8}>
              <h4>Please choose languages:</h4>
              <Select
                className="dropdown-single"
                value={this.state.language}
                onChange={this.setLanguage.bind(this)}
                options={this.state.languages}
              />
              <h4>Please select the proficiency level:</h4>
              <Form>
                <Form.Field>
                  <Checkbox
                    radio
                    label="Basic"
                    name="checkboxRadioGroup"
                    value="Basic"
                    checked={this.state.proficiency === 'Basic'}
                    onChange={this.handleChangeRadio.bind(this)}
                  />
                  <Checkbox
                    radio
                    label="Fluent"
                    name="checkboxRadioGroup"
                    value="Fluent"
                    checked={this.state.proficiency === 'Fluent'}
                    onChange={this.handleChangeRadio.bind(this)}
                  />
                  <Checkbox
                    radio
                    label="Native"
                    name="checkboxRadioGroup"
                    value="Native"
                    checked={this.state.proficiency === 'Native'}
                    onChange={this.handleChangeRadio.bind(this)}
                  />
                </Form.Field>
              </Form>
              <button
                onClick={this.addLanguage.bind(this)}
                className={
                  Object.keys(this.state.language).length === 0
                    ? 'ui button disabled'
                    : ' ui button primary'
                }
              >
                Add
              </button>
            </Grid.Column>
            <Grid.Column tablet={8} className="language">
              <h4>Selected Languages:</h4>
              <div className="languages">
                {this.state.selectedLanguages.map((language) => (
                  <div
                    onClick={() => this.removeLanguage(language.value)}
                    className="clickable language-selected"
                    key={language.value}
                  >
                    {language.label}
                  </div>
                ))}
              </div>
            </Grid.Column>
            <Grid.Column tablet={16}>
              <button
                onClick={this.saveLanguages.bind(this)}
                className=" ui button primary forSave text-right"
              >
                Save
              </button>
            </Grid.Column>
          </Grid>
        </Segment>
      </div>
    );
  }
}

export default LanguageModal;
