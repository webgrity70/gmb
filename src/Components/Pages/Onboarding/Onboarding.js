import React, { Component } from 'react';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
import { debounce } from 'lodash';
import onboarding_service from '../../Services/OnboardingService';
import Question from '../Elements/Question';
import CreateAccount from '../Onboarding/CreateAccount';

import './Onboarding.scss';

class Onboarding extends Component {
  nextQuestion = debounce(() => {
    if (!this.isValid()) return;
    const numberOfQuestions = this.getCurrentModule().questions.length - 1;
    let newQuestion = this.state.activeQuestion + 1;
    let found = false;
    while (!found) {
      if (newQuestion >= numberOfQuestions) {
        found = true;
        continue;
      }
      const question = this.getCurrentModule().questions[newQuestion];
      if (question.optional_to_identifier && question.optional_to_value) {
        const value = this.state.data[question.optional_to_identifier];
        if (typeof value === 'object') {
          if (
            value.hasOwnProperty('value') &&
            String(value.value) === String(question.optional_to_value)
          ) {
            found = true;
          } else if (
            value.length > 0 &&
            value.indexOf(parseInt(question.optional_to_value, 10)) > -1
          ) {
            found = true;
          } else if (
            value.length > 0 &&
            value.indexOf(question.optional_to_value) > -1
          ) {
            found = true;
          }
        } else if (String(value) === String(question.optional_to_value)) {
          found = true;
        }
        if (!found) newQuestion += 1;
      } else {
        found = true;
      }
    }
    if (newQuestion <= numberOfQuestions) {
      this.setState({ activeQuestion: newQuestion });
    } else {
      this.nextModule();
    }
  }, 250);

  constructor(props) {
    super(props);
    this.state = {
      modules: [],
      activeModule: 0,
      activeQuestion: 0,
      finished: false,
      data: {},
    };
  }

  nextModule() {
    const numberOfModules = this.state.modules.length - 1;
    const newModule = this.state.activeModule + 1;
    if (newModule <= numberOfModules) {
      this.setState({
        activeModule: newModule,
        activeQuestion: 0,
      });
    } else {
      this.setState({ finished: true });
    }
  }

  previousQuestion() {
    let newQuestion = this.state.activeQuestion - 1;

    let found = false;
    while (!found) {
      const question = this.getCurrentModule().questions[newQuestion];
      if (question.optional_to_identifier && question.optional_to_value) {
        const value = this.state.data[question.optional_to_identifier];
        if (typeof value === 'object') {
          if (
            value.hasOwnProperty('value') &&
            String(value.value) === String(question.optional_to_value)
          ) {
            found = true;
          } else if (
            value.length > 0 &&
            value.indexOf(parseInt(question.optional_to_value, 10)) > -1
          ) {
            found = true;
          } else if (
            value.length > 0 &&
            value.indexOf(question.optional_to_value) > -1
          ) {
            found = true;
          }
        } else if (String(value) === String(question.optional_to_value)) {
          found = true;
        }
        if (!found) newQuestion -= 1;
      } else {
        found = true;
      }
    }
    if (newQuestion >= 0) {
      this.setState({ activeQuestion: newQuestion });
    }
  }

  getCurrentModule() {
    return this.state.modules[this.state.activeModule];
  }

  getCurrentQuestion() {
    return this.state.modules[this.state.activeModule].questions[
      this.state.activeQuestion
    ];
  }

  componentDidMount() {
    const that = this;
    onboarding_service
      .getModules()
      .then((data) => {
        /** @namespace data.name */
        /** @namespace data.questions */
        /** @namespace data.questions.optional_to_identifier */
        /** @namespace data.questions.optional_to_value */
        const finished = data.length === 0;
        that.setState({ modules: data, finished });
      })
      .catch((e) => {
        console.error(e);
      });
  }

  isValid() {
    const question = this.getCurrentQuestion();

    let value = this.state.data[question.identifier];
    if (question.optional) return true;
    if (value === undefined) return false;
    if (typeof value === 'string' || value instanceof String)
      value = value.trim();
    if (
      typeof value === 'object' &&
      value.value === 'other' &&
      (value.name === '' || value.name === undefined) &&
      value.category === undefined
    )
      return false;
    return !(
      value === '' ||
      value === null ||
      value.length === 0 ||
      value === {}
    );
  }

  saveField(value) {
    const data = this.state.data;
    data[this.getCurrentQuestion().identifier] = value;
    this.setState({ data });
  }

  renderQuestionBlock(question, focus = false) {
    return (
      <React.Fragment>
        <div className="heading" style={{ justifyContent: 'center' }}>
          <h4>{question.question}</h4>
        </div>
        <div className="description" style={{ justifyContent: 'center' }}>
          {question.description}
        </div>
        {this.state.modules.length > 0 && (
          <Question
            question={question}
            autoFocus={focus}
            value={
              this.state.data.hasOwnProperty(question.identifier)
                ? this.state.data[question.identifier]
                : ''
            }
            saveField={this.saveField.bind(this)}
            onEnter={this.nextQuestion.bind(this)}
          />
        )}
      </React.Fragment>
    );
  }

  render() {
    let currentQuestion;
    let previousQuestion;
    let nextQuestion;
    try {
      currentQuestion = this.getCurrentModule().questions[
        this.state.activeQuestion
      ];
    } catch (e) {
      if (!this.state.finished)
        return <React.Fragment>Loading...</React.Fragment>;
    }
    try {
      previousQuestion = this.getCurrentModule().questions[
        this.state.activeQuestion - 1
      ];
    } catch (e) {
      previousQuestion = null;
    }
    try {
      nextQuestion = this.getCurrentModule().questions[
        this.state.activeQuestion + 1
      ];
    } catch (e) {
      nextQuestion = null;
    }
    return (
      <React.Fragment>
        <div id="onboarding" className="onboarding_form active">
          <div className="flex_container">
            <div className="onboarding-modules">
              <ul>
                {!this.state.finished &&
                  this.state.modules.map((module, i) => (
                    <li
                      key={i}
                      className={
                        i === this.state.activeModule ? 'active' : undefined
                      }
                    >
                      {module.name}
                      <br />
                      <span className="question-progress">
                        Question{' '}
                        {i === this.state.activeModule
                          ? this.state.activeQuestion + 1
                          : i < this.state.activeModule
                          ? this.state.modules[i].questions.length
                          : 0}{' '}
                        of {this.state.modules[i].questions.length}
                      </span>
                    </li>
                  ))}
              </ul>
            </div>
            <div className="padded">
              <ReactCSSTransitionGroup
                transitionName="vertical-slide"
                transitionEnterTimeout={300}
                transitionLeaveTimeout={300}
              >
                <div key={this.state.activeQuestion}>
                  {this.state.finished && (
                    <React.Fragment>
                      <CreateAccount data={this.state.data} />
                    </React.Fragment>
                  )}
                  {!this.state.finished && (
                    <div>
                      {previousQuestion && (
                        <div className="previous-question">
                          {this.renderQuestionBlock(previousQuestion)}
                        </div>
                      )}
                      <div className="question-block">
                        {this.renderQuestionBlock(currentQuestion, true)}
                      </div>
                      {nextQuestion && (
                        <div className="next-question">
                          {this.renderQuestionBlock(nextQuestion)}
                        </div>
                      )}
                      <div className="navigation">
                        <button
                          onClick={() => this.nextQuestion()}
                          type="button"
                          className="next_btn"
                        >
                          <span className="text"> Next </span>
                        </button>
                        <button
                          style={{
                            display:
                              this.state.activeQuestion === 0
                                ? 'none'
                                : 'block',
                          }}
                          onClick={() => this.previousQuestion()}
                          type="button"
                          className="prev_btn"
                        >
                          <span className="text"> Previous </span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </ReactCSSTransitionGroup>
            </div>
          </div>
        </div>
      </React.Fragment>
    );
  }
}

export default Onboarding;
