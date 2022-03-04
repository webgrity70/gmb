import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Button, Icon, Progress } from 'semantic-ui-react';
import _ from 'lodash';

// import { populateFormInfo, populateSignupData } from '../../Actions';
import {
  getInitialData,
  nextQuestion,
  backQuestion,
  addValueToCurrentQuestion,
} from '../../Actions/signup';
import RegisterForm from './Onboarding/RegisterForm';
import Question from './Onboarding/Question';
import RegisterCompleted from './Onboarding/RegisterCompleted';
import { getRegisterLoading } from '../../reducers/session/selectors';
import Loading from '../Loading';

class RegisterPage extends Component {
  componentDidMount() {
    const { getInitialData, history, user } = this.props;
    if (!_.isEmpty(user)) {
      history.push('/dashboard');
    } else {
      getInitialData();
    }
  }

  render() {
    const {
      signup,
      posting,
      nextQuestion,
      backQuestion,
      addValueToCurrentQuestion,
    } = this.props;

    const {
      showForm,
      isLastQuestion,
      moduleIndex,
      questionIndex,
      modules,
      values,
      registered,
    } = signup;

    if (registered) {
      return (
        <div className="register-page">
          <RegisterCompleted />
        </div>
      );
    }

    const currentModule = _.get(modules, `[${moduleIndex}]`, {});
    const currentQuestion = _.cloneDeep(
      _.get(currentModule, `questions[${questionIndex}]`, { question: '' })
    );
    const questionValue = _.get(values, `[${currentQuestion.identifier}]`, '');

    // Replace plaholders if any
    const placeholder = currentQuestion.question.match('{{(.*)}}');
    if (placeholder) {
      currentQuestion.question = currentQuestion.question.replace(
        placeholder[0],
        _.get(values, placeholder[1].trim(), '')
      );
    }

    const onKeyDown = (e) => {
      const targetName = _.get(e, 'target.nodeName');
      const ignoreEnter = e.target.parentElement.getAttribute(
        'data-ignore-enter'
      );
      if (ignoreEnter) return;
      if (
        (e.keyCode === 13 && targetName !== 'TEXTAREA') ||
        (targetName !== 'TEXTAREA' &&
          targetName !== 'INPUT' &&
          e.keyCode === 39)
      ) {
        nextQuestion();
      } else if (
        e.keyCode === 37 &&
        targetName !== 'INPUT' &&
        targetName !== 'TEXTAREA'
      ) {
        backQuestion();
      }
    };

    let nextBtnLabel = '';
    if (isLastQuestion) {
      nextBtnLabel = 'Finish';
    } else if (currentQuestion.optional && _.isEmpty(questionValue)) {
      nextBtnLabel = 'Skip';
    } else {
      nextBtnLabel = 'Next';
    }

    return (
      <div
        className="register-page"
        tabIndex="0"
        onKeyDown={onKeyDown}
        role="button"
      >
        <div className="page-content">
          {posting && <Loading />}
          {!posting && showForm && (
            <RegisterForm onChange={addValueToCurrentQuestion} />
          )}
          {!posting && !showForm && (
            <React.Fragment>
              <div className="question-container">
                <div className="row_small_space ">
                  <div>
                    <div className="section-title">{currentModule.name}</div>
                  </div>
                </div>
                <div className="row_small_space ">
                  <div className="progress_bar">
                    <Progress
                      percent={
                        (100 * (questionIndex + 1)) /
                        _.get(currentModule, 'questions.length', 1)
                      }
                      size="tiny"
                      color="blue"
                    />
                  </div>
                </div>

                <Question
                  question={currentQuestion}
                  onChange={addValueToCurrentQuestion}
                  value={questionValue}
                />
              </div>
              <div className="button_container">
                <Button className="prev_button" onClick={backQuestion}>
                  <Icon name="angle left" />
                </Button>

                <Button
                  className="next_button"
                  color="twitter"
                  animated
                  onClick={nextQuestion}
                >
                  <Button.Content visible>{nextBtnLabel}</Button.Content>
                  <Button.Content hidden>
                    <Icon name="angle right" />
                  </Button.Content>
                </Button>
              </div>
            </React.Fragment>
          )}
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  signup: state.signup,
  posting: getRegisterLoading(state),
});

export default connect(mapStateToProps, {
  getInitialData,
  nextQuestion,
  backQuestion,
  addValueToCurrentQuestion,
})(RegisterPage);
