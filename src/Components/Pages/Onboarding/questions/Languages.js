import React from 'react';
import _ from 'lodash';
import { Form, Button, Dropdown, Select, Icon } from 'semantic-ui-react';
import { connect } from 'react-redux';

const PROFICIENCY = [
  { key: 'Basic', text: 'Basic', value: 'Basic' },
  { key: 'Fluent', text: 'Fluent', value: 'Fluent' },
  { key: 'Native', text: 'Native', value: 'Native' },
];

class Languages extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      language: null,
      proficiency: null,
    };

    this.addLanguage = this.addLanguage.bind(this);
    this.onSelectLanguage = this.onSelectLanguage.bind(this);
    this.onSetProficiency = this.onSetProficiency.bind(this);
    this.removeLanguage = this.removeLanguage.bind(this);
  }

  onSelectLanguage(e, { value }) {
    this.setState({ language: value });
  }

  onSetProficiency(e, { value }) {
    this.setState({ proficiency: value });
  }

  addLanguage() {
    const { proficiency, language } = this.state;
    if (!proficiency || !language) {
      return;
    }
    let { languages, value, onChange } = this.props;
    const selectedLanguage = _.find(languages, { key: language });

    // Check if language is already added
    if (_.some(value, { vale: selectedLanguage.text })) {
      return;
    }

    const languageToAdd = {
      proficiency,
      value: selectedLanguage.value,
      label: selectedLanguage.text,
    };

    value = value || [];
    value.push(languageToAdd);
    onChange(value);
    this.setState({ language: null, proficiency: null });
  }

  removeLanguage(index) {
    const { value, onChange } = this.props;
    value.splice(index, 1);
    onChange(value);
  }

  render() {
    const { value, question, languages } = this.props;

    const {
      onSelectLanguage,
      addLanguage,
      onSetProficiency,
      removeLanguage,
    } = this;
    const { proficiency, language } = this.state;
    return (
      <div className="languages">
        <Form.Field>
          <Select
            search
            icon="search"
            options={languages}
            placeholder={question.placeholder ? question.placeholder : ''}
            onChange={onSelectLanguage}
            value={language}
          />
        </Form.Field>
        <Form.Field>
          <Dropdown
            selection
            placeholder="Proficiency"
            options={PROFICIENCY}
            onChange={onSetProficiency}
            value={proficiency}
          />
        </Form.Field>

        <Form.Field>
          <Button className="add_button" onClick={addLanguage} animated>
            <Button.Content visible>Add</Button.Content>
            <Button.Content hidden>
              <Icon name="check" />
            </Button.Content>
          </Button>
        </Form.Field>
        <div className="selected">
          {!!value && (
            <Form.Field className="selected_title">
              <span className="question_subtitle">You can speak:</span>
            </Form.Field>
          )}
          {_.map(value, (lang, index) => (
            <div
              className="sub_item"
              key={lang.value}
              onClick={() => removeLanguage(index)}
            >
              {`${lang.label} ${lang.proficiency}`}
              <Icon name="close" />
            </div>
          ))}
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  languages: state.signup.languages,
});

export default connect(mapStateToProps)(Languages);
